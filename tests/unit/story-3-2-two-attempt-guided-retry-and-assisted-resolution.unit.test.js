import { describe, expect, it } from "vitest";

import { CHALLENGE_PHASES, resolvePhaseFromAttempt } from "../../src/lib/challengeStateModel";

describe("Story 3.2 unit", () => {
    it("allows maximum two independent attempts before assisted phase", () => {
        const firstAttemptWrong = resolvePhaseFromAttempt({ attemptCount: 0, isCorrect: false });
        const secondAttemptWrong = resolvePhaseFromAttempt({ attemptCount: 1, isCorrect: false });
        const extraAttempt = resolvePhaseFromAttempt({ attemptCount: 2, isCorrect: false });

        expect(firstAttemptWrong).toBe(CHALLENGE_PHASES.WRONG_FIRST);
        expect(secondAttemptWrong).toBe(CHALLENGE_PHASES.ASSISTED);
        expect(extraAttempt).toBe(CHALLENGE_PHASES.ASSISTED);
    });

    it("keeps transition order from wrong_first to correct_second on guided retry", () => {
        const guidedRetryResolution = resolvePhaseFromAttempt({ attemptCount: 1, isCorrect: true });
        expect(guidedRetryResolution).toBe(CHALLENGE_PHASES.CORRECT_SECOND);
    });
});
