export function validateOnboardingInput(playerName, selectedPet) {
    const trimmedName = typeof playerName === "string" ? playerName.trim() : "";
    const hasPet = Boolean(selectedPet);

    return {
        nameError: trimmedName ? "" : "Please enter your name so your pet can cheer for you!",
        petError: hasPet ? "" : "Please choose one companion before you start.",
    };
}
