export function validateOnboardingInput(playerName, selectedHero, selectedPet) {
    const trimmedName = typeof playerName === "string" ? playerName.trim() : "";
    const hasHero = Boolean(selectedHero);
    const hasPet = Boolean(selectedPet);

    return {
        nameError: trimmedName ? "" : "Please enter your name so your pet can cheer for you!",
        heroError: hasHero ? "" : "Please choose one 3D hero before you start.",
        petError: hasPet ? "" : "Please choose one companion before you start.",
    };
}
