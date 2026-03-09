export const PROFILE_STORAGE_KEY = "gpa_player_profile_v1";
export const PLAYER_PROGRESS_STORAGE_KEY = "gpa_player_progress_v1";
export const PET_ACCESSORIES_STORAGE_KEY = "gpa_pet_accessories_v1";
export const TOPIC_ATTEMPT_HISTORY_STORAGE_KEY = "gpa_topic_attempt_history_v1";

const PLAYER_SCOPE_SEPARATOR = "__player__";

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
