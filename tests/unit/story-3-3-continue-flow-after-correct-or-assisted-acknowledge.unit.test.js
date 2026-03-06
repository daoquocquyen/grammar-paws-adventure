import { describe, expect, it } from "vitest";

import { CHALLENGE_PHASES, getPrimaryActionState } from "../../src/lib/challengeStateModel";

describe("Story 3.3 unit", () => {
    it("keeps Next disabled until the current question is resolved", () => {
        expect(
            getPrimaryActionState({
                phase: CHALLENGE_PHASES.READY,
                isExplanationVisible: true,
                hasResolvedQuestion: false,
            })
        ).toEqual({
            label: "Next",
            enabled: false,
        });
    });

    it("gates Next until assisted explanation is visible", () => {
        expect(
            getPrimaryActionState({
                phase: CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE,
                isExplanationVisible: false,
                hasResolvedQuestion: true,
            })
        ).toEqual({
            label: "Next",
            enabled: false,
        });
    });
});
