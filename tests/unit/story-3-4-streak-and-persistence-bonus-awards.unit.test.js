import { describe, expect, it } from "vitest";

import {
    calculateChallengeTotals,
    calculateEndOfLevelBonuses,
    calculateStreakBonus,
} from "../../src/lib/challengeScoring";
import { OUTCOME_CLASSES } from "../../src/lib/challengeStateModel";

describe("Story 3.4 unit", () => {
    it("awards streak thresholds at 3 and 5 first-try chain", () => {
        const outcomes = [
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
        ];

        const streak = calculateStreakBonus(outcomes);
        expect(streak.streak3Count).toBe(1);
        expect(streak.streak5Count).toBe(1);
        expect(streak.streakBonusXp).toBe(15);
    });

    it("applies accuracy and persistence bonuses deterministically", () => {
        const outcomes = [
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
        ];

        const bonus = calculateEndOfLevelBonuses(outcomes);
        expect(Math.round(bonus.firstTryAccuracy * 100)).toBe(50);
        expect(bonus.bonusItems.find((item) => item.key === "accuracy")?.xp).toBe(0);
        expect(bonus.bonusItems.find((item) => item.key === "persistence")?.xp).toBe(10);
        expect(bonus.totalBonusXp).toBe(15);
    });

    it("returns total XP from base + bonus", () => {
        const totals = calculateChallengeTotals([
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
        ]);

        expect(totals.summary.baseXp).toBe(50);
        expect(totals.totalBonusXp).toBe(35);
        expect(totals.totalXp).toBe(85);
    });
});
