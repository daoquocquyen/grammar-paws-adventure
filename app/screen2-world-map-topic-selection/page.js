"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import HeaderBlock from "../../src/components/HeaderBlock";
import { getPlayerLevelInfo } from "../../src/lib/playerLevel";

const profileStorageKey = "gpa_player_profile_v1";
const playerProgressKey = "gpa_player_progress_v1";
const selectedTopicStorageKey = "gpa_selected_topic_v1";

const defaultAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLzcyBcB1kXBKC87wVxPydRH8Z6etHELsVc2a1F90LjG3faXsG9lcV1nj4uPhMSLAcvG1K9WOjsOJUuFf9vn8cBvgVinFbMVfVQ4ZsvoqR4VsFMMOjU7W5ziFsCOdbm7y1Hzdi2OKt3DanVq7pUtiZPHqlA4Mp83miQek9iHzud_HcCndkFiA08inxZL51ILoGwd7eaPfnNDpGQDJ2JVcaceXxCStVVVV0SO1cUgoyLzo3h93o1VTGgpLm4BvSOg96jdnpWU7crOjd";

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

const getLaneAlignmentClass = (index) => {
    return index % 2 === 0 ? "md:justify-start" : "md:justify-end";
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
    const [mapTitle, setMapTitle] = useState("World Map Topic Selection");
    const [startMessage, setStartMessage] = useState("");
    const [expandedTopicKey, setExpandedTopicKey] = useState(topicDefinitions[0].topicKey);
    const [playerLevel, setPlayerLevel] = useState(1);
    const [playerProgress, setPlayerProgress] = useState(defaultProgressState);
    const [roadPath, setRoadPath] = useState("");

    const roadContainerRef = useRef(null);
    const topicNodeRefs = useRef({});

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
                    const restoredName = profile.name.trim();
                    setHeaderName(restoredName);
                    setMapTitle(`${restoredName}'s World Map`);
                }

                if (typeof profile?.petName === "string" && profile.petName.trim()) {
                    const restoredPetName = profile.petName.trim();
                    setSelectedPetName(restoredPetName);
                    setHeaderPetText(`${restoredPetName} companion`);
                }

                if (typeof profile?.petImage === "string" && profile.petImage.trim()) {
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
        const expandedCard = topicCards.find((card) => card.topicKey === expandedTopicKey);
        if (expandedCard && expandedCard.status !== "locked") {
            return;
        }

        const firstInteractiveCard = topicCards.find((card) => card.status !== "locked") ?? topicCards[0];
        if (firstInteractiveCard) {
            setExpandedTopicKey(firstInteractiveCard.topicKey);
        }
    }, [expandedTopicKey, topicCards]);

    const handleOpenTopic = (topicKey) => {
        setExpandedTopicKey(topicKey);
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

    useEffect(() => {
        const buildRoadPath = () => {
            const container = roadContainerRef.current;
            if (!container) {
                return;
            }

            const containerRect = container.getBoundingClientRect();
            const points = topicCards
                .map((card) => {
                    const node = topicNodeRefs.current[card.topicKey];
                    if (!node) {
                        return null;
                    }

                    const nodeRect = node.getBoundingClientRect();
                    return {
                        x: nodeRect.left - containerRect.left + nodeRect.width / 2,
                        y: nodeRect.top - containerRect.top + nodeRect.height / 2,
                    };
                })
                .filter(Boolean);

            if (points.length < 2) {
                setRoadPath("");
                return;
            }

            let pathData = `M ${points[0].x} ${points[0].y}`;

            for (let index = 1; index < points.length - 1; index += 1) {
                const current = points[index];
                const next = points[index + 1];
                const midX = (current.x + next.x) / 2;
                const midY = (current.y + next.y) / 2;
                pathData += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
            }

            const lastPoint = points[points.length - 1];
            pathData += ` T ${lastPoint.x} ${lastPoint.y}`;
            setRoadPath(pathData);
        };

        const frameId = window.requestAnimationFrame(buildRoadPath);
        window.addEventListener("resize", buildRoadPath);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("resize", buildRoadPath);
        };
    }, [expandedTopicKey, topicCards]);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-slate-900">
            <HeaderBlock
                subtitle={headerLevelLabel}
                showProfile
                profileName={headerName}
                profilePetText={headerPetText}
                profileAvatar={headerAvatar}
                profileAvatarAlt="Player avatar"
            />

            <main className="relative flex-1 px-4 md:px-8 lg:px-10 max-w-[1400px] mx-auto w-full py-6 md:py-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3">{mapTitle}</h2>
                    <p className="text-lg md:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                        Follow the winding road and tap each topic to see details before you start.
                    </p>
                </div>

                <section className="relative rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white p-4 md:p-6 lg:p-8">

                    <section ref={roadContainerRef} className="relative max-w-5xl mx-auto pb-8" aria-label="Topic road map">
                        {roadPath && (
                            <svg
                                className="absolute inset-0 w-full h-full pointer-events-none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path d={roadPath} fill="none" stroke="rgb(226 232 240)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                                <path
                                    d={roadPath}
                                    fill="none"
                                    stroke="rgb(148 163 184 / 0.7)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray="7 9"
                                />
                            </svg>
                        )}

                        <div className="relative space-y-6 md:space-y-10">
                            {topicCards.map((card, index) => {
                                const avatar = getStatusAvatar(card.status);
                                const isDone = card.status === "done";
                                const isLocked = card.status === "locked";
                                const isExpanded = !isLocked && expandedTopicKey === card.topicKey;
                                const laneAlignmentClass = getLaneAlignmentClass(index);
                                const cardStateClass = isLocked
                                    ? "bg-slate-100 border-slate-300"
                                    : card.status === "done"
                                        ? "bg-emerald-50 border-emerald-300"
                                        : "bg-sky-50 border-sky-300";

                                return (
                                    <div key={card.topicKey} className={`relative flex justify-center ${laneAlignmentClass}`}>
                                        <button
                                            ref={(element) => {
                                                topicNodeRefs.current[card.topicKey] = element;
                                            }}
                                            type="button"
                                            disabled={isLocked}
                                            onClick={() => {
                                                if (!isLocked) {
                                                    handleOpenTopic(card.topicKey);
                                                }
                                            }}
                                            aria-expanded={isExpanded}
                                            className={`w-full md:w-[360px] rounded-2xl border-2 text-left transition-all duration-200 ${cardStateClass} ${isExpanded
                                                ? "shadow-lg shadow-primary/20 p-5"
                                                : "p-4"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`size-10 rounded-full flex items-center justify-center ${avatar.containerClass}`}>
                                                    <span className="material-symbols-outlined text-xl">{avatar.icon}</span>
                                                </div>
                                                <div className={`size-10 rounded-full flex items-center justify-center ${getTopicIconContainerClass(card.status)}`}>
                                                    <span className="material-symbols-outlined text-xl">{card.topicIcon}</span>
                                                </div>
                                                <h3 className={`text-lg font-black leading-tight ${isLocked ? "text-slate-600" : "text-slate-800"}`}>{card.title}</h3>
                                            </div>

                                            <p className={`text-sm ${isLocked ? "text-slate-500" : "text-slate-600"} ${isExpanded ? "mt-4" : "mt-3"}`}>{card.summary}</p>

                                            {isExpanded && (
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${getProgressColorClass(card.status)}`} style={{ width: `${card.progress}%` }} />
                                                        </div>
                                                        <span className={`text-sm font-bold ${isDone ? "text-emerald-600" : "text-sky-600"}`}>
                                                            {card.progress}%
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleStartTopic(card.topicKey, card.status);
                                                        }}
                                                        className={`w-full h-11 rounded-full text-sm font-bold ${card.status === "done"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-primary text-white"
                                                            }`}
                                                    >
                                                        {getActionLabel(card.status)}
                                                    </button>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </section>

                <p className="mt-6 text-center text-base font-semibold text-primary" aria-live="polite">
                    {startMessage}
                </p>
            </main>
        </div>
    );
}
