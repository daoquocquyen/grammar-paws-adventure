"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import HeaderBlock from "../src/components/HeaderBlock";
import PetOptionCard from "../src/components/PetOptionCard";
import PrimaryButton from "../src/components/PrimaryButton";
import ValidationMessage from "../src/components/ValidationMessage";
import { validateOnboardingInput } from "../src/lib/onboardingValidation";

const screen1ProfileKey = "gpa_player_profile_v1";
const playerProgressKey = "gpa_player_progress_v1";
const petAccessoriesKey = "gpa_pet_accessories_v1";

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

const isValidProfileName = (value) => typeof value === "string" && value.trim().length > 0;

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

    const persistPlayerProfile = (trimmedName, hero, pet) => {
        const payload = {
            version: 1,
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
            localStorage.setItem(screen1ProfileKey, JSON.stringify(payload));
        } catch (error) {
            console.error("Failed to save player profile", error);
        }
    };

    const ensureReturningState = () => {
        try {
            const progressRaw = localStorage.getItem(playerProgressKey);
            const accessoriesRaw = localStorage.getItem(petAccessoriesKey);

            if (!progressRaw) {
                localStorage.setItem(playerProgressKey, JSON.stringify(defaultProgressState));
            } else {
                const parsedProgress = JSON.parse(progressRaw);
                if (!Array.isArray(parsedProgress?.completedTopics)) {
                    localStorage.setItem(playerProgressKey, JSON.stringify(defaultProgressState));
                }
            }

            if (!accessoriesRaw) {
                localStorage.setItem(petAccessoriesKey, JSON.stringify(defaultAccessoriesState));
            } else {
                const parsedAccessories = JSON.parse(accessoriesRaw);
                if (!Array.isArray(parsedAccessories?.unlockedAccessoryIds)) {
                    localStorage.setItem(petAccessoriesKey, JSON.stringify(defaultAccessoriesState));
                }
            }
        } catch (error) {
            console.error("Failed to initialize returning learner state", error);
            localStorage.setItem(playerProgressKey, JSON.stringify(defaultProgressState));
            localStorage.setItem(petAccessoriesKey, JSON.stringify(defaultAccessoriesState));
        }
    };

    useEffect(() => {
        const screen1ProfileRaw = localStorage.getItem(screen1ProfileKey);
        if (!screen1ProfileRaw) {
            return;
        }
        try {
            const profile = JSON.parse(screen1ProfileRaw);
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

        ensureReturningState();
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
        if (selectedHero && selectedPet) {
            persistPlayerProfile(trimmedName, selectedHero, selectedPet);
        }

        ensureReturningState();

        router.push("/world-map");
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <HeaderBlock />

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
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-xl">badge</span>
                                    <h3 className="text-lg font-bold">Your name</h3>
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
                                    <ValidationMessage id="nameValidationMessage" message={nameError} />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-primary text-xl">face_6</span>
                                    <h3 className="text-xl font-bold">Your Hero</h3>
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
                                <ValidationMessage id="heroValidationMessage" message={heroError} />
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-primary text-xl">diversity_1</span>
                                    <h3 className="text-xl font-bold">Your Companion</h3>
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
                                <ValidationMessage id="petValidationMessage" message={petError} />
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-col gap-2 h-full">
                            <div className="flex-1 min-h-[460px] bg-white p-4 rounded-lg border-2 border-primary shadow-[0_0_0_2px_rgba(37,157,244,0.2),0_0_18px_rgba(37,157,244,0.35)]">
                                <div className="flex flex-col items-center text-center">
                                    <h3 className="text-primary text-sm font-black uppercase tracking-widest mb-2">Your New Friend</h3>
                                    <div className="w-40 h-40 rounded-full bg-primary/10 mb-2 flex items-center justify-center relative">
                                        <img
                                            alt=""
                                            className="w-36 h-36 object-cover rounded-full shadow-lg border-2 border-white"
                                            src={selectedPet?.image ?? pets[1].image}
                                        />
                                        <div className="absolute bottom-1 right-1 w-14 h-14 rounded-full bg-white p-[2px] shadow-md border border-primary/20">
                                            <img
                                                alt=""
                                                className="w-full h-full object-cover rounded-full"
                                                src={selectedHero?.image ?? heroes[0].image}
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full shadow-md text-xs border-2 border-white">
                                            Level 1
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-1">{selectedPet?.name ?? "Choose a companion"}</h4>
                                    <p className="text-slate-500 text-xs leading-tight mb-2">
                                        "{selectedPet?.quote ?? "Pick your pet to begin this adventure together!"}"
                                    </p>
                                    <p className="sr-only" aria-live="polite">{liveValidationMessage}</p>

                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                                            <span>{selectedPet?.characteristic ?? "Mood"}</span>
                                            <span>{selectedPet?.moodScore ?? 100}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                            <div className="bg-green-500 h-full" style={{ width: `${selectedPet?.moodScore ?? 100}%` }} />
                                        </div>
                                    </div>

                                    <div className="w-full mt-3 p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Next Milestone</p>
                                        <p className="text-sm font-bold text-slate-800">Complete 1 challenge to unlock a new pet accessory.</p>
                                    </div>
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
