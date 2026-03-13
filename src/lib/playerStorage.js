export const PROFILE_STORAGE_KEY = "gpa_player_profile_v1";
export const PLAYER_PROFILES_STORAGE_KEY = "gpa_player_profiles_v1";
export const PLAYER_PROGRESS_STORAGE_KEY = "gpa_player_progress_v1";
export const PET_ACCESSORIES_STORAGE_KEY = "gpa_pet_accessories_v1";
export const TOPIC_ATTEMPT_HISTORY_STORAGE_KEY = "gpa_topic_attempt_history_v1";

const PLAYER_SCOPE_SEPARATOR = "__player__";
const PROFILE_DIRECTORY_VERSION = 1;

const normalizePlayerId = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    const normalizedName = value.trim().toLowerCase().replace(/\s+/g, " ");
    if (!normalizedName) {
        return "";
    }

    return encodeURIComponent(normalizedName).replace(/%/g, "_");
};

export const getPlayerIdFromName = (playerName) => normalizePlayerId(playerName);

export const getPlayerIdFromProfile = (profile) => {
    const explicitPlayerId = normalizePlayerId(profile?.playerId);
    if (explicitPlayerId) {
        return explicitPlayerId;
    }

    return getPlayerIdFromName(profile?.name);
};

export const hasExplicitPlayerId = (profile) => Boolean(normalizePlayerId(profile?.playerId));

export const getPlayerScopedStorageKey = (baseStorageKey, playerId) => {
    const safeBaseStorageKey = typeof baseStorageKey === "string" ? baseStorageKey.trim() : "";
    if (!safeBaseStorageKey) {
        return "";
    }

    const safePlayerId = normalizePlayerId(playerId);
    if (!safePlayerId) {
        return safeBaseStorageKey;
    }

    return `${safeBaseStorageKey}${PLAYER_SCOPE_SEPARATOR}${safePlayerId}`;
};

export const getScopedStorageKeyForProfile = (baseStorageKey, profile) =>
    getPlayerScopedStorageKey(baseStorageKey, getPlayerIdFromProfile(profile));

const safeParseJson = (rawValue, fallbackValue = null) => {
    if (typeof rawValue !== "string" || !rawValue.trim()) {
        return fallbackValue;
    }

    try {
        const parsedValue = JSON.parse(rawValue);
        return parsedValue ?? fallbackValue;
    } catch {
        return fallbackValue;
    }
};

const safeTrimString = (value) => (typeof value === "string" ? value.trim() : "");

const resolveStorage = (storage) => {
    if (storage) {
        return storage;
    }

    if (typeof window !== "undefined") {
        return window.localStorage;
    }

    return null;
};

const normalizeDirectoryProfileRecord = (profile) => {
    if (!profile || typeof profile !== "object") {
        return null;
    }

    const name = safeTrimString(profile.name);
    const playerId = getPlayerIdFromProfile(profile);
    if (!name || !playerId) {
        return null;
    }

    const parsedLastPlayed = Date.parse(profile.lastPlayedAt);
    const lastPlayedAt = Number.isNaN(parsedLastPlayed)
        ? null
        : new Date(parsedLastPlayed).toISOString();

    return {
        version: 1,
        playerId,
        name,
        heroId: safeTrimString(profile.heroId),
        heroName: safeTrimString(profile.heroName),
        heroImage: safeTrimString(profile.heroImage),
        petName: safeTrimString(profile.petName),
        petImage: safeTrimString(profile.petImage),
        lastPlayedAt,
    };
};

const sortProfilesByLastPlayedAt = (profiles) => [...profiles].sort((leftProfile, rightProfile) => {
    const leftTimestamp = Date.parse(leftProfile.lastPlayedAt ?? "");
    const rightTimestamp = Date.parse(rightProfile.lastPlayedAt ?? "");
    const safeLeftTimestamp = Number.isNaN(leftTimestamp) ? 0 : leftTimestamp;
    const safeRightTimestamp = Number.isNaN(rightTimestamp) ? 0 : rightTimestamp;
    return safeRightTimestamp - safeLeftTimestamp;
});

export const readPlayerProfileDirectory = (storage) => {
    const resolvedStorage = resolveStorage(storage);
    if (!resolvedStorage) {
        return [];
    }

    const rawDirectory = resolvedStorage.getItem(PLAYER_PROFILES_STORAGE_KEY);
    const parsedDirectory = safeParseJson(rawDirectory);
    const profileRecords = Array.isArray(parsedDirectory)
        ? parsedDirectory
        : Array.isArray(parsedDirectory?.profiles)
            ? parsedDirectory.profiles
            : [];

    const uniqueProfiles = new Map();
    profileRecords.forEach((profileRecord) => {
        const normalizedProfile = normalizeDirectoryProfileRecord(profileRecord);
        if (!normalizedProfile) {
            return;
        }

        uniqueProfiles.set(normalizedProfile.playerId, normalizedProfile);
    });

    return sortProfilesByLastPlayedAt(Array.from(uniqueProfiles.values()));
};

export const writePlayerProfileDirectory = (profiles, storage) => {
    const resolvedStorage = resolveStorage(storage);
    if (!resolvedStorage) {
        return [];
    }

    const normalizedProfiles = Array.isArray(profiles)
        ? profiles
            .map((profileRecord) => normalizeDirectoryProfileRecord(profileRecord))
            .filter(Boolean)
        : [];
    const sortedProfiles = sortProfilesByLastPlayedAt(normalizedProfiles);

    resolvedStorage.setItem(
        PLAYER_PROFILES_STORAGE_KEY,
        JSON.stringify({
            version: PROFILE_DIRECTORY_VERSION,
            profiles: sortedProfiles,
        })
    );

    return sortedProfiles;
};

export const upsertPlayerProfileDirectory = (profile, storage, playedAt = new Date().toISOString()) => {
    const normalizedProfile = normalizeDirectoryProfileRecord(profile);
    if (!normalizedProfile) {
        return readPlayerProfileDirectory(storage);
    }

    const currentProfiles = readPlayerProfileDirectory(storage);
    const existingProfile = currentProfiles.find((storedProfile) => storedProfile.playerId === normalizedProfile.playerId);

    const nextProfilesWithoutTarget = currentProfiles.filter(
        (storedProfile) => storedProfile.playerId !== normalizedProfile.playerId
    );

    const nextProfile = {
        ...(existingProfile ?? {}),
        ...normalizedProfile,
        lastPlayedAt: playedAt,
    };

    return writePlayerProfileDirectory([nextProfile, ...nextProfilesWithoutTarget], storage);
};

export const bootstrapPlayerProfileDirectoryFromActiveProfile = (storage) => {
    const resolvedStorage = resolveStorage(storage);
    if (!resolvedStorage) {
        return [];
    }

    const activeProfileRaw = resolvedStorage.getItem(PROFILE_STORAGE_KEY);
    const activeProfile = safeParseJson(activeProfileRaw);
    if (activeProfile && typeof activeProfile === "object") {
        return upsertPlayerProfileDirectory(activeProfile, resolvedStorage);
    }

    return readPlayerProfileDirectory(resolvedStorage);
};
