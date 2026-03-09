import { describe, expect, it } from "vitest";

import {
    getBaseXpForOutcome,
    getRequiredBaseXpToPass,
    PASS_THRESHOLD,
    summarizeOutcomes,
} from "../../src/lib/challengeScoring";
import { OUTCOME_CLASSES } from "../../src/lib/challengeStateModel";

describe("Story 3.1 unit", () => {
    it("maps base XP exactly by outcome class", () => {
        expect(getBaseXpForOutcome(OUTCOME_CLASSES.FIRST_TRY_CORRECT)).toBe(10);
        expect(getBaseXpForOutcome(OUTCOME_CLASSES.SECOND_TRY_CORRECT)).toBe(8);
        expect(getBaseXpForOutcome(OUTCOME_CLASSES.ASSISTED)).toBe(3);
        expect(getBaseXpForOutcome(OUTCOME_CLASSES.SKIPPED)).toBe(0);
    });

    it("passes when earned base XP reaches XP threshold", () => {
        const result = summarizeOutcomes([
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.ASSISTED,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
        ]);

        expect(PASS_THRESHOLD).toBe(0.8);
        expect(getRequiredBaseXpToPass(5)).toBe(40);
        expect(result.correctCount).toBe(4);
        expect(result.totalQuestions).toBe(5);
        expect(result.accuracyRate).toBe(0.8);
        expect(result.requiredBaseXpToPass).toBe(40);
        expect(result.maxBaseXp).toBe(50);
        expect(result.xpPassRate).toBe(0.82);
        expect(result.passed).toBe(true);
        expect(result.baseXp).toBe(41);
    });

    it("fails XP threshold when earned base XP is below required", () => {
        const result = summarizeOutcomes([
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.ASSISTED,
            OUTCOME_CLASSES.SKIPPED,
        ]);

        expect(result.correctCount).toBe(3);
        expect(result.totalQuestions).toBe(5);
        expect(result.accuracyRate).toBe(0.6);
        expect(result.baseXp).toBe(31);
        expect(result.requiredBaseXpToPass).toBe(40);
        expect(result.passed).toBe(false);
    });

    it("fails even at 80% accuracy when XP is below the pass requirement", () => {
        const result = summarizeOutcomes([
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.SKIPPED,
        ]);

        expect(result.accuracyRate).toBe(0.8);
        expect(result.baseXp).toBe(32);
        expect(result.requiredBaseXpToPass).toBe(40);
        expect(result.passed).toBe(false);
    });
});
