"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HeaderBlock from "../src/components/HeaderBlock";
import { DEFAULT_COMPANION_AVATAR } from "../src/lib/avatarDefaults";
import { getPlayerLevelInfo } from "../src/lib/playerLevel";
import {
    PLAYER_PROGRESS_STORAGE_KEY,
    PROFILE_STORAGE_KEY,
    bootstrapPlayerProfileDirectoryFromActiveProfile,
    getScopedStorageKeyForProfile,
    hasExplicitPlayerId,
    upsertPlayerProfileDirectory,
} from "../src/lib/playerStorage";
import { ensureReturningState } from "../src/lib/returningState";

const defaultHeroAvatar = "/heros/mia.png";
const topicProgressOrder = [
    { key: "nouns", title: "Nouns" },
    { key: "pronouns", title: "Pronouns" },
    { key: "verbs", title: "Verbs" },
    { key: "articles", title: "Articles" },
    { key: "adjectives", title: "Adjectives" },
    { key: "prepositions", title: "Prepositions" },
    { key: "adverbs", title: "Adverbs" },
    { key: "conjunctions", title: "Conjunctions" },
    { key: "sentence-structure", title: "Sentence Structure" },
    { key: "punctuation", title: "Punctuation" },
    { key: "tenses", title: "Tenses" },
];

const getHeroAvatar = (profile) => {
    const safeHeroImage = typeof profile?.heroImage === "string" ? profile.heroImage.trim() : "";
    return safeHeroImage || defaultHeroAvatar;
};

const getPetAvatar = (profile) => {
    const safePetImage = typeof profile?.petImage === "string" ? profile.petImage.trim() : "";
    return safePetImage || DEFAULT_COMPANION_AVATAR;
};

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

const toLastPlayedLabel = (lastPlayedAt) => {
    const timestamp = Date.parse(lastPlayedAt ?? "");
    if (Number.isNaN(timestamp)) {
        return "New adventurer";
    }

    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getProgressState = (profile) => {
    const progressStorageKey = getScopedStorageKeyForProfile(PLAYER_PROGRESS_STORAGE_KEY, profile);
    const progressRaw = localStorage.getItem(progressStorageKey);
    return safeParseJson(progressRaw, {});
};

const getTopicCompletionSummary = (progressState) => {
    const completedTopics = Array.isArray(progressState?.completedTopics) ? progressState.completedTopics : [];

    return completedTopics.length;
};

const getActiveTopicLabel = (progressState) => {
    const completedTopicSet = new Set(
        (Array.isArray(progressState?.completedTopics) ? progressState.completedTopics : [])
            .filter((topicKey) => typeof topicKey === "string" && topicKey.trim())
            .map((topicKey) => topicKey.trim())
    );

    let lastUnlockedTopicTitle = null;

    for (let index = 0; index < topicProgressOrder.length; index += 1) {
        const topic = topicProgressOrder[index];
        const prerequisite = index > 0 ? topicProgressOrder[index - 1] : null;
        const isUnlocked = index === 0 || (prerequisite && completedTopicSet.has(prerequisite.key));

        if (!isUnlocked) {
            break;
        }

        lastUnlockedTopicTitle = topic.title;
    }

    return lastUnlockedTopicTitle || topicProgressOrder[0].title;
};

export default function HomePage() {
    const router = useRouter();
    const [profiles, setProfiles] = useState([]);
    const [isHydrating, setIsHydrating] = useState(true);
    const learnerCarouselRef = useRef(null);

    useEffect(() => {
        const hydratedProfiles = bootstrapPlayerProfileDirectoryFromActiveProfile();
        if (hydratedProfiles.length === 0) {
            router.replace("/onboarding");
            return;
        }

        const enrichedProfiles = hydratedProfiles.map((profile) => ({
            ...profile,
            progressState: getProgressState(profile),
        })).map((profile) => ({
            ...profile,
            completedTopicsCount: getTopicCompletionSummary(profile.progressState),
            activeTopicLabel: getActiveTopicLabel(profile.progressState),
            lastPlayedLabel: toLastPlayedLabel(profile.lastPlayedAt),
            levelInfo: getPlayerLevelInfo(profile.progressState),
        }));

        setProfiles(enrichedProfiles);
        setIsHydrating(false);
    }, [router]);

    const handleCreateNewUser = () => {
        router.push("/onboarding");
    };

    const handleContinueAsUser = (selectedProfile) => {
        const activeProfile = {
            ...selectedProfile,
            lastPlayedAt: new Date().toISOString(),
        };

        try {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(activeProfile));
        } catch (error) {
            console.error("Failed to save active player profile", error);
            return;
        }

        upsertPlayerProfileDirectory(activeProfile);
        ensureReturningState({
            profile: activeProfile,
            allowLegacyBootstrap: !hasExplicitPlayerId(activeProfile),
        });

        router.push("/world-map");
    };

    const moveLearnerCarouselByDirection = (direction) => {
        const viewport = learnerCarouselRef.current;
        if (!viewport) {
            return;
        }

        const firstCard = viewport.querySelector("[data-learner-card]");
        const gap = 16;
        const fallbackOffset = Math.max(220, Math.floor(viewport.clientWidth * 0.8));
        const offset = firstCard ? Math.round(firstCard.getBoundingClientRect().width + gap) : fallbackOffset;

        viewport.scrollBy({
            left: direction === "right" ? offset : -offset,
            behavior: "smooth",
        });
    };

    const handleLearnerCarouselKeyDown = (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            moveLearnerCarouselByDirection("right");
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveLearnerCarouselByDirection("left");
        }
    };

    const hasMultipleProfiles = profiles.length > 1;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <HeaderBlock
                    showIcon
                    showTitle
                    showSubtitle
                    showProfile={false}
                />

                <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-8 pt-6">
                    <section>
                        <h1 className="text-center text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Choose Your Adventurer</h1>
                        <p className="mx-auto mt-2 max-w-2xl text-center text-lg font-medium text-slate-700 md:text-xl">
                            Jump back in with your saved hero and companion, or create a brand-new learner profile.
                        </p>

                        {isHydrating ? (
                            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                                <p className="text-base font-semibold text-slate-700">Loading learner profiles...</p>
                            </div>
                        ) : (
                            <div className="mt-6 mx-auto w-full max-w-[520px]">
                                <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => moveLearnerCarouselByDirection("left")}
                                        disabled={!hasMultipleProfiles}
                                        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition ${hasMultipleProfiles ? "hover:bg-sky-50" : "cursor-not-allowed opacity-40"}`}
                                        aria-label="Scroll learners left"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                    </button>

                                    <div
                                        ref={learnerCarouselRef}
                                        role="region"
                                        aria-label="Learner cards carousel"
                                        tabIndex={0}
                                        onKeyDown={handleLearnerCarouselKeyDown}
                                        className="w-full overflow-x-auto overflow-y-visible pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                                        style={{ scrollbarWidth: "none" }}
                                    >
                                        <div className="flex min-w-full gap-4">
                                            {profiles.map((profile) => (
                                                <button
                                                    key={profile.playerId}
                                                    type="button"
                                                    onClick={() => handleContinueAsUser(profile)}
                                                    className="group rounded-[28px] border border-primary/15 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15"
                                                    style={{ flex: "0 0 100%" }}
                                                    data-learner-card
                                                >
                                                    <p className="text-center text-xl font-black text-slate-800">Welcome Back, Adventurer!</p>
                                                    <div className="relative mt-4 flex items-center justify-center gap-5">
                                                        <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                                                            <img
                                                                src={getHeroAvatar(profile)}
                                                                alt={`${profile.name || "Learner"} hero avatar`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>

                                                        <div className="relative">
                                                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-black text-white shadow-sm">
                                                                Level {profile.levelInfo.level}
                                                            </span>
                                                            <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                                                                <img
                                                                    src={getPetAvatar(profile)}
                                                                    alt={`${profile.name || "Learner"} companion avatar`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="mt-4 text-center text-3xl font-black text-slate-900">{profile.name}</p>
                                                    <div className="mt-2 space-y-1 text-center">
                                                        <p className="text-sm font-semibold text-slate-700">Hero: {profile.heroName || "Unknown"}</p>
                                                        <p className="text-sm font-semibold text-slate-700">Companion: {profile.petName || "Unknown"}</p>
                                                        <p className="text-sm font-semibold text-slate-700">Active Topic: {profile.activeTopicLabel}</p>
                                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                            Completed Topics: {profile.completedTopicsCount}
                                                        </p>
                                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                            Last Played: {profile.lastPlayedLabel}
                                                        </p>
                                                    </div>

                                                    <span className="mt-5 inline-flex h-12 w-full items-center justify-center gap-1 rounded-full bg-primary text-base font-black text-white shadow-sm transition group-hover:brightness-105">
                                                        Continue Adventure
                                                        <span className="material-symbols-outlined text-lg leading-none">arrow_forward</span>
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => moveLearnerCarouselByDirection("right")}
                                        disabled={!hasMultipleProfiles}
                                        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition ${hasMultipleProfiles ? "hover:bg-sky-50" : "cursor-not-allowed opacity-40"}`}
                                        aria-label="Scroll learners right"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="mt-5 flex justify-center">
                        <button
                            type="button"
                            onClick={handleCreateNewUser}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 px-9 text-base font-black text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:border-primary/40"
                        >
                            <span className="material-symbols-outlined text-[18px] leading-none text-primary">person_add</span>
                            New Adventurer
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
