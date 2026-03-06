const heroThemeColors = {
    "hero-girl-1": "#f0c0c0",
    "hero-boy-1": "#b0d0e0",
    "hero-girl-2": "#d0c0f0",
    "hero-boy-2": "#b0e0c0",
    "hero-girl-3": "#b0e0d0",
    "hero-boy-3": "#f0e0a0",
    "hero-girl-4": "#f0a090",
    "hero-boy-4": "#e0e090",
};

const petThemeColors = {
    "Golden Retriever": "#b0d0e0",
    "Calico Cat": "#f0c0c0",
    "Fluffy Bunny": "#f0e0a0",
    "Playful Hamster": "#c0e0c0",
    "Cheerful Parakeet": "#d0c0f0",
    "Jolly Goldfish": "#f0d0a0",
    "Happy Bearded Dragon": "#f0a090",
    "Smiling Turtle": "#b0e0d0",
};

const toSafeString = (value) => (typeof value === "string" ? value.trim() : "");

const heroNameToId = {
    Mia: "hero-girl-1",
    Leo: "hero-boy-1",
    Zuri: "hero-girl-2",
    Kenji: "hero-boy-2",
    Lyly: "hero-girl-3",
    Toby: "hero-boy-3",
    Sofia: "hero-girl-4",
    Matheus: "hero-boy-4",
};

export const DEFAULT_HERO_THEME_COLOR = heroThemeColors["hero-girl-1"];
export const DEFAULT_PET_THEME_COLOR = petThemeColors["Calico Cat"];

export const getHeroThemeColor = (heroId, heroName) => {
    const safeHeroId = toSafeString(heroId);
    if (safeHeroId && heroThemeColors[safeHeroId]) {
        return heroThemeColors[safeHeroId];
    }

    const safeHeroName = toSafeString(heroName);
    const mappedHeroId = heroNameToId[safeHeroName];
    if (mappedHeroId && heroThemeColors[mappedHeroId]) {
        return heroThemeColors[mappedHeroId];
    }

    return DEFAULT_HERO_THEME_COLOR;
};

export const getPetThemeColor = (petName) => {
    const safePetName = toSafeString(petName);
    if (safePetName && petThemeColors[safePetName]) {
        return petThemeColors[safePetName];
    }

    return DEFAULT_PET_THEME_COLOR;
};

export { heroThemeColors, petThemeColors };
