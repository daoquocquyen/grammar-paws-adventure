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

const pets = [
    {
        name: "Brave Puppy",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC8UfnI-4ZD6WEiN5gXUwP6EMRX8mNxLA9lGZ-YGKsdeGIk3_z0ChWxvjCrlNqwdcRcIKhpf8cbPISdsBtzfR8ZWbQLVLIB3hMDemAxSYWw_y4NW3ORCs0G_OOf1VMb0Ohrjwb84k4ocpIXuMQ5Kugzcsr8FyeyWl-MWUFSwrE5_U_ArLy3y0ASzoi7bAL2jCMtsYqFsoLW3v5f5hCDNNQXiiTMcEn5moNywZMVUmPowbyKNzSpFejqiHpOjSKx5qq22mJLQE20Nlmn",
        quote: "Woof! I’ll cheer you on while you learn!",
    },
    {
        name: "Wise Kitten",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB5E1yagRgTQDhzkkiH1Z2CFZOL6i2dCszN8wKwrkeSPODDca-qhj_TxgvSsIytjeJuqHg8am8KFJuSxK-BI6XbzHMivZnxQhdVeYrP5lIC1lXuVDSLE1HGOopsI461dIZPO-sSSlob8ku513pA2DVZqBZd8Gg6TFyeGWTq_hYRpHTEIUQGfkLhJ1bplVqJeWQ7Hr8zJI7jdFH-07PxPO9crdCPHRasfWFtdr2s13S4E2hJNaOslEXeEEhs0ooN4211MMcSFSsHHQuH",
        quote: "Meow! Let’s solve grammar together!",
    },
    {
        name: "Swift Bunny",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBmx66OJYOOhrLcMEF9rs4_vmdVbAy8khc5VWVTgQUhCDz9HHcP5ZjRid_jTSIi4P7iSRATxBB67mNbPWnElulY7iGXcpxh2S-IQ8LTTWNMk8Gbp8XMCdN4df7qqvE4edbpCIjc347_Ibv6GyuLJO6t3QCHSt4iGFQ19jgvg0vzZq4EW1ibIhv--_LQegdyf9pw-AYhsqmt5MUfy1JQfWU3m-fnTUUPzHuvJacNm4FwnROdAv2_1wM2TLB2a5CyEmV0DEn6MO5aM4Fa",
        quote: "Hop hop! Quick thinking makes learning fun!",
    },
    {
        name: "Happy Hamster",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5l3I0e6UIAujP1swxyelIDciALjoKFoCygY-EW7QoSpnoajHDEsFBXr6xy6eAW1ddDsNpb0B2WLgo19m_Foe_3BMsUIzQLTd9Adz9vZAJMU0Bz2IMjUSEp03P6_MpHz1OyWhoWr62FGytj2DTo5S18AoGyADFdcey47VuH_7ptbli7bbx86xstDJEvfv6tDsuBt9oNVCsCglpcJIH185hG9xcCbD_syhGUdU3ijf7Xsmy7iu0-VFcJkVHN5Gl5MWJ9WArOx009VO",
        quote: "Squeak! Tiny steps make big progress!",
    },
    {
        name: "Steady Turtle",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCWVNsQrrHlzjhXt6-JawZXqs8hMsLHZXaCr1K-SeNmCrhfJrhs71q3QFdcZ99isFQ5HxsrNpP3s_2Y4ID1DTlEJ5m-UOLkhChZTWE3V4jn33vzK-C_dSHOqrjcvw38p62g3u9rQHydnKPNRZoMFQCYANpoYJNweDZqxNT3TMVobDJj5orTLsz8hpTgNrW9onS77Dp6lhu76oEDqWATFced9fJDhxOaCPinxeik57KCGKrQOUnRN8Zm9zLxEwCNieSHJ8v-QdHwgMx2",
        quote: "Slow and steady, we’ll learn every rule!",
    },
    {
        name: "Magic Dragon",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAblbJmRXR3T20lYkFMbjW7V2nawLnAVPYrazc27WtJ0Ls9bEv3NqcPaIcycgvrkkPR3aR36ufzZ2VU9oH7SbI8xcWe71WOpmLjosPJK0uAzfDefFBQIs9s8Ps5XU02S58g7naEzlaeP2OO8ITuCGHMuy1eUmWX_axPdMG0TdN5Y4MGpBXKd4NihhjS7CoW8ZFZNVPbZ1avtEGuPMqnMs2waECZaOupHvsARJMBhdZX-EXxiA2baHgCXj4ohbO5jb_uDLsp-uq08XWC",
        quote: "Roar! Let’s spark some grammar magic!",
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
    const [selectedPetName, setSelectedPetName] = useState("");
    const [nameError, setNameError] = useState("");
    const [petError, setPetError] = useState("");

    const selectedPet = useMemo(
        () => pets.find((pet) => pet.name === selectedPetName) ?? null,
        [selectedPetName]
    );

    const persistPlayerProfile = (trimmedName, pet) => {
        const payload = {
            version: 1,
            name: trimmedName,
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
        } catch (error) {
            console.error("Failed to parse player profile", error);
        }

        ensureReturningState();
    }, []);

    const liveValidationMessage = [nameError, petError].filter(Boolean).join(" ");

    const validateOnboarding = () => {
        const { nameError: currentNameError, petError: currentPetError } = validateOnboardingInput(playerName, selectedPet);

        setNameError(currentNameError);
        setPetError(currentPetError);

        return !currentNameError && !currentPetError;
    };

    const handleStartAdventure = () => {
        if (!validateOnboarding()) {
            return;
        }

        const trimmedName = playerName.trim();
        if (selectedPet) {
            persistPlayerProfile(trimmedName, selectedPet);
        }

        ensureReturningState();

        router.push("/screen2-world-map-topic-selection");
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <HeaderBlock />

                <main className="flex-1 min-h-[calc(100vh-180px)] px-4 md:px-8 lg:px-10 max-w-[1400px] mx-auto w-full py-6 md:py-8">
                    <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-white mb-4">
                        <div className="bg-gradient-to-b from-[#e0f2fe] to-[#f0f9ff] flex flex-col items-center justify-center text-center relative min-h-[130px] p-4">
                            <div className="max-w-4xl p-2">
                                <h1 className="font-black text-slate-900 tracking-tight text-3xl md:text-4xl leading-tight mb-1">Welcome, Adventurer!</h1>
                                <p className="text-slate-700 leading-tight font-medium text-base md:text-2xl">
                                    Tackle grammar challenges, earn cool accessories, and watch your pets evolve. Ready to start?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-7 space-y-5">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-xl">badge</span>
                                    <h3 className="text-3xl font-bold">Your Hero Name</h3>
                                </div>
                                <div className="max-w-md">
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
                                        className={`w-full h-12 px-4 rounded-lg border-2 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-base font-bold ${nameError ? "border-rose-400" : "border-slate-100"}`}
                                        placeholder="Enter your hero name"
                                        type="text"
                                    />
                                    <ValidationMessage id="nameValidationMessage" message={nameError} />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary text-xl">diversity_1</span>
                                    <h3 className="text-3xl font-bold">Your Companion</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {pets.map((pet) => {
                                        const isSelected = selectedPetName === pet.name;
                                        return (
                                            <PetOptionCard
                                                key={pet.name}
                                                pet={pet}
                                                isSelected={isSelected}
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

                        <div className="lg:col-span-5 flex flex-col gap-3">
                            <div className="flex-1 min-h-[580px] bg-white p-6 rounded-lg border-2 border-primary shadow-[0_0_0_2px_rgba(37,157,244,0.2),0_0_18px_rgba(37,157,244,0.35)]">
                                <div className="flex flex-col items-center text-center">
                                    <h3 className="text-primary text-base font-black uppercase tracking-widest mb-4">Your New Friend</h3>
                                    <div className="w-52 h-52 rounded-full bg-primary/10 mb-3 flex items-center justify-center relative">
                                        <img
                                            alt=""
                                            className="w-48 h-48 object-cover rounded-full shadow-lg border-2 border-white"
                                            src={selectedPet?.image ?? pets[1].image}
                                        />
                                        <div className="absolute -bottom-2 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-full shadow-md text-sm border-2 border-white">
                                            Level 1
                                        </div>
                                    </div>
                                    <h4 className="text-4xl font-black text-slate-900 mb-1">{selectedPet?.name ?? "Choose a companion"}</h4>
                                    <p className="text-slate-500 text-sm leading-tight mb-4">
                                        "{selectedPet?.quote ?? "Pick your pet to begin this adventure together!"}"
                                    </p>
                                    <p className="sr-only" aria-live="polite">{liveValidationMessage}</p>

                                    <div className="w-full space-y-3">
                                        <div className="flex justify-between text-sm font-bold text-slate-400 uppercase">
                                            <span>Happiness</span>
                                            <span>100%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                            <div className="bg-green-500 h-full w-full" />
                                        </div>
                                    </div>

                                    <div className="w-full mt-5 p-3 rounded-lg bg-primary/5 border border-primary/20 text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Next Milestone</p>
                                        <p className="text-xl font-bold text-slate-800">Complete 1 challenge to unlock a new pet accessory.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <PrimaryButton onClick={handleStartAdventure}>Start Adventure</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-slate-200 py-2 px-4 md:px-8 bg-slate-50 mt-2">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-1">
                        <p className="text-slate-500 text-xs leading-none">© 2026 Grammar Paws Adventure. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
