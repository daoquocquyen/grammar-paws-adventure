import {
    PET_ACCESSORIES_STORAGE_KEY,
    PLAYER_PROGRESS_STORAGE_KEY,
    getScopedStorageKeyForProfile,
} from "./playerStorage";

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

export const defaultProgressState = {
    version: 1,
    completedTopics: [],
    topicProgress: {},
};

export const defaultAccessoriesState = {
    version: 1,
    unlockedAccessoryIds: [],
    equippedAccessoryId: null,
};

const isValidProgressState = (value) =>
    Boolean(
        value
        && typeof value === "object"
        && Array.isArray(value.completedTopics)
        && value.topicProgress
        && typeof value.topicProgress === "object"
    );

const isValidAccessoriesState = (value) =>
    Boolean(
        value
        && typeof value === "object"
        && Array.isArray(value.unlockedAccessoryIds)
    );

export const ensureReturningState = ({ profile = null, allowLegacyBootstrap = false } = {}) => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const scopedProgressKey = getScopedStorageKeyForProfile(PLAYER_PROGRESS_STORAGE_KEY, profile);
        const scopedAccessoriesKey = getScopedStorageKeyForProfile(PET_ACCESSORIES_STORAGE_KEY, profile);

        const scopedProgressRaw = localStorage.getItem(scopedProgressKey);
        const scopedAccessoriesRaw = localStorage.getItem(scopedAccessoriesKey);

        const legacyProgressRaw = allowLegacyBootstrap && scopedProgressKey !== PLAYER_PROGRESS_STORAGE_KEY
            ? localStorage.getItem(PLAYER_PROGRESS_STORAGE_KEY)
            : null;
        const legacyAccessoriesRaw = allowLegacyBootstrap && scopedAccessoriesKey !== PET_ACCESSORIES_STORAGE_KEY
            ? localStorage.getItem(PET_ACCESSORIES_STORAGE_KEY)
            : null;

        const progressCandidateRaw = scopedProgressRaw ?? legacyProgressRaw;
        const accessoriesCandidateRaw = scopedAccessoriesRaw ?? legacyAccessoriesRaw;

        const parsedProgress = safeParseJson(progressCandidateRaw);
        const parsedAccessories = safeParseJson(accessoriesCandidateRaw);

        const nextProgress = isValidProgressState(parsedProgress)
            ? parsedProgress
            : defaultProgressState;
        const nextAccessories = isValidAccessoriesState(parsedAccessories)
            ? parsedAccessories
            : defaultAccessoriesState;

        const serializedProgress = JSON.stringify(nextProgress);
        const serializedAccessories = JSON.stringify(nextAccessories);

        localStorage.setItem(scopedProgressKey, serializedProgress);
        localStorage.setItem(scopedAccessoriesKey, serializedAccessories);

        // Keep base keys synced to active learner for backward compatibility.
        if (scopedProgressKey !== PLAYER_PROGRESS_STORAGE_KEY) {
            localStorage.setItem(PLAYER_PROGRESS_STORAGE_KEY, serializedProgress);
        }
        if (scopedAccessoriesKey !== PET_ACCESSORIES_STORAGE_KEY) {
            localStorage.setItem(PET_ACCESSORIES_STORAGE_KEY, serializedAccessories);
        }
    } catch (error) {
        console.error("Failed to initialize returning learner state", error);
        localStorage.setItem(PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify(defaultProgressState));
        localStorage.setItem(PET_ACCESSORIES_STORAGE_KEY, JSON.stringify(defaultAccessoriesState));
    }
};
