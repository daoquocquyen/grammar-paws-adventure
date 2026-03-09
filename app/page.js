"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CharacterSpeechBubble from "../src/components/CharacterSpeechBubble";
import HeaderBlock from "../src/components/HeaderBlock";
import PetOptionCard from "../src/components/PetOptionCard";
import PrimaryButton from "../src/components/PrimaryButton";
import { getHeroThemeColor, getPetThemeColor } from "../src/lib/avatarBubbleThemes";
import { validateOnboardingInput } from "../src/lib/onboardingValidation";
import {
    PET_ACCESSORIES_STORAGE_KEY,
    PLAYER_PROGRESS_STORAGE_KEY,
    PROFILE_STORAGE_KEY,
    getPlayerIdFromName,
    hasExplicitPlayerId,
    getScopedStorageKeyForProfile,
} from "../src/lib/playerStorage";

const heroes = [
    {
        id: "hero-girl-1",
        name: "Mia",
        gender: "Girl",
        image: "/heros/mia.png",
    },
    {
        id: "hero-boy-1",
        name: "Leo",
        gender: "Boy",
        image: "/heros/leo.png",
    },
    {
        id: "hero-girl-2",
        name: "Zuri",
        gender: "Girl",
        image: "/heros/zuri.png",
    },
    {
        id: "hero-boy-2",
        name: "Kenji",
        gender: "Boy",
        image: "/heros/kenji.png",
    },
    {
        id: "hero-girl-3",
        name: "Lyly",
        gender: "Girl",
        image: "/heros/lyly.png",
    },
    {
        id: "hero-boy-3",
        name: "Toby",
        gender: "Boy",
        image: "/heros/toby.png",
    },
    {
        id: "hero-girl-4",
        name: "Sofia",
        gender: "Girl",
        image: "/heros/sofia.png",
    },
    {
        id: "hero-boy-4",
        name: "Matheus",
        gender: "Boy",
        image: "/heros/matheus.png",
    },
];

const pets = [
    {
        name: "Golden Retriever",
        image: "/companions/golden-retriever.png",
        quote: "Woof! Let’s play and learn together!",
        characteristic: "Playfulness",
        moodScore: 98,
    },
    {
        name: "Calico Cat",
        image: "/companions/calico-cat.png",
        quote: "Meow! I’m curious about every grammar clue!",
        characteristic: "Curiosity",
        moodScore: 96,
    },
    {
        name: "Fluffy Bunny",
        image: "/companions/fluffy-bunny.png",
        quote: "Hop! I’m ready for round after round of fun.",
        characteristic: "Cheer",
        moodScore: 94,
    },
    {
        name: "Playful Hamster",
        image: "/companions/playful-hamster.png",
        quote: "Squeak! Let’s spin through lessons together!",
        characteristic: "Fun",
        moodScore: 99,
    },
    {
        name: "Cheerful Parakeet",
        image: "/companions/cheerful-parakeet.png",
        quote: "Tweet! I’ll cheer for every grammar win!",
        characteristic: "Energy",
        moodScore: 97,
    },
    {
        name: "Jolly Goldfish",
        image: "/companions/jolly-goldfish.png",
        quote: "Splash! Let’s swim through grammar quests!",
        characteristic: "Joy",
        moodScore: 95,
    },
    {
        name: "Happy Bearded Dragon",
        image: "/companions/happy-bearded-dragon.png",
        quote: "Roar! Tiny dragon power for big learning!",
        characteristic: "Bravery",
        moodScore: 96,
    },
    {
        name: "Smiling Turtle",
        image: "/companions/smiling-turtle.png",
        quote: "Slow and steady, we’ll master every sentence!",
        characteristic: "Patience",
        moodScore: 97,
    },
];

const heroCheerfulMessages = {
    "hero-girl-1": "I’m Mia—let’s shine bright and win every grammar challenge together!",
    "hero-boy-1": "I’m Leo—high five! We’re ready to conquer grammar one clue at a time!",
    "hero-girl-2": "I’m Zuri—your words are powerful, and I’m cheering for every step!",
    "hero-boy-2": "I’m Kenji—let’s stay brave, focused, and make grammar super fun!",
    "hero-girl-3": "I’m Lyly—big smiles, brave hearts, and awesome grammar wins ahead!",
    "hero-boy-3": "I’m Toby—teamwork mode on! Let’s tackle grammar and celebrate every win!",
    "hero-girl-4": "I’m Sofia—ready, steady, sparkle! We’ve got this grammar adventure!",
    "hero-boy-4": "I’m Matheus—let’s power up and crush today’s grammar mission!",
};

const petCheerfulMessages = {
    "Golden Retriever": "Woof! I’ll cheer you on—let’s make every grammar step fun!",
    "Calico Cat": "Meow! You’re doing great—let’s pounce on the next grammar puzzle!",
    "Fluffy Bunny": "Hop hop! You’re amazing—let’s bounce through grammar challenges!",
    "Playful Hamster": "Squeak! Tiny paws, big energy—let’s roll through grammar wins!",
    "Cheerful Parakeet": "Tweet tweet! You can do this—let’s sing our way to grammar success!",
    "Jolly Goldfish": "Splash! Keep going—your grammar skills are swimming stronger already!",
    "Happy Bearded Dragon": "Roar! You’re bold and brilliant—let’s blaze through grammar quests!",
    "Smiling Turtle": "Slow and steady smiles—together we’ll master every grammar challenge!",
};

const isValidProfileName = (value) => typeof value === "string" && value.trim().length > 0;
const safeParseJson = (rawValue, fallbackValue = null) => {
    if (typeof rawValue !== "string" || !rawValue.trim()) {
        return fallbackValue;
    }

    try {
        const parsedValue = JSON.parse(rawValue);
        return parsedValue ?? fallbackValue;
    } catch {
        return fallbackValue;
    }
};

const defaultProgressState = {
    version: 1,
    completedTopics: [],
    topicProgress: {},
};

const defaultAccessoriesState = {
    version: 1,
    unlockedAccessoryIds: [],
    equippedAccessoryId: null,
};

const isValidProgressState = (value) =>
    Boolean(
        value
        && typeof value === "object"
        && Array.isArray(value.completedTopics)
        && value.topicProgress
        && typeof value.topicProgress === "object"
    );

const isValidAccessoriesState = (value) =>
    Boolean(
        value
        && typeof value === "object"
        && Array.isArray(value.unlockedAccessoryIds)
    );

export default function Home() {
    const router = useRouter();
    const [playerName, setPlayerName] = useState("");
    const [selectedHeroId, setSelectedHeroId] = useState("");
    const [selectedPetName, setSelectedPetName] = useState("");
    const [nameError, setNameError] = useState("");
    const [heroError, setHeroError] = useState("");
    const [petError, setPetError] = useState("");

    const selectedHero = useMemo(
        () => heroes.find((hero) => hero.id === selectedHeroId) ?? null,
        [selectedHeroId]
    );

    const selectedPet = useMemo(
        () => pets.find((pet) => pet.name === selectedPetName) ?? null,
        [selectedPetName]
    );

    const selectedHeroTheme = useMemo(
        () => getHeroThemeColor(selectedHero?.id, selectedHero?.name),
        [selectedHero]
    );

    const selectedPetTheme = useMemo(
        () => getPetThemeColor(selectedPet?.name),
        [selectedPet]
    );

    const selectedHeroThemeStyle = useMemo(
        () => ({ backgroundColor: selectedHeroTheme, borderColor: selectedHeroTheme }),
        [selectedHeroTheme]
    );

    const selectedPetThemeStyle = useMemo(
        () => ({ backgroundColor: selectedPetTheme, borderColor: selectedPetTheme }),
        [selectedPetTheme]
    );

    const persistPlayerProfile = (trimmedName, hero, pet) => {
        const playerId = getPlayerIdFromName(trimmedName);
        const payload = {
            version: 1,
            playerId,
            name: trimmedName,
            heroId: hero.id,
            heroName: hero.name,
            heroImage: hero.image,
            heroGender: hero.gender,
            heroModelType: "3d",
            petName: pet.name,
            petImage: pet.image,
        };

        try {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(payload));
        } catch (error) {
            console.error("Failed to save player profile", error);
        }

        return payload;
    };

    const ensureReturningState = ({ profile = null, allowLegacyBootstrap = false } = {}) => {
        try {
            const scopedProgressKey = getScopedStorageKeyForProfile(PLAYER_PROGRESS_STORAGE_KEY, profile);
            const scopedAccessoriesKey = getScopedStorageKeyForProfile(PET_ACCESSORIES_STORAGE_KEY, profile);

            const scopedProgressRaw = localStorage.getItem(scopedProgressKey);
            const scopedAccessoriesRaw = localStorage.getItem(scopedAccessoriesKey);

            const legacyProgressRaw = allowLegacyBootstrap && scopedProgressKey !== PLAYER_PROGRESS_STORAGE_KEY
                ? localStorage.getItem(PLAYER_PROGRESS_STORAGE_KEY)
                : null;
            const legacyAccessoriesRaw = allowLegacyBootstrap && scopedAccessoriesKey !== PET_ACCESSORIES_STORAGE_KEY
                ? localStorage.getItem(PET_ACCESSORIES_STORAGE_KEY)
                : null;

            const progressCandidateRaw = scopedProgressRaw ?? legacyProgressRaw;
            const accessoriesCandidateRaw = scopedAccessoriesRaw ?? legacyAccessoriesRaw;

            const parsedProgress = safeParseJson(progressCandidateRaw);
            const parsedAccessories = safeParseJson(accessoriesCandidateRaw);

            const nextProgress = isValidProgressState(parsedProgress)
                ? parsedProgress
                : defaultProgressState;
            const nextAccessories = isValidAccessoriesState(parsedAccessories)
                ? parsedAccessories
                : defaultAccessoriesState;

            const serializedProgress = JSON.stringify(nextProgress);
            const serializedAccessories = JSON.stringify(nextAccessories);

            localStorage.setItem(scopedProgressKey, serializedProgress);
            localStorage.setItem(scopedAccessoriesKey, serializedAccessories);

            // Keep legacy base keys synced to the active player state for backward compatibility.
            if (scopedProgressKey !== PLAYER_PROGRESS_STORAGE_KEY) {
                localStorage.setItem(PLAYER_PROGRESS_STORAGE_KEY, serializedProgress);
            }
            if (scopedAccessoriesKey !== PET_ACCESSORIES_STORAGE_KEY) {
                localStorage.setItem(PET_ACCESSORIES_STORAGE_KEY, serializedAccessories);
            }
        } catch (error) {
            console.error("Failed to initialize returning learner state", error);
            localStorage.setItem(PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify(defaultProgressState));
            localStorage.setItem(PET_ACCESSORIES_STORAGE_KEY, JSON.stringify(defaultAccessoriesState));
        }
    };

    useEffect(() => {
        const screen1ProfileRaw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (!screen1ProfileRaw) {
            return;
        }

        let restoredProfile = null;
        try {
            const profile = JSON.parse(screen1ProfileRaw);
            restoredProfile = profile && typeof profile === "object" ? profile : null;
            if (isValidProfileName(profile?.name)) {
                const restoredName = profile.name.trim();
                setPlayerName(restoredName);
            }

            if (typeof profile?.petName === "string") {
                const matchingPet = pets.find((pet) => pet.name === profile.petName);
                if (matchingPet) {
                    setSelectedPetName(matchingPet.name);
                }
            }

            if (typeof profile?.heroId === "string") {
                const matchingHeroById = heroes.find((hero) => hero.id === profile.heroId);
                if (matchingHeroById) {
                    setSelectedHeroId(matchingHeroById.id);
                }
            } else if (typeof profile?.heroName === "string") {
                const matchingHeroByName = heroes.find((hero) => hero.name === profile.heroName);
                if (matchingHeroByName) {
                    setSelectedHeroId(matchingHeroByName.id);
                }
            }
        } catch (error) {
            console.error("Failed to parse player profile", error);
        }

        ensureReturningState({
            profile: restoredProfile,
            allowLegacyBootstrap: !hasExplicitPlayerId(restoredProfile),
        });
    }, []);

    const liveValidationMessage = [nameError, heroError, petError].filter(Boolean).join(" ");

    const validateOnboarding = () => {
        const {
            nameError: currentNameError,
            heroError: currentHeroError,
            petError: currentPetError,
        } = validateOnboardingInput(playerName, selectedHero, selectedPet);

        setNameError(currentNameError);
        setHeroError(currentHeroError);
        setPetError(currentPetError);

        return !currentNameError && !currentHeroError && !currentPetError;
    };

    const handleStartAdventure = () => {
        if (!validateOnboarding()) {
            return;
        }

        const trimmedName = playerName.trim();
        let persistedProfile = null;
        if (selectedHero && selectedPet) {
            persistedProfile = persistPlayerProfile(trimmedName, selectedHero, selectedPet);
        }

        ensureReturningState({ profile: persistedProfile, allowLegacyBootstrap: false });

        router.push("/world-map");
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <HeaderBlock
                    showIcon
                    showTitle
                    showSubtitle
                    showProfile={false}
                />

                <main className="flex-1 min-h-[calc(100vh-150px)] px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto w-full py-3 md:py-4">
                    <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-white mb-3">
                        <div className="bg-gradient-to-b from-[#e0f2fe] to-[#f0f9ff] flex flex-col items-center justify-center text-center relative min-h-[96px] p-3">
                            <div className="max-w-4xl p-2">
                                <h1 className="font-black text-slate-900 tracking-tight text-2xl md:text-3xl leading-tight mb-1">Welcome, Adventurer!</h1>
                                <p className="text-slate-700 leading-tight font-medium text-sm md:text-lg">
                                    Tackle grammar challenges, earn cool accessories, and watch your pets evolve. Ready to start?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        <div className="lg:col-span-7 flex flex-col gap-3 h-full">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-xl">badge</span>
                                        <h3 className="text-lg font-bold">Your name</h3>
                                    </div>
                                    <p
                                        id="nameValidationMessage"
                                        className={`text-xs font-semibold text-rose-600 leading-tight text-right whitespace-nowrap ${nameError ? "" : "invisible"}`}
                                        aria-live="polite"
                                    >
                                        {nameError || "Please enter your name so your pet can cheer for you!"}
                                    </p>
                                </div>
                                <div className="w-full">
                                    <label className="sr-only" htmlFor="playerNameInput">Enter your hero name</label>
                                    <input
                                        id="playerNameInput"
                                        aria-describedby="nameValidationMessage"
                                        aria-invalid={nameError ? "true" : "false"}
                                        value={playerName}
                                        onChange={(event) => {
                                            const nextName = event.target.value;
                                            setPlayerName(nextName);

                                            if (nextName.trim()) {
                                                setNameError("");
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                handleStartAdventure();
                                            }
                                        }}
                                        className={`w-full h-10 px-3 rounded-lg border-2 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-bold ${nameError ? "border-rose-400" : "border-slate-100"}`}
                                        placeholder="Enter your hero name"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-xl">face_6</span>
                                        <h3 className="text-xl font-bold">Your Hero</h3>
                                    </div>
                                    <p
                                        id="heroValidationMessage"
                                        className={`text-xs font-semibold text-rose-600 leading-tight text-right whitespace-nowrap ${heroError ? "" : "invisible"}`}
                                        aria-live="polite"
                                    >
                                        {heroError || "Please choose one 3D hero before you start."}
                                    </p>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-fit mx-auto justify-items-center">
                                    {heroes.map((hero) => {
                                        const isSelected = selectedHeroId === hero.id;
                                        return (
                                            <PetOptionCard
                                                key={hero.id}
                                                pet={{ name: hero.name, image: hero.image }}
                                                isSelected={isSelected}
                                                showLabel
                                                onSelect={() => {
                                                    setSelectedHeroId(hero.id);
                                                    setHeroError("");
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-xl">diversity_1</span>
                                        <h3 className="text-xl font-bold">Your Companion</h3>
                                    </div>
                                    <p
                                        id="petValidationMessage"
                                        className={`text-xs font-semibold text-rose-600 leading-tight text-right whitespace-nowrap ${petError ? "" : "invisible"}`}
                                        aria-live="polite"
                                    >
                                        {petError || "Please choose one companion before you start."}
                                    </p>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-fit mx-auto justify-items-center">
                                    {pets.map((pet) => {
                                        const isSelected = selectedPetName === pet.name;
                                        return (
                                            <PetOptionCard
                                                key={pet.name}
                                                pet={pet}
                                                isSelected={isSelected}
                                                showLabel
                                                onSelect={() => {
                                                    setSelectedPetName(pet.name);
                                                    setPetError("");
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-col gap-2 h-full">
                            <div className="flex-1 min-h-[500px] bg-white p-4 rounded-lg border-2 border-primary shadow-[0_0_0_2px_rgba(37,157,244,0.2),0_0_18px_rgba(37,157,244,0.35)]">
                                <div className="flex flex-col items-center text-center h-full">
                                    <h3 className="text-primary text-base font-black uppercase tracking-widest mb-4">Your Grammar Hero and Companion</h3>
                                    <div className="w-full flex-1 flex flex-col justify-between">
                                        <div className="w-full flex items-start justify-start gap-4">
                                            <div className="w-32 h-32 rounded-full border p-1 shadow-md" style={selectedHeroThemeStyle}>
                                                <img
                                                    alt=""
                                                    className="w-full h-full object-cover rounded-full border-2 border-white"
                                                    src={selectedHero?.image ?? heroes[0].image}
                                                />
                                            </div>
                                            <CharacterSpeechBubble
                                                message={
                                                    selectedHero
                                                        ? heroCheerfulMessages[selectedHero.id]
                                                        : "I’m your Grammar Hero—let’s have fun and do our best together!"
                                                }
                                                tailSide="left"
                                                borderColor={selectedHeroTheme}
                                                className="max-w-[62%] min-h-[140px] flex items-center"
                                            />
                                        </div>

                                        <div className="w-full flex items-center justify-center py-2">
                                            <div className="w-full max-w-[78%] flex items-center gap-2">
                                                <span className="flex-1 border-t-2 border-dashed border-primary/30" />
                                                <div className="px-3 py-1.5 rounded-full bg-white border border-primary/30 shadow-sm flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-primary text-base leading-none">pets</span>
                                                    <span className="text-[11px] font-black uppercase tracking-wide text-primary">Ready for Grammar Mission!</span>
                                                </div>
                                                <span className="flex-1 border-t-2 border-dashed border-emerald-300" />
                                            </div>
                                        </div>

                                        <div className="w-full flex items-end justify-end gap-4">
                                            <CharacterSpeechBubble
                                                message={
                                                    selectedPet
                                                        ? petCheerfulMessages[selectedPet.name]
                                                        : "I’m your companion—let’s smile, learn, and conquer grammar together!"
                                                }
                                                tailSide="right"
                                                borderColor={selectedPetTheme}
                                                className="max-w-[62%] min-h-[140px] flex items-center"
                                            />
                                            <div className="w-32 h-32 rounded-full border p-1 shadow-md" style={selectedPetThemeStyle}>
                                                <img
                                                    alt=""
                                                    className="w-full h-full object-cover rounded-full border-2 border-white"
                                                    src={selectedPet?.image ?? pets[1].image}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="sr-only" aria-live="polite">{liveValidationMessage}</p>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <PrimaryButton onClick={handleStartAdventure}>Start Adventure</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-slate-200 py-1.5 px-4 md:px-8 bg-slate-50 mt-1">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-1">
                        <p className="text-slate-500 text-xs leading-none">© 2026 Grammar Paws Adventure. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
