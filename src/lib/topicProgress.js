const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

export const clampPercent = (value) => {
    if (!isFiniteNumber(value)) {
        return 0;
    }

    return Math.max(0, Math.min(100, value));
};

const toNonNegativeNumber = (value) => {
    if (!isFiniteNumber(value)) {
        return null;
    }

    return Math.max(0, value);
};

const getPercentFromXp = (earnedBaseXp, maxBaseXp) => {
    if (!isFiniteNumber(earnedBaseXp) || !isFiniteNumber(maxBaseXp) || maxBaseXp <= 0) {
        return null;
    }

    return clampPercent((Math.max(0, earnedBaseXp) / maxBaseXp) * 100);
};

export const extractTopicProgressMetrics = (topicProgressValue) => {
    if (isFiniteNumber(topicProgressValue)) {
        return {
            percent: clampPercent(topicProgressValue),
            earnedBaseXp: null,
            maxBaseXp: null,
        };
    }

    if (!topicProgressValue || typeof topicProgressValue !== "object") {
        return {
            percent: 0,
            earnedBaseXp: null,
            maxBaseXp: null,
        };
    }

    const earnedBaseXp = toNonNegativeNumber(topicProgressValue.earnedBaseXp)
        ?? toNonNegativeNumber(topicProgressValue.baseXp)
        ?? toNonNegativeNumber(topicProgressValue.earnedXp);
    const maxBaseXp = toNonNegativeNumber(topicProgressValue.maxBaseXp)
        ?? toNonNegativeNumber(topicProgressValue.maxXp);

    const xpPercent = getPercentFromXp(earnedBaseXp, maxBaseXp);
    if (xpPercent !== null) {
        return {
            percent: xpPercent,
            earnedBaseXp,
            maxBaseXp,
        };
    }

    const fallbackPercent = toNonNegativeNumber(topicProgressValue.percent)
        ?? toNonNegativeNumber(topicProgressValue.progress)
        ?? toNonNegativeNumber(topicProgressValue.completionPercent)
        ?? 0;

    return {
        percent: clampPercent(fallbackPercent),
        earnedBaseXp: null,
        maxBaseXp: null,
    };
};

export const getMasteryLabelByPercent = (percent) => {
    const normalizedPercent = clampPercent(percent);
    if (normalizedPercent >= 100) {
        return "MASTERED";
    }
    if (normalizedPercent >= 80) {
        return "STRONG";
    }
    if (normalizedPercent >= 50) {
        return "GROWING";
    }
    if (normalizedPercent >= 25) {
        return "BUILDING";
    }
    return "IN PROGRESS";
};
