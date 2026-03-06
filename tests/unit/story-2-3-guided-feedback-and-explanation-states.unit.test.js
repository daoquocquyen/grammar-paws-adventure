import { describe, expect, it } from "vitest";

import {
    CHALLENGE_PHASES,
    EXPLANATION_DELAY_MS,
    getHeroFeedbackText,
    getPrimaryActionState,
    resolvePhaseFromAttempt,
} from "../../src/lib/challengeStateModel";

describe("Story 2.3 unit", () => {
    it("transitions from first wrong to second correct and assisted phases deterministically", () => {
        expect(resolvePhaseFromAttempt({ attemptCount: 0, isCorrect: false })).toBe(CHALLENGE_PHASES.WRONG_FIRST);
        expect(resolvePhaseFromAttempt({ attemptCount: 1, isCorrect: true })).toBe(CHALLENGE_PHASES.CORRECT_SECOND);
        expect(resolvePhaseFromAttempt({ attemptCount: 1, isCorrect: false })).toBe(CHALLENGE_PHASES.ASSISTED);
    });

    it("keeps first wrong explanation non-revealing", () => {
        const feedback = getHeroFeedbackText({
            phase: CHALLENGE_PHASES.WRONG_FIRST,
            question: { hint: "choose the helper verb that matches the subject" },
            selectedAnswer: "are",
            correctAnswer: "is",
            isRetrySelectionActive: false,
            isExplanationVisible: true,
        });

        expect(feedback).toContain("This sentence needs");
        expect(feedback).not.toContain("\"is\"");
    });

    it("maps primary action labels by phase", () => {
        expect(getPrimaryActionState({ phase: CHALLENGE_PHASES.WRONG_FIRST, isExplanationVisible: true, hasResolvedQuestion: false })).toEqual({
            label: "Continue",
            enabled: false,
        });

        expect(getPrimaryActionState({ phase: CHALLENGE_PHASES.CORRECT_FIRST, isExplanationVisible: true, hasResolvedQuestion: true })).toEqual({
            label: "Continue",
            enabled: true,
        });

        expect(getPrimaryActionState({ phase: CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE, isExplanationVisible: true, hasResolvedQuestion: true })).toEqual({
            label: "I understand",
            enabled: true,
        });
    });

    it("uses explanation delay inside 400-600ms window", () => {
        expect(EXPLANATION_DELAY_MS).toBeGreaterThanOrEqual(400);
        expect(EXPLANATION_DELAY_MS).toBeLessThanOrEqual(600);
    });
});
