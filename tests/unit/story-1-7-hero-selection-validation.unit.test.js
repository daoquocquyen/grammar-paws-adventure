import { describe, expect, it } from "vitest";
import { validateOnboardingInput } from "../../src/lib/onboardingValidation";

describe("Story 1.7 unit", () => {
    it("requires hero selection even when name and pet exist", () => {
        const result = validateOnboardingInput("Mia", null, { name: "Golden Retriever" });

        expect(result.nameError).toBe("");
        expect(result.petError).toBe("");
        expect(result.heroError).toBe("Please choose one 3D hero before you start.");
    });
});
