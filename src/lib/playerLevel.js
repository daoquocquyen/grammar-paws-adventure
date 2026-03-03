const levelBands = [
    { min: 1, max: 3, title: "Explorer" },
    { min: 4, max: 6, title: "Pathfinder" },
    { min: 7, max: 9, title: "Trailblazer" },
    { min: 10, max: 12, title: "Guardian" },
    { min: 13, max: 15, title: "Champion" },
];

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

const clampPercent = (value) => {
    if (!isFiniteNumber(value)) {
        return 0;
    }

    return Math.max(0, Math.min(100, value));
};

const extractTopicPercent = (topicProgressValue) => {
    if (isFiniteNumber(topicProgressValue)) {
        return clampPercent(topicProgressValue);
    }

    if (!topicProgressValue || typeof topicProgressValue !== "object") {
        return 0;
    }

    if (isFiniteNumber(topicProgressValue.percent)) {
        return clampPercent(topicProgressValue.percent);
    }

    if (isFiniteNumber(topicProgressValue.progress)) {
        return clampPercent(topicProgressValue.progress);
    }

    if (isFiniteNumber(topicProgressValue.completionPercent)) {
        return clampPercent(topicProgressValue.completionPercent);
    }

    return 0;
};

export const getLevelTitle = (level) => {
    const foundBand = levelBands.find((band) => level >= band.min && level <= band.max);
    return foundBand?.title ?? "Legend";
};

export const getPlayerLevelInfo = (progressState) => {
    if (!progressState || typeof progressState !== "object") {
        return { level: 1, title: getLevelTitle(1) };
    }

    const completedTopics = Array.isArray(progressState.completedTopics) ? progressState.completedTopics : [];
    const completedTopicSet = new Set(
        completedTopics.filter((topicKey) => typeof topicKey === "string" && topicKey.trim()).map((topicKey) => topicKey.trim())
    );

    const normalizedTopicProgress = {};

    completedTopicSet.forEach((topicKey) => {
        normalizedTopicProgress[topicKey] = 100;
    });

    if (progressState.topicProgress && typeof progressState.topicProgress === "object") {
        Object.entries(progressState.topicProgress).forEach(([topicKey, topicProgressValue]) => {
            const existingValue = normalizedTopicProgress[topicKey] ?? 0;
            const nextValue = extractTopicPercent(topicProgressValue);
            normalizedTopicProgress[topicKey] = Math.max(existingValue, nextValue);
        });
    }

    const totalProgressPoints = Object.values(normalizedTopicProgress).reduce((sum, topicPercent) => sum + topicPercent, 0);
    const computedLevel = Math.max(1, 1 + Math.floor(totalProgressPoints / 50));

    return {
        level: computedLevel,
        title: getLevelTitle(computedLevel),
    };
};
