const QUESTION_COUNT_MULTIPLIER = 3;
const MIN_CHALLENGE_QUESTION_COUNT = 6;
const MAX_CHALLENGE_QUESTION_COUNT = 15;

const normalizeAspectCount = (aspectCount) => {
    if (!Number.isFinite(aspectCount)) {
        return 0;
    }

    return Math.max(0, Math.floor(aspectCount));
};

export const getChallengeQuestionCount = (aspectCount) => {
    const safeAspectCount = normalizeAspectCount(aspectCount);
    const rawQuestionCount = safeAspectCount * QUESTION_COUNT_MULTIPLIER;

    return Math.min(
        MAX_CHALLENGE_QUESTION_COUNT,
        Math.max(MIN_CHALLENGE_QUESTION_COUNT, rawQuestionCount)
    );
};

export {
    MAX_CHALLENGE_QUESTION_COUNT, MIN_CHALLENGE_QUESTION_COUNT, QUESTION_COUNT_MULTIPLIER
};

