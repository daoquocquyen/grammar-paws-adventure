import { describe, expect, it } from "vitest";
import { validateOnboardingInput } from "../../src/lib/onboardingValidation";

describe("validateOnboardingInput", () => {
    it("returns all errors when name, hero, and pet are missing", () => {
        const result = validateOnboardingInput("   ", null, null);

        expect(result.nameError).toBe("Please enter your name so your pet can cheer for you!");
        expect(result.heroError).toBe("Please choose one 3D hero before you start.");
        expect(result.petError).toBe("Please choose one companion before you start.");
    });

    it("returns no errors when valid name, hero, and pet are provided", () => {
        const result = validateOnboardingInput("Mia", { id: "hero-girl-1", name: "Mia" }, { name: "Brave Puppy" });

        expect(result.nameError).toBe("");
        expect(result.heroError).toBe("");
        expect(result.petError).toBe("");
    });
});
