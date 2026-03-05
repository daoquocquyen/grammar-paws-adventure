import { describe, expect, it } from "vitest";
import { validateOnboardingInput } from "../../src/lib/onboardingValidation";

describe("Story 1.1 unit", () => {
    it("blocks missing name, hero, and pet", () => {
        const result = validateOnboardingInput("   ", null, null);

        expect(result.nameError).toBe("Please enter your name so your pet can cheer for you!");
        expect(result.heroError).toBe("Please choose one 3D hero before you start.");
        expect(result.petError).toBe("Please choose one companion before you start.");
    });
});
