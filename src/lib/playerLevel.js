import { extractTopicProgressMetrics } from "./topicProgress";

const levelBands = [
    { min: 1, max: 3, title: "Explorer" },
    { min: 4, max: 6, title: "Pathfinder" },
    { min: 7, max: 9, title: "Trailblazer" },
    { min: 10, max: 12, title: "Guardian" },
    { min: 13, max: 15, title: "Champion" },
];

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

    if (progressState.topicProgress && typeof progressState.topicProgress === "object") {
        Object.entries(progressState.topicProgress).forEach(([topicKey, topicProgressValue]) => {
            const nextValue = extractTopicProgressMetrics(topicProgressValue).percent;
            if (nextValue >= 100 && typeof topicKey === "string" && topicKey.trim()) {
                completedTopicSet.add(topicKey.trim());
            }
        });
    }

    // Level tracks linear content progression:
    // base level 1 + one level per completed topic.
    const computedLevel = Math.max(1, 1 + completedTopicSet.size);

    return {
        level: computedLevel,
        title: getLevelTitle(computedLevel),
    };
};
