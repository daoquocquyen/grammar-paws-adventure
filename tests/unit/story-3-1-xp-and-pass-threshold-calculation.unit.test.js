import { describe, expect, it } from "vitest";

import {
    getBaseXpForOutcome,
    PASS_THRESHOLD,
    summarizeOutcomes,
} from "../../src/lib/challengeScoring";
import { OUTCOME_CLASSES } from "../../src/lib/challengeStateModel";

describe("Story 3.1 unit", () => {
    it("maps base XP exactly by outcome class", () => {
        expect(getBaseXpForOutcome(OUTCOME_CLASSES.FIRST_TRY_CORRECT)).toBe(10);
        expect(getBaseXpForOutcome(OUTCOME_CLASSES.SECOND_TRY_CORRECT)).toBe(6);
        expect(getBaseXpForOutcome(OUTCOME_CLASSES.ASSISTED)).toBe(3);
        expect(getBaseXpForOutcome(OUTCOME_CLASSES.SKIPPED)).toBe(0);
    });

    it("computes pass/fail with >=80% threshold and mixed outcomes", () => {
        const result = summarizeOutcomes([
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.ASSISTED,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
        ]);

        expect(PASS_THRESHOLD).toBe(0.8);
        expect(result.correctCount).toBe(4);
        expect(result.totalQuestions).toBe(5);
        expect(result.passRate).toBe(0.8);
        expect(result.passed).toBe(true);
        expect(result.baseXp).toBe(39);
    });

    it("fails pass threshold when score is below 80%", () => {
        const result = summarizeOutcomes([
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.SECOND_TRY_CORRECT,
            OUTCOME_CLASSES.FIRST_TRY_CORRECT,
            OUTCOME_CLASSES.ASSISTED,
            OUTCOME_CLASSES.SKIPPED,
        ]);

        expect(result.correctCount).toBe(3);
        expect(result.totalQuestions).toBe(5);
        expect(result.passRate).toBe(0.6);
        expect(result.passed).toBe(false);
    });
});
