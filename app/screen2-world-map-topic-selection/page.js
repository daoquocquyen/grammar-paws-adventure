"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPlayerLevelInfo } from "../../src/lib/playerLevel";

const profileStorageKey = "gpa_player_profile_v1";
const playerProgressKey = "gpa_player_progress_v1";
const selectedTopicStorageKey = "gpa_selected_topic_v1";

const defaultAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLzcyBcB1kXBKC87wVxPydRH8Z6etHELsVc2a1F90LjG3faXsG9lcV1nj4uPhMSLAcvG1K9WOjsOJUuFf9vn8cBvgVinFbMVfVQ4ZsvoqR4VsFMMOjU7W5ziFsCOdbm7y1Hzdi2OKt3DanVq7pUtiZPHqlA4Mp83miQek9iHzud_HcCndkFiA08inxZL51ILoGwd7eaPfnNDpGQDJ2JVcaceXxCStVVVV0SO1cUgoyLzo3h93o1VTGgpLm4BvSOg96jdnpWU7crOjd";

const cards = [
    {
        title: "Nouns",
        summary: "The naming words for people, places, and things.",
        progress: 100,
        state: "completed",
        cta: "Review",
    },
    {
        title: "Verbs",
        summary: "Action words and being words.",
        progress: 45,
        state: "active",
        cta: "Start Topic",
        topicKey: "verbs",
    },
    {
        title: "Pronouns",
        summary: "Words that replace nouns in a sentence.",
        progress: 0,
        state: "locked",
        cta: "Locked",
    },
];

export default function Screen2TopicSelectionPage() {
    const router = useRouter();
    const [headerName, setHeaderName] = useState("Adventurer");
    const [headerPetText, setHeaderPetText] = useState("Choose your first topic");
    const [headerAvatar, setHeaderAvatar] = useState(defaultAvatar);
    const [headerLevelLabel, setHeaderLevelLabel] = useState("Level 1 • Explorer");
    const [mapTitle, setMapTitle] = useState("World Map Topic Selection");
    const [startMessage, setStartMessage] = useState("");

    useEffect(() => {
        const profileRaw = localStorage.getItem(profileStorageKey);
        if (!profileRaw) {
            return;
        }

        try {
            const profile = JSON.parse(profileRaw);
            if (typeof profile?.name === "string" && profile.name.trim()) {
                const restoredName = profile.name.trim();
                setHeaderName(restoredName);
                setMapTitle(`${restoredName}'s World Map`);
            }

            if (typeof profile?.petName === "string" && profile.petName.trim()) {
                setHeaderPetText(`${profile.petName.trim()} companion`);
            }

            if (typeof profile?.petImage === "string" && profile.petImage.trim()) {
                setHeaderAvatar(profile.petImage.trim());
            }
        } catch (error) {
            console.error("Failed to parse player profile", error);
        }

        const progressRaw = localStorage.getItem(playerProgressKey);
        if (!progressRaw) {
            return;
        }

        try {
            const parsedProgress = JSON.parse(progressRaw);
            const { level, title } = getPlayerLevelInfo(parsedProgress);
            setHeaderLevelLabel(`Level ${level} • ${title}`);
        } catch (error) {
            console.error("Failed to parse player progress", error);
        }
    }, []);

    const handleStartTopic = (topicKey) => {
        localStorage.setItem(selectedTopicStorageKey, topicKey);
        setStartMessage("Opening topic intro...");
        router.push("/screen3-grammar-topic-intro");
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-slate-900">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 md:py-6">
                <div className="max-w-[1320px] w-full mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-full shadow-lg shadow-primary/30 text-white">
                            <span className="material-symbols-outlined text-2xl">pets</span>
                        </div>
                        <div className="text-left">
                            <h1 className="text-xl font-black tracking-tight text-primary">Grammar Paws Adventure</h1>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{headerLevelLabel}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-slate-700">{headerName}</span>
                            <span className="text-xs text-primary font-medium">{headerPetText}</span>
                        </div>
                        <div className="size-12 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200">
                            <img className="w-full h-full object-cover" src={headerAvatar} alt="Player avatar" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative flex-1 px-4 md:px-8 lg:px-10 max-w-[1400px] mx-auto w-full py-6 md:py-8">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3">{mapTitle}</h2>
                    <p className="text-lg md:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                        Master grammar one paw at a time! Follow the path to unlock new islands of knowledge.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                    {cards.map((card) => {
                        const isActive = card.state === "active";
                        const isCompleted = card.state === "completed";
                        const isLocked = card.state === "locked";

                        return (
                            <article
                                key={card.title}
                                className={`min-h-[300px] p-6 rounded-xl border-2 flex flex-col ${isActive
                                        ? "bg-white shadow-xl shadow-primary/20 border-primary"
                                        : isCompleted
                                            ? "bg-white shadow-lg shadow-slate-200/50 border-emerald-500/30"
                                            : "bg-white border-slate-200 opacity-75"
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div
                                        className={`size-9 rounded-full flex items-center justify-center ${isActive
                                                ? "bg-primary/10 text-primary"
                                                : isCompleted
                                                    ? "bg-emerald-100 text-emerald-600"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {isLocked ? "lock" : isCompleted ? "check_circle" : "play_circle"}
                                        </span>
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-black ${isLocked ? "text-slate-400" : "text-slate-800"}`}>{card.title}</h3>
                                <p className={`text-sm md:text-base mb-5 min-h-[48px] ${isLocked ? "text-slate-400" : "text-slate-500"}`}>{card.summary}</p>

                                <div className="mt-auto">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${isActive ? "bg-primary" : isCompleted ? "bg-emerald-500" : "bg-slate-300"
                                                    }`}
                                                style={{ width: `${card.progress}%` }}
                                            />
                                        </div>
                                        <span
                                            className={`text-sm font-bold ${isActive ? "text-primary" : isCompleted ? "text-emerald-600" : "text-slate-400"
                                                }`}
                                        >
                                            {card.progress}%
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={!isActive}
                                        onClick={() => {
                                            if (card.topicKey) {
                                                handleStartTopic(card.topicKey);
                                            }
                                        }}
                                        className={`w-full h-12 rounded-full text-sm font-bold ${isActive
                                                ? "bg-primary text-white"
                                                : isCompleted
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {card.cta}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <p className="mt-6 text-center text-base font-semibold text-primary" aria-live="polite">
                    {startMessage}
                </p>
            </main>
        </div>
    );
}
