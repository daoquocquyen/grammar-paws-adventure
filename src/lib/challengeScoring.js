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
    const maxBaseXp = getMaxBaseXp(totalQuestions);
    const requiredBaseXpToPass = getRequiredBaseXpToPass(totalQuestions);
    const xpPassRate = maxBaseXp > 0 ? counts.baseXp / maxBaseXp : 0;
    const passProgressRate = requiredBaseXpToPass > 0 ? counts.baseXp / requiredBaseXpToPass : 0;
    const passed = totalQuestions > 0 && counts.baseXp >= requiredBaseXpToPass;

    return {
        ...counts,
        totalQuestions,
        accuracyRate,
        maxBaseXp,
        requiredBaseXpToPass,
        xpPassRate,
        passProgressRate,
        passRate: xpPassRate,
        passed,
    };
};

export const calculateStreakBonus = (outcomes) => {
    const safeOutcomes = Array.isArray(outcomes) ? outcomes : [];
    let currentStreak = 0;
    let streakBonusXp = 0;
    let streak3Count = 0;
    let streak5Count = 0;

    safeOutcomes.forEach((outcomeClass) => {
        if (outcomeClass === OUTCOME_CLASSES.FIRST_TRY_CORRECT) {
            currentStreak += 1;
            if (currentStreak === 3) {
                streakBonusXp += 5;
                streak3Count += 1;
            }
            if (currentStreak === 5) {
                streakBonusXp += 10;
                streak5Count += 1;
            }
            return;
        }

        currentStreak = 0;
    });

    return {
        streakBonusXp,
        streak3Count,
        streak5Count,
    };
};

export const calculateEndOfLevelBonuses = (outcomes) => {
    const summary = summarizeOutcomes(outcomes);
    const streak = calculateStreakBonus(outcomes);

    const firstTryAccuracy = summary.totalQuestions > 0 ? summary.firstTryCount / summary.totalQuestions : 0;
    const firstTryAccuracyBonusXp = firstTryAccuracy >= 0.7 ? 20 : 0;
    const persistenceBonusXp = summary.correctedMistakeCount >= 3 ? 10 : 0;

    const bonusItems = [
        {
            key: "streak",
            label: "First-try streak bonus",
            xp: streak.streakBonusXp,
            message: streak.streakBonusXp > 0
                ? `Great rhythm! Streak bonus +${streak.streakBonusXp} XP.`
                : "Keep building first-try streaks for bonus XP.",
        },
        {
            key: "accuracy",
            label: "First-try accuracy bonus",
            xp: firstTryAccuracyBonusXp,
            message: firstTryAccuracyBonusXp > 0
                ? "Excellent consistency! Accuracy bonus +20 XP."
                : "Reach 70% first-try accuracy for +20 XP.",
        },
        {
            key: "persistence",
            label: "Persistence bonus",
            xp: persistenceBonusXp,
            message: persistenceBonusXp > 0
                ? "Awesome persistence! Correction bonus +10 XP."
                : "Correct 3 or more mistakes for +10 XP.",
        },
    ];

    const totalBonusXp = bonusItems.reduce((sum, item) => sum + item.xp, 0);

    return {
        firstTryAccuracy,
        totalBonusXp,
        bonusItems,
        streak,
        summary,
    };
};

export const calculateChallengeTotals = (outcomes) => {
    const bonus = calculateEndOfLevelBonuses(outcomes);
    const totalXp = bonus.summary.baseXp + bonus.totalBonusXp;

    return {
        ...bonus,
        totalXp,
    };
};
