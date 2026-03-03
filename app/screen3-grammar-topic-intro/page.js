"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const profileStorageKey = "gpa_player_profile_v1";
const selectedTopicStorageKey = "gpa_selected_topic_v1";
const voiceSettingsKey = "gpa_voice_settings_v1";

const defaultAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLzcyBcB1kXBKC87wVxPydRH8Z6etHELsVc2a1F90LjG3faXsG9lcV1nj4uPhMSLAcvG1K9WOjsOJUuFf9vn8cBvgVinFbMVfVQ4ZsvoqR4VsFMMOjU7W5ziFsCOdbm7y1Hzdi2OKt3DanVq7pUtiZPHqlA4Mp83miQek9iHzud_HcCndkFiA08inxZL51ILoGwd7eaPfnNDpGQDJ2JVcaceXxCStVVVV0SO1cUgoyLzo3h93o1VTGgpLm4BvSOg96jdnpWU7crOjd";

const topics = {
    verbs: {
        title: "Present Continuous",
        summary: "Learn how to describe things happening right now!",
        petQuote: "Meow! Let's learn how to talk about what's happening right this second!",
        aspects: [
            { rule: "The -ing Ending", example: "I am playing with my pet." },
            { rule: "Am, Is, Are", example: "The puppy is sleeping." },
            { rule: "Now / Right Now", example: "She is drawing now." },
        ],
    },
    nouns: {
        title: "Nouns",
        summary: "Learn the names of people, places, animals, and things.",
        petQuote: "Let's find naming words together!",
        aspects: [
            { rule: "Common Nouns", example: "The dog runs fast." },
            { rule: "Proper Nouns", example: "Mia visits Ha Noi." },
            { rule: "Singular and Plural", example: "One apple, two apples." },
        ],
    },
    pronouns: {
        title: "Pronouns",
        summary: "Use helper words that replace nouns.",
        petQuote: "Pronouns are shortcut words, and shortcuts are awesome!",
        aspects: [
            { rule: "Subject Pronouns", example: "She likes music." },
            { rule: "Object Pronouns", example: "I saw him at school." },
            { rule: "Possessive Pronouns", example: "The blue bag is mine." },
        ],
    },
};

export default function Screen3TopicIntroPage() {
    const [headerName, setHeaderName] = useState("Adventurer");
    const [headerPetText, setHeaderPetText] = useState("Choose your first topic");
    const [headerAvatar, setHeaderAvatar] = useState(defaultAvatar);

    const [selectedTopicKey, setSelectedTopicKey] = useState("verbs");
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [voiceSupported, setVoiceSupported] = useState(false);
    const [voiceMuted, setVoiceMuted] = useState(false);

    const topic = useMemo(() => topics[selectedTopicKey] ?? null, [selectedTopicKey]);

    const speakTopicIntro = (topicData) => {
        if (!topicData || !voiceSupported || voiceMuted) {
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${topicData.title}. ${topicData.summary} ${topicData.petQuote}`);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const saveVoiceSettings = (nextMuted) => {
        try {
            localStorage.setItem(voiceSettingsKey, JSON.stringify({ muted: nextMuted }));
        } catch (error) {
            console.error("Failed to save voice settings", error);
        }
    };

    useEffect(() => {
        const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
        setVoiceSupported(canSpeak);

        const profileRaw = localStorage.getItem(profileStorageKey);
        if (profileRaw) {
            try {
                const profile = JSON.parse(profileRaw);
                if (typeof profile?.name === "string" && profile.name.trim()) {
                    setHeaderName(profile.name.trim());
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
        }

        const voiceRaw = localStorage.getItem(voiceSettingsKey);
        if (voiceRaw) {
            try {
                const voiceSettings = JSON.parse(voiceRaw);
                setVoiceMuted(Boolean(voiceSettings?.muted));
            } catch {
                setVoiceMuted(false);
            }
        }

        const selectedTopic = localStorage.getItem(selectedTopicStorageKey);
        if (selectedTopic && topics[selectedTopic]) {
            setSelectedTopicKey(selectedTopic);
            setLoadError("");
        } else if (selectedTopic && !topics[selectedTopic]) {
            setLoadError("We couldn't load this topic. Please go back to map and choose another topic.");
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading && topic && !voiceMuted) {
            speakTopicIntro(topic);
        }
    }, [isLoading, topic, voiceMuted, voiceSupported]);

    const handleReplayVoice = () => {
        speakTopicIntro(topic);
    };

    const handleToggleMute = () => {
        const nextMuted = !voiceMuted;
        setVoiceMuted(nextMuted);
        saveVoiceSettings(nextMuted);

        if (nextMuted && voiceSupported) {
            window.speechSynthesis.cancel();
            return;
        }

        if (!nextMuted && topic) {
            speakTopicIntro(topic);
        }
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
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Level 12 • Explorer</p>
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

            <main className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-6 lg:px-8 py-4">
                {isLoading && (
                    <section className="bg-white p-4 rounded-[28px] border border-slate-200 mb-4">
                        <p className="text-sm font-bold text-slate-500">Loading topic content...</p>
                    </section>
                )}

                {!isLoading && loadError && (
                    <section className="bg-rose-50 p-4 rounded-lg border border-rose-200 mb-4">
                        <h3 className="text-sm font-black text-rose-600 mb-1">We couldn't load this topic.</h3>
                        <p className="text-xs text-rose-500 mb-3">{loadError}</p>
                        <Link
                            href="/screen2-world-map-topic-selection"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500 text-white text-xs font-black"
                        >
                            Back to Map
                        </Link>
                    </section>
                )}

                {!isLoading && !loadError && topic && (
                    <section>
                        <section className="bg-white border border-slate-200 rounded-[24px] p-4 mb-3">
                            <h2 className="text-3xl font-black text-slate-900 mb-1">{topic.title}</h2>
                            <p className="text-base text-slate-600 font-medium">{topic.summary}</p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-3 items-start">
                            <section className="bg-white border border-slate-200 rounded-[24px] p-3 text-center relative">
                                <p className="text-[18px] leading-snug italic text-slate-700">"{topic.petQuote}"</p>
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <button
                                        id="replayVoiceButton"
                                        type="button"
                                        onClick={handleReplayVoice}
                                        disabled={!voiceSupported || voiceMuted}
                                        className={`size-8 rounded-full flex items-center justify-center ${
                                            !voiceSupported || voiceMuted
                                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                : "bg-primary/15 text-primary"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-base">volume_up</span>
                                    </button>
                                    <button
                                        id="muteToggleButton"
                                        type="button"
                                        onClick={handleToggleMute}
                                        disabled={!voiceSupported}
                                        className={`size-8 rounded-full flex items-center justify-center ${
                                            !voiceSupported
                                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                : "bg-primary/15 text-primary"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-base">{voiceMuted ? "volume_off" : "volume_up"}</span>
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-2" aria-live="polite">
                                    {!voiceSupported
                                        ? "Voice unavailable in this browser. Text mode is active."
                                        : voiceMuted
                                          ? "Voice is muted. Tap to unmute."
                                          : "Voice will play automatically."}
                                </p>
                            </section>

                            <section className="bg-white border border-slate-200 rounded-[24px] p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-black text-slate-800">Rules of the Road</h3>
                                    <span className="text-xs font-black text-primary uppercase tracking-wide">{topic.aspects.length} aspects</span>
                                </div>
                                <div className="space-y-3">
                                    {topic.aspects.map((aspect) => (
                                        <article key={aspect.rule} className="rounded-xl border border-slate-200 p-3">
                                            <h4 className="font-black text-slate-800 text-base">{aspect.rule}</h4>
                                            <p className="text-sm text-slate-600 mt-1">Example: {aspect.example}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                            <button
                                type="button"
                                className="px-8 py-2.5 bg-primary text-white rounded-full font-black text-sm shadow-lg shadow-primary/25"
                            >
                                Start Challenge
                            </button>
                            <Link
                                href="/screen2-world-map-topic-selection"
                                className="px-8 py-2.5 border-2 border-primary text-primary rounded-full font-black text-sm bg-white"
                            >
                                Back to Map
                            </Link>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
