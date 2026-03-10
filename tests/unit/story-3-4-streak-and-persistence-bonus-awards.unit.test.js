import { describe, expect, it } from "vitest";

import {
    calculateChallengeTotals,
    summarizeOutcomes,
} from "../../src/lib/challengeScoring";
import { OUTCOME_CLASSES } from "../../src/lib/challengeStateModel";

describe("Story 3.4 unit", () => {
    it("summarizes first-try accuracy from canonical outcomes", () => {
        const outcomes = [
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
        ];

        const summary = summarizeOutcomes(outcomes);
        expect(summary.firstTryCount).toBe(3);
        expect(summary.totalQuestions).toBe(5);
        expect(summary.firstTryAccuracy).toBeCloseTo(0.6, 8);
    });

    it("keeps pass-gate progress tied to base XP only", () => {
        const outcomes = [
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
        ];

        const summary = summarizeOutcomes(outcomes);
        expect(summary.baseXp).toBe(54);
        expect(summary.requiredBaseXpToPass).toBe(48);
        expect(summary.passProgressRate).toBeCloseTo(1.125, 8);
    });

    it("returns total XP equal to base XP without end-of-level bonuses", () => {
        const totals = calculateChallengeTotals([
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
        ]);

        expect(totals.summary.baseXp).toBe(50);
        expect(totals.totalXp).toBe(50);
    });
});
