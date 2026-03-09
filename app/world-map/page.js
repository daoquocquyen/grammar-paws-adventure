"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import HeaderBlock from "../../src/components/HeaderBlock";
import { DEFAULT_COMPANION_AVATAR } from "../../src/lib/avatarDefaults";
import {
    PLAYER_PROGRESS_STORAGE_KEY,
    PROFILE_STORAGE_KEY,
    hasExplicitPlayerId,
    getScopedStorageKeyForProfile,
} from "../../src/lib/playerStorage";
import { getPlayerLevelInfo } from "../../src/lib/playerLevel";

const selectedTopicStorageKey = "gpa_selected_topic_v1";

const defaultAvatar = DEFAULT_COMPANION_AVATAR;

const defaultProgressState = {
    completedTopics: [],
    topicProgress: {},
};

const topicDefinitions = [
    {
        topicKey: "nouns",
        title: "Nouns",
        summary: "Learn naming words for people, places, animals, and things.",
    },
    {
        topicKey: "pronouns",
        title: "Pronouns",
        summary: "Use shortcut words that replace nouns smoothly.",
    },
    {
        topicKey: "verbs",
        title: "Verbs",
        summary: "Use am/is/are and simple present forms for everyday actions.",
    },
    {
        topicKey: "articles",
        title: "Articles",
        summary: "Choose a, an, and the in the right contexts.",
    },
    {
        topicKey: "adjectives",
        title: "Adjectives",
        summary: "Describe nouns with colorful and precise describing words.",
    },
    {
        topicKey: "prepositions",
        title: "Prepositions",
        summary: "Use place words like in/on/under and relative positions clearly.",
    },
    {
        topicKey: "adverbs",
        title: "Adverbs",
        summary: "Add details for how, when, and where actions happen.",
    },
    {
        topicKey: "conjunctions",
        title: "Conjunctions",
        summary: "Connect words and ideas using joining words.",
    },
    {
        topicKey: "sentence-structure",
        title: "Sentence Structure",
        summary: "Build complete, clear sentences with subject and verb.",
    },
    {
        topicKey: "punctuation",
        title: "Punctuation",
        summary: "Use commas, periods, and question marks to sharpen meaning.",
    },
    {
        topicKey: "tenses",
        title: "Tenses",
        summary: "Compare actions happening now with actions that happen regularly.",
    },
];

const topicIndexByKey = topicDefinitions.reduce((indexMap, topic, index) => {
    indexMap[topic.topicKey] = index;
    return indexMap;
}, {});

const defaultTopicIconSet = [
    "label",
    "record_voice_over",
    "bolt",
    "article",
    "palette",
    "near_me",
    "speed",
    "link",
    "format_align_left",
    "edit_note",
    "schedule",
];

const petTopicIconSets = {
    "Brave Puppy": [
        "pets",
        "support_agent",
        "sports",
        "description",
        "brush",
        "explore",
        "flash_on",
        "all_inclusive",
        "view_headline",
        "edit",
        "timer",
    ],
    "Wise Kitten": [
        "bookmark",
        "forum",
        "run_circle",
        "newspaper",
        "colors",
        "near_me",
        "speed",
        "device_hub",
        "subject",
        "stylus_note",
        "watch_later",
    ],
    "Swift Bunny": [
        "sell",
        "mic",
        "offline_bolt",
        "feed",
        "format_paint",
        "assistant_navigation",
        "bolt",
        "share",
        "reorder",
        "draw",
        "alarm",
    ],
    "Happy Hamster": [
        "tag",
        "chat",
        "directions_run",
        "article",
        "palette",
        "navigation",
        "rocket_launch",
        "hub",
        "short_text",
        "edit_square",
        "schedule",
    ],
    "Steady Turtle": [
        "label_important",
        "campaign",
        "run_circle",
        "description",
        "format_color_fill",
        "place",
        "pace",
        "merge",
        "segment",
        "ink_pen",
        "hourglass_bottom",
    ],
    "Magic Dragon": [
        "auto_awesome",
        "psychology",
        "electric_bolt",
        "library_books",
        "interests",
        "travel_explore",
        "rocket",
        "account_tree",
        "table_rows",
        "gesture",
        "update",
    ],
};

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

const clampPercent = (value) => {
    if (!isFiniteNumber(value)) {
        return 0;
    }

    return Math.max(0, Math.min(100, value));
};

const extractTopicPercent = (topicProgressValue) => {
    if (isFiniteNumber(topicProgressValue)) {
        return clampPercent(topicProgressValue);
    }

    if (!topicProgressValue || typeof topicProgressValue !== "object") {
        return 0;
    }

    if (isFiniteNumber(topicProgressValue.percent)) {
        return clampPercent(topicProgressValue.percent);
    }

    if (isFiniteNumber(topicProgressValue.progress)) {
        return clampPercent(topicProgressValue.progress);
    }

    if (isFiniteNumber(topicProgressValue.completionPercent)) {
        return clampPercent(topicProgressValue.completionPercent);
    }

    return 0;
};

const normalizeTopicProgress = (progressState) => {
    const normalizedProgress = {};

    const completedTopics = Array.isArray(progressState?.completedTopics) ? progressState.completedTopics : [];
    completedTopics.forEach((topicKey) => {
        if (typeof topicKey === "string" && topicKey.trim()) {
            normalizedProgress[topicKey.trim()] = 100;
        }
    });

    const topicProgress = progressState?.topicProgress;
    if (topicProgress && typeof topicProgress === "object") {
        Object.entries(topicProgress).forEach(([topicKey, topicProgressValue]) => {
            const existingValue = normalizedProgress[topicKey] ?? 0;
            const nextValue = extractTopicPercent(topicProgressValue);
            normalizedProgress[topicKey] = Math.max(existingValue, nextValue);
        });
    }

    return normalizedProgress;
};

const getStatusAvatar = (status) => {
    if (status === "done") {
        return {
            icon: "check_circle",
            containerClass: "bg-emerald-100 text-emerald-600",
        };
    }

    if (status === "ongoing") {
        return {
            icon: "play_circle",
            containerClass: "bg-sky-100 text-sky-600",
        };
    }

    return {
        icon: "lock",
        containerClass: "bg-slate-100 text-slate-500",
    };
};

const getTopicIconName = (petName, topicKey) => {
    const iconSet = petTopicIconSets[petName] ?? defaultTopicIconSet;
    const topicIndex = topicIndexByKey[topicKey] ?? 0;
    return iconSet[topicIndex] ?? defaultTopicIconSet[topicIndex] ?? "menu_book";
};

const getTopicIconContainerClass = (status) => {
    if (status === "done") {
        return "bg-emerald-100 text-emerald-700";
    }

    if (status === "ongoing") {
        return "bg-sky-100 text-sky-700";
    }

    return "bg-slate-200 text-slate-500";
};

const getProgressColorClass = (status) => {
    if (status === "done") return "bg-emerald-500";
    if (status === "ongoing") return "bg-sky-500";
    return "bg-slate-300";
};

const getActionLabel = (status) => {
    if (status === "done") return "Review";
    return "Start Topic";
};

const getDefaultFocusedTopicCard = (topicCards) => {
    const unlockedCards = topicCards.filter((card) => card.status !== "locked");
    return unlockedCards[unlockedCards.length - 1] ?? topicCards[0] ?? null;
};

export default function Screen2TopicSelectionPage() {
    const router = useRouter();
    const [headerName, setHeaderName] = useState("Adventurer");
    const [headerSecondaryText, setHeaderSecondaryText] = useState("Choose your first topic");
    const [selectedPetName, setSelectedPetName] = useState("");
    const [headerAvatar, setHeaderAvatar] = useState(defaultAvatar);
    const [companionAvatar, setCompanionAvatar] = useState(defaultAvatar);
    const [headerLevelLabel, setHeaderLevelLabel] = useState("Level 1 • Explorer");
    const [mapTitle] = useState("Grammar World Map");
    const [startMessage, setStartMessage] = useState("");
    const [focusedTopicKey, setFocusedTopicKey] = useState("");
    const [hasUserFocusedTopic, setHasUserFocusedTopic] = useState(false);
    const [playerProgress, setPlayerProgress] = useState(defaultProgressState);
    const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);

    const carouselViewportRef = useRef(null);
    const dragStateRef = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false });

    const topicCards = useMemo(() => {
        const normalizedProgress = normalizeTopicProgress(playerProgress);
        const completedTopicSet = new Set(
            (Array.isArray(playerProgress?.completedTopics) ? playerProgress.completedTopics : [])
                .filter((topicKey) => typeof topicKey === "string" && topicKey.trim())
                .map((topicKey) => topicKey.trim())
        );

        return topicDefinitions.map((topic, index) => {
            const progress = clampPercent(normalizedProgress[topic.topicKey] ?? 0);
            const prerequisiteTopic = index > 0 ? topicDefinitions[index - 1] : null;
            const isUnlocked = index === 0 || (prerequisiteTopic && completedTopicSet.has(prerequisiteTopic.topicKey));

            let status = "locked";
            if (completedTopicSet.has(topic.topicKey) || progress >= 100) {
                status = "done";
            } else if (isUnlocked) {
                status = "ongoing";
            }

            return {
                ...topic,
                progress: status === "done" ? 100 : progress,
                status,
                topicIcon: getTopicIconName(selectedPetName, topic.topicKey),
            };
        });
    }, [playerProgress, selectedPetName]);

    useEffect(() => {
        const profileRaw = localStorage.getItem(PROFILE_STORAGE_KEY);
        let resolvedProfile = null;
        if (profileRaw) {
            try {
                const profile = JSON.parse(profileRaw);
                resolvedProfile = profile && typeof profile === "object" ? profile : null;
                if (typeof profile?.name === "string" && profile.name.trim()) {
                    setHeaderName(profile.name.trim());
                }

                if (typeof profile?.petName === "string" && profile.petName.trim()) {
                    const restoredPetName = profile.petName.trim();
                    setSelectedPetName(restoredPetName);
                    setHeaderSecondaryText(`${restoredPetName} companion`);
                    const restoredPetImage = typeof profile?.petImage === "string" ? profile.petImage.trim() : "";
                    setCompanionAvatar(restoredPetImage || defaultAvatar);
                }

                if (
                    (!profile?.petName || !String(profile.petName).trim())
                    && typeof profile?.petImage === "string"
                    && profile.petImage.trim()
                ) {
                    setCompanionAvatar(profile.petImage.trim());
                }

                if (typeof profile?.heroName === "string" && profile.heroName.trim()) {
                    setHeaderSecondaryText(profile.heroName.trim());
                }

                if (typeof profile?.heroImage === "string" && profile.heroImage.trim()) {
                    setHeaderAvatar(profile.heroImage.trim());
                }
            } catch (error) {
                console.error("Failed to parse player profile", error);
            }
        }

        const scopedProgressKey = getScopedStorageKeyForProfile(PLAYER_PROGRESS_STORAGE_KEY, resolvedProfile);
        const allowLegacyProgressFallback = !hasExplicitPlayerId(resolvedProfile);
        const progressRaw = localStorage.getItem(scopedProgressKey)
            ?? (allowLegacyProgressFallback ? localStorage.getItem(PLAYER_PROGRESS_STORAGE_KEY) : null);
        if (progressRaw) {
            try {
                const parsedProgress = JSON.parse(progressRaw);
                setPlayerProgress(parsedProgress);

                const { level, title } = getPlayerLevelInfo(parsedProgress);
                setHeaderLevelLabel(`Level ${level} • ${title}`);
            } catch (error) {
                console.error("Failed to parse player progress", error);
                setPlayerProgress(defaultProgressState);
                setHeaderLevelLabel("Level 1 • Explorer");
            }
        } else {
            setPlayerProgress(defaultProgressState);
            setHeaderLevelLabel("Level 1 • Explorer");
        }
    }, []);

    useEffect(() => {
        if (topicCards.length === 0) {
            return;
        }

        const defaultFocusedCard = getDefaultFocusedTopicCard(topicCards);
        if (!defaultFocusedCard) {
            return;
        }

        if (!hasUserFocusedTopic) {
            if (focusedTopicKey !== defaultFocusedCard.topicKey) {
                setFocusedTopicKey(defaultFocusedCard.topicKey);
            }
            return;
        }

        const focusedCard = topicCards.find((card) => card.topicKey === focusedTopicKey);
        if (!focusedCard || focusedCard.status === "locked") {
            setFocusedTopicKey(defaultFocusedCard.topicKey);
            setHasUserFocusedTopic(false);
        }
    }, [focusedTopicKey, hasUserFocusedTopic, topicCards]);

    const handleFocusTopic = (topicKey) => {
        setHasUserFocusedTopic(true);
        setFocusedTopicKey(topicKey);
    };

    const handleStartTopic = (topicKey, status) => {
        if (status === "locked") {
            setStartMessage("This topic is locked. Complete earlier topics to unlock it.");
            return;
        }

        localStorage.setItem(selectedTopicStorageKey, topicKey);
        setStartMessage("Opening topic intro...");
        router.push("/topic-intro");
    };

    const moveCarouselByDirection = (direction) => {
        const viewport = carouselViewportRef.current;
        if (!viewport) {
            return;
        }

        const gap = 16;
        const cardWidth = (viewport.clientWidth - (gap * 3)) / 4;
        const offset = Math.max(0, cardWidth + gap);

        viewport.scrollBy({
            left: direction === "right" ? offset : -offset,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const viewport = carouselViewportRef.current;
        if (!viewport || !focusedTopicKey || topicCards.length === 0) {
            return;
        }

        const focusedIndex = topicCards.findIndex((card) => card.topicKey === focusedTopicKey);
        if (focusedIndex < 0) {
            return;
        }

        const gap = 16;
        const visibleCardCount = 4;
        const cardWidth = (viewport.clientWidth - (gap * (visibleCardCount - 1))) / visibleCardCount;
        const step = Math.max(0, cardWidth + gap);
        const firstVisibleIndex = Math.max(0, focusedIndex - (visibleCardCount - 1));
        const desiredLeft = step * firstVisibleIndex;
        const maxLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        const nextLeft = Math.min(desiredLeft, maxLeft);

        if (typeof viewport.scrollTo === "function") {
            viewport.scrollTo({
                left: nextLeft,
                behavior: hasUserFocusedTopic ? "smooth" : "auto",
            });
            return;
        }

        viewport.scrollLeft = nextLeft;
    }, [focusedTopicKey, hasUserFocusedTopic, topicCards]);

    const handleCarouselKeyDown = (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            moveCarouselByDirection("right");
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveCarouselByDirection("left");
        }
    };

    const handleCarouselPointerDown = (event) => {
        const viewport = carouselViewportRef.current;
        if (!viewport) {
            return;
        }

        dragStateRef.current = {
            active: true,
            startX: event.clientX,
            startScrollLeft: viewport.scrollLeft,
            moved: false,
        };
        setIsDraggingCarousel(true);
    };

    const handleCarouselPointerMove = (event) => {
        const viewport = carouselViewportRef.current;
        const dragState = dragStateRef.current;

        if (!viewport || !dragState.active) {
            return;
        }

        const deltaX = event.clientX - dragState.startX;
        if (Math.abs(deltaX) > 6) {
            dragStateRef.current.moved = true;
        }

        viewport.scrollLeft = dragState.startScrollLeft - deltaX;
    };

    const handleCarouselPointerUp = () => {
        dragStateRef.current.active = false;
        setIsDraggingCarousel(false);
    };

    const handleCardClick = (topicKey, isLocked) => {
        if (dragStateRef.current.moved) {
            dragStateRef.current.moved = false;
            return;
        }

        if (!isLocked) {
            handleFocusTopic(topicKey);
        }
    };

    const focusedTopicCard = useMemo(
        () => topicCards.find((card) => card.topicKey === focusedTopicKey) ?? getDefaultFocusedTopicCard(topicCards),
        [focusedTopicKey, topicCards]
    );

    const companionPrompt = useMemo(() => {
        if (!focusedTopicCard) {
            return `Ready to continue your grammar journey, ${headerName}?`;
        }

        if (focusedTopicCard.status === "locked") {
            return `Unlock ${focusedTopicCard.title} by mastering earlier topics first.`;
        }

        return `Ready to leap into ${focusedTopicCard.title.toLowerCase()}, ${headerName}?`;
    }, [focusedTopicCard, headerName]);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-100 text-slate-900">
            <div className="gpa-kid-bg" aria-hidden="true" />
            <span className="gpa-kid-icon gpa-kid-icon-cloud-left material-symbols-outlined" aria-hidden="true">cloud</span>
            <span className="gpa-kid-icon gpa-kid-icon-star-mid material-symbols-outlined" aria-hidden="true">star</span>
            <span className="gpa-kid-icon gpa-kid-icon-sparkle material-symbols-outlined" aria-hidden="true">auto_awesome</span>

            <HeaderBlock
                subtitle={headerLevelLabel}
                showProfile
                showProfileName
                showProfileSecondaryText
                showProfileAvatar
                profileName={headerName}
                profileSecondaryText={headerSecondaryText}
                profileAvatar={headerAvatar}
                profileAvatarAlt="Player avatar"
            />

            <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:py-8">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800">{mapTitle}</h2>
                    <p className="mt-2 text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                        Explore and master the building blocks of language.
                    </p>
                </div>

                <section className="mt-7 flex flex-col items-center">
                    <div className="relative max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                        <p>{companionPrompt}</p>
                        <span
                            className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-slate-200 bg-white"
                            aria-hidden="true"
                        />
                    </div>
                    <div className="mt-2 size-[190px] overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                        <img className="h-full w-full object-cover" src={companionAvatar} alt="Companion avatar" />
                    </div>
                </section>

                <section className="relative mt-8 w-full">
                    <div className="flex w-full items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => moveCarouselByDirection("left")}
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition hover:bg-sky-50"
                            aria-label="Scroll topics left"
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>

                        <div
                            ref={carouselViewportRef}
                            role="region"
                            aria-label="Topic cards carousel"
                            tabIndex={0}
                            onKeyDown={handleCarouselKeyDown}
                            onPointerDown={handleCarouselPointerDown}
                            onPointerMove={handleCarouselPointerMove}
                            onPointerUp={handleCarouselPointerUp}
                            onPointerCancel={handleCarouselPointerUp}
                            onPointerLeave={handleCarouselPointerUp}
                            className={`flex-1 overflow-x-auto overflow-y-visible pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${isDraggingCarousel ? "cursor-grabbing" : "cursor-grab"}`}
                            style={{ scrollbarWidth: "none" }}
                        >
                            <div className="flex min-w-full gap-4">
                                {topicCards.map((card) => {
                                    const avatar = getStatusAvatar(card.status);
                                    const isDone = card.status === "done";
                                    const isLocked = card.status === "locked";
                                    const isFocused = focusedTopicCard?.topicKey === card.topicKey;
                                    const cardStateClass = isLocked
                                        ? "border-slate-200 bg-white/80 opacity-70"
                                        : isDone
                                            ? "border-emerald-200 bg-white"
                                            : isFocused
                                                ? "border-primary ring-2 ring-primary/25 shadow-lg shadow-primary/25 bg-white"
                                                : "border-primary/15 bg-white";

                                    return (
                                        <article
                                            key={card.topicKey}
                                            role={isLocked ? undefined : "button"}
                                            tabIndex={isLocked ? -1 : 0}
                                            onClick={() => handleCardClick(card.topicKey, isLocked)}
                                            onKeyDown={(event) => {
                                                if (isLocked) {
                                                    return;
                                                }

                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault();
                                                    handleFocusTopic(card.topicKey);
                                                }
                                            }}
                                            className={`relative min-h-[245px] rounded-[28px] border p-5 text-left shadow-sm transition-all ${cardStateClass} ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                                            style={{ flex: "0 0 calc((100% - 3rem) / 4)" }}
                                        >
                                            <div className={`mx-auto flex size-14 items-center justify-center rounded-2xl ${getTopicIconContainerClass(card.status)}`}>
                                                <span className="material-symbols-outlined text-[26px]">{card.topicIcon}</span>
                                            </div>

                                            <h3 className={`mt-3 text-center text-2xl font-black leading-tight ${isLocked ? "text-slate-400" : "text-slate-800"}`}>
                                                {card.title}
                                            </h3>

                                            <p className={`mt-2 text-center text-sm leading-snug ${isLocked ? "text-slate-400" : "text-slate-600"}`}>
                                                {card.summary}
                                            </p>

                                            <div className="mt-4 flex items-center gap-2">
                                                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                    <div className={`h-full rounded-full ${getProgressColorClass(card.status)}`} style={{ width: `${card.progress}%` }} />
                                                </div>
                                                <span className={`text-xs font-bold ${isDone ? "text-emerald-600" : card.status === "ongoing" ? "text-primary" : "text-slate-400"}`}>
                                                    {card.progress}%
                                                </span>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${avatar.containerClass}`}>
                                                    <span className="material-symbols-outlined text-sm">{avatar.icon}</span>
                                                    {isDone ? "MASTERED" : isLocked ? "LOCKED" : "IN PROGRESS"}
                                                </span>

                                                {!isLocked && isFocused && (
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleStartTopic(card.topicKey, card.status);
                                                        }}
                                                        className={`h-9 rounded-full px-4 text-xs font-black ${card.status === "done"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-primary text-white"
                                                            }`}
                                                    >
                                                        {getActionLabel(card.status)}
                                                    </button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => moveCarouselByDirection("right")}
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition hover:bg-sky-50"
                            aria-label="Scroll topics right"
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                </section>

                <p className="mt-6 text-center text-base font-semibold text-primary" aria-live="polite">
                    {startMessage}
                </p>
            </main>
        </div>
    );
}
