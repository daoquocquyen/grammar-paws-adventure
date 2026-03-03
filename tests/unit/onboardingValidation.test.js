import { describe, expect, it } from "vitest";
import { validateOnboardingInput } from "../../src/lib/onboardingValidation";

describe("validateOnboardingInput", () => {
    it("returns both errors when name and pet are missing", () => {
        const result = validateOnboardingInput("   ", null);

        expect(result.nameError).toBe("Please enter your name so your pet can cheer for you!");
        expect(result.petError).toBe("Please choose one companion before you start.");
    });

    it("returns no errors when valid name and pet are provided", () => {
        const result = validateOnboardingInput("Mia", { name: "Brave Puppy" });

        expect(result.nameError).toBe("");
        expect(result.petError).toBe("");
    });
});
