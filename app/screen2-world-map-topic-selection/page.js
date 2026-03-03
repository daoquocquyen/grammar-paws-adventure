"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import HeaderBlock from "../../src/components/HeaderBlock";
import { getPlayerLevelInfo } from "../../src/lib/playerLevel";

const profileStorageKey = "gpa_player_profile_v1";
const playerProgressKey = "gpa_player_progress_v1";
const selectedTopicStorageKey = "gpa_selected_topic_v1";

const petAvatarByName = {
    "Brave Puppy": "https://lh3.googleusercontent.com/aida-public/AB6AXuC8UfnI-4ZD6WEiN5gXUwP6EMRX8mNxLA9lGZ-YGKsdeGIk3_z0ChWxvjCrlNqwdcRcIKhpf8cbPISdsBtzfR8ZWbQLVLIB3hMDemAxSYWw_y4NW3ORCs0G_OOf1VMb0Ohrjwb84k4ocpIXuMQ5Kugzcsr8FyeyWl-MWUFSwrE5_U_ArLy3y0ASzoi7bAL2jCMtsYqFsoLW3v5f5hCDNNQXiiTMcEn5moNywZMVUmPowbyKNzSpFejqiHpOjSKx5qq22mJLQE20Nlmn",
    "Wise Kitten": "https://lh3.googleusercontent.com/aida-public/AB6AXuB5E1yagRgTQDhzkkiH1Z2CFZOL6i2dCszN8wKwrkeSPODDca-qhj_TxgvSsIytjeJuqHg8am8KFJuSxK-BI6XbzHMivZnxQhdVeYrP5lIC1lXuVDSLE1HGOopsI461dIZPO-sSSlob8ku513pA2DVZqBZd8Gg6TFyeGWTq_hYRpHTEIUQGfkLhJ1bplVqJeWQ7Hr8zJI7jdFH-07PxPO9crdCPHRasfWFtdr2s13S4E2hJNaOslEXeEEhs0ooN4211MMcSFSsHHQuH",
    "Swift Bunny": "https://lh3.googleusercontent.com/aida-public/AB6AXuBmx66OJYOOhrLcMEF9rs4_vmdVbAy8khc5VWVTgQUhCDz9HHcP5ZjRid_jTSIi4P7iSRATxBB67mNbPWnElulY7iGXcpxh2S-IQ8LTTWNMk8Gbp8XMCdN4df7qqvE4edbpCIjc347_Ibv6GyuLJO6t3QCHSt4iGFQ19jgvg0vzZq4EW1ibIhv--_LQegdyf9pw-AYhsqmt5MUfy1JQfWU3m-fnTUUPzHuvJacNm4FwnROdAv2_1wM2TLB2a5CyEmV0DEn6MO5aM4Fa",
    "Happy Hamster": "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5l3I0e6UIAujP1swxyelIDciALjoKFoCygY-EW7QoSpnoajHDEsFBXr6xy6eAW1ddDsNpb0B2WLgo19m_Foe_3BMsUIzQLTd9Adz9vZAJMU0Bz2IMjUSEp03P6_MpHz1OyWhoWr62FGytj2DTo5S18AoGyADFdcey47VuH_7ptbli7bbx86xstDJEvfv6tDsuBt9oNVCsCglpcJIH185hG9xcCbD_syhGUdU3ijf7Xsmy7iu0-VFcJkVHN5Gl5MWJ9WArOx009VO",
    "Steady Turtle": "https://lh3.googleusercontent.com/aida-public/AB6AXuCWVNsQrrHlzjhXt6-JawZXqs8hMsLHZXaCr1K-SeNmCrhfJrhs71q3QFdcZ99isFQ5HxsrNpP3s_2Y4ID1DTlEJ5m-UOLkhChZTWE3V4jn33vzK-C_dSHOqrjcvw38p62g3u9rQHydnKPNRZoMFQCYANpoYJNweDZqxNT3TMVobDJj5orTLsz8hpTgNrW9onS77Dp6lhu76oEDqWATFced9fJDhxOaCPinxeik57KCGKrQOUnRN8Zm9zLxEwCNieSHJ8v-QdHwgMx2",
    "Magic Dragon": "https://lh3.googleusercontent.com/aida-public/AB6AXuAblbJmRXR3T20lYkFMbjW7V2nawLnAVPYrazc27WtJ0Ls9bEv3NqcPaIcycgvrkkPR3aR36ufzZ2VU9oH7SbI8xcWe71WOpmLjosPJK0uAzfDefFBQIs9s8Ps5XU02S58g7naEzlaeP2OO8ITuCGHMuy1eUmWX_axPdMG0TdN5Y4MGpBXKd4NihhjS7CoW8ZFZNVPbZ1avtEGuPMqnMs2waECZaOupHvsARJMBhdZX-EXxiA2baHgCXj4ohbO5jb_uDLsp-uq08XWC",
};

const defaultAvatar = petAvatarByName["Brave Puppy"];

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
        summary: "Practice action words and helping words in simple sentences.",
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
        summary: "Show relationships in place, time, and direction clearly.",
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
        summary: "Talk about past, present, and future events with confidence.",
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

export default function Screen2TopicSelectionPage() {
    const router = useRouter();
    const [headerName, setHeaderName] = useState("Adventurer");
    const [headerPetText, setHeaderPetText] = useState("Choose your first topic");
    const [selectedPetName, setSelectedPetName] = useState("");
    const [headerAvatar, setHeaderAvatar] = useState(defaultAvatar);
    const [headerLevelLabel, setHeaderLevelLabel] = useState("Level 1 • Explorer");
    const [mapTitle] = useState("Grammar World Map");
    const [startMessage, setStartMessage] = useState("");
    const [focusedTopicKey, setFocusedTopicKey] = useState(topicDefinitions[0].topicKey);
    const [playerLevel, setPlayerLevel] = useState(1);
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

        const highestEngagedIndex = topicDefinitions.reduce((currentMax, topic, index) => {
            const hasEngagement = completedTopicSet.has(topic.topicKey) || (normalizedProgress[topic.topicKey] ?? 0) > 0;
            return hasEngagement ? index : currentMax;
        }, -1);

        const sequentialUnlockedCount = Math.min(topicDefinitions.length, Math.max(1, highestEngagedIndex + 2));
        const unlockedByLevelCount = Math.min(topicDefinitions.length, Math.max(1, playerLevel));
        const unlockedCount = Math.max(sequentialUnlockedCount, unlockedByLevelCount);

        return topicDefinitions.map((topic, index) => {
            const progress = clampPercent(normalizedProgress[topic.topicKey] ?? 0);

            let status = "locked";
            if (completedTopicSet.has(topic.topicKey) || progress >= 100) {
                status = "done";
            } else if (progress > 0 || index < unlockedCount) {
                status = "ongoing";
            }

            return {
                ...topic,
                progress: status === "done" ? 100 : progress,
                status,
                topicIcon: getTopicIconName(selectedPetName, topic.topicKey),
            };
        });
    }, [playerLevel, playerProgress, selectedPetName]);

    useEffect(() => {
        const profileRaw = localStorage.getItem(profileStorageKey);
        if (profileRaw) {
            try {
                const profile = JSON.parse(profileRaw);
                if (typeof profile?.name === "string" && profile.name.trim()) {
                    setHeaderName(profile.name.trim());
                }

                if (typeof profile?.petName === "string" && profile.petName.trim()) {
                    const restoredPetName = profile.petName.trim();
                    setSelectedPetName(restoredPetName);
                    setHeaderPetText(`${restoredPetName} companion`);
                    setHeaderAvatar(petAvatarByName[restoredPetName] ?? defaultAvatar);
                }

                if (
                    (!profile?.petName || !String(profile.petName).trim())
                    && typeof profile?.petImage === "string"
                    && profile.petImage.trim()
                ) {
                    setHeaderAvatar(profile.petImage.trim());
                }
            } catch (error) {
                console.error("Failed to parse player profile", error);
            }
        }

        const progressRaw = localStorage.getItem(playerProgressKey);
        if (progressRaw) {
            try {
                const parsedProgress = JSON.parse(progressRaw);
                setPlayerProgress(parsedProgress);

                const { level, title } = getPlayerLevelInfo(parsedProgress);
                setPlayerLevel(level);
                setHeaderLevelLabel(`Level ${level} • ${title}`);
            } catch (error) {
                console.error("Failed to parse player progress", error);
                setPlayerProgress(defaultProgressState);
                setPlayerLevel(1);
                setHeaderLevelLabel("Level 1 • Explorer");
            }
        } else {
            setPlayerProgress(defaultProgressState);
            setPlayerLevel(1);
            setHeaderLevelLabel("Level 1 • Explorer");
        }
    }, []);

    useEffect(() => {
        const focusedCard = topicCards.find((card) => card.topicKey === focusedTopicKey);
        if (focusedCard && focusedCard.status !== "locked") {
            return;
        }

        const firstInteractiveCard = topicCards.find((card) => card.status !== "locked") ?? topicCards[0];
        if (firstInteractiveCard) {
            setFocusedTopicKey(firstInteractiveCard.topicKey);
        }
    }, [focusedTopicKey, topicCards]);

    const handleFocusTopic = (topicKey) => {
        setFocusedTopicKey(topicKey);
    };

    const handleStartTopic = (topicKey, status) => {
        if (status === "locked") {
            setStartMessage("This topic is locked. Complete earlier topics to unlock it.");
            return;
        }

        localStorage.setItem(selectedTopicStorageKey, topicKey);
        setStartMessage("Opening topic intro...");
        router.push("/screen3-grammar-topic-intro");
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
        () => topicCards.find((card) => card.topicKey === focusedTopicKey) ?? topicCards.find((card) => card.status !== "locked") ?? topicCards[0],
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
                profileName={headerName}
                profilePetText={headerPetText}
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
                        <img className="h-full w-full object-cover" src={headerAvatar} alt="Companion avatar" />
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
