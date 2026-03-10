import { OUTCOME_CLASSES } from "./challengeStateModel";

export const BASE_XP_BY_OUTCOME = Object.freeze({
    [OUTCOME_CLASSES.FIRST_TRY_CORRECT]: 10,
    [OUTCOME_CLASSES.SECOND_TRY_CORRECT]: 8,
    [OUTCOME_CLASSES.ASSISTED]: 3,
    [OUTCOME_CLASSES.SKIPPED]: 0,
});

export const PASS_THRESHOLD = 0.8;
export const MAX_BASE_XP_PER_QUESTION = BASE_XP_BY_OUTCOME[OUTCOME_CLASSES.FIRST_TRY_CORRECT] ?? 10;

export const getMaxBaseXp = (totalQuestions) => {
    const safeTotalQuestions = Number.isFinite(totalQuestions) ? Math.max(0, Math.floor(totalQuestions)) : 0;
    return safeTotalQuestions * MAX_BASE_XP_PER_QUESTION;
};

export const getRequiredBaseXpToPass = (totalQuestions) => Math.ceil(getMaxBaseXp(totalQuestions) * PASS_THRESHOLD);

export const getBaseXpForOutcome = (outcomeClass) => BASE_XP_BY_OUTCOME[outcomeClass] ?? 0;

export const summarizeOutcomes = (outcomes) => {
    const safeOutcomes = Array.isArray(outcomes) ? outcomes : [];
    const totalQuestions = safeOutcomes.length;

    const counts = safeOutcomes.reduce(
        (accumulator, outcomeClass) => {
            if (outcomeClass === OUTCOME_CLASSES.FIRST_TRY_CORRECT) {
                accumulator.firstTryCount += 1;
                accumulator.correctCount += 1;
            } else if (outcomeClass === OUTCOME_CLASSES.SECOND_TRY_CORRECT) {
                accumulator.secondTryCount += 1;
                accumulator.correctCount += 1;
                accumulator.correctedMistakeCount += 1;
            } else if (outcomeClass === OUTCOME_CLASSES.ASSISTED) {
                accumulator.assistedCount += 1;
            } else if (outcomeClass === OUTCOME_CLASSES.SKIPPED) {
                accumulator.skippedCount += 1;
            }

            accumulator.baseXp += getBaseXpForOutcome(outcomeClass);
            return accumulator;
        },
        {
            firstTryCount: 0,
            secondTryCount: 0,
            assistedCount: 0,
            skippedCount: 0,
            correctedMistakeCount: 0,
            correctCount: 0,
            baseXp: 0,
        }
    );

    const accuracyRate = totalQuestions > 0 ? counts.correctCount / totalQuestions : 0;
    const firstTryAccuracy = totalQuestions > 0 ? counts.firstTryCount / totalQuestions : 0;
    const maxBaseXp = getMaxBaseXp(totalQuestions);
    const requiredBaseXpToPass = getRequiredBaseXpToPass(totalQuestions);
    const xpPassRate = maxBaseXp > 0 ? counts.baseXp / maxBaseXp : 0;
    const passProgressRate = requiredBaseXpToPass > 0 ? counts.baseXp / requiredBaseXpToPass : 0;
    const passed = totalQuestions > 0 && counts.baseXp >= requiredBaseXpToPass;

    return {
        ...counts,
        totalQuestions,
        accuracyRate,
        firstTryAccuracy,
        maxBaseXp,
        requiredBaseXpToPass,
        xpPassRate,
        passProgressRate,
        passRate: xpPassRate,
        passed,
    };
};

export const calculateChallengeTotals = (outcomes) => {
    const summary = summarizeOutcomes(outcomes);
    return {
        summary,
        totalXp: summary.baseXp,
    };
};
