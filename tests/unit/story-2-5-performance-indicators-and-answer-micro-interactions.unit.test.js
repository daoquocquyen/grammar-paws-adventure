import { describe, expect, it } from "vitest";

import {
    getIndicatorForOutcome,
    getIndicatorGlyph,
    OUTCOME_CLASSES,
} from "../../src/lib/challengeStateModel";

describe("Story 2.5 unit", () => {
    it("maps outcome classes to performance indicators", () => {
        expect(getIndicatorForOutcome(OUTCOME_CLASSES.FIRST_TRY_CORRECT)).toBe("STAR");
        expect(getIndicatorForOutcome(OUTCOME_CLASSES.SECOND_TRY_CORRECT)).toBe("HOLLOW_STAR");
        expect(getIndicatorForOutcome(OUTCOME_CLASSES.ASSISTED)).toBe("CHECK");
        expect(getIndicatorForOutcome("unknown")).toBe("EMPTY");
    });

    it("renders only approved glyphs for scored outcomes", () => {
        expect(getIndicatorGlyph("STAR")).toBe("⭐");
        expect(getIndicatorGlyph("HOLLOW_STAR")).toBe("☆");
        expect(getIndicatorGlyph("CHECK")).toBe("✓");
        expect(getIndicatorGlyph("EMPTY")).toBe("");
    });
});
