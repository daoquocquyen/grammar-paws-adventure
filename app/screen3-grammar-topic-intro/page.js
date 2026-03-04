"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HeaderBlock from "../../src/components/HeaderBlock";
import { getPlayerLevelInfo } from "../../src/lib/playerLevel";
import { DEFAULT_COMPANION_AVATAR } from "../../src/lib/avatarDefaults";

const profileStorageKey = "gpa_player_profile_v1";
const playerProgressKey = "gpa_player_progress_v1";
const selectedTopicStorageKey = "gpa_selected_topic_v1";
const voiceSettingsKey = "gpa_voice_settings_v1";

const defaultAvatar = DEFAULT_COMPANION_AVATAR;

const topics = {
    verbs: {
        title: "Present Continuous",
        summary: "Learn how to describe things happening right now!",
        petQuote: "Meow! Let's learn how to talk about what's happening right this second!",
        aspects: [
            { rule: "The -ing Ending", example: "I am playing with my pet.", highlightWords: ["playing"] },
            { rule: "Am, Is, Are", example: "The puppy is sleeping.", highlightWords: ["is", "sleeping"] },
            { rule: "Now / Right Now", example: "She is drawing now.", highlightWords: ["drawing", "now"] },
        ],
    },
    nouns: {
        title: "Nouns",
        summary: "Learn the names of people, places, animals, and things.",
        petQuote: "Let's find naming words together!",
        aspects: [
            { rule: "Common Nouns", example: "The dog runs fast.", highlightWords: ["dog"] },
            { rule: "Proper Nouns", example: "Mia visits Ha Noi.", highlightWords: ["Mia", "Ha Noi"] },
            { rule: "Singular and Plural", example: "One apple, two apples.", highlightWords: ["apple", "apples"] },
        ],
    },
    pronouns: {
        title: "Pronouns",
        summary: "Use helper words that replace nouns.",
        petQuote: "Pronouns are shortcut words, and shortcuts are awesome!",
        aspects: [
            { rule: "Subject Pronouns", example: "She likes music.", highlightWords: ["She"] },
            { rule: "Object Pronouns", example: "I saw him at school.", highlightWords: ["him"] },
            { rule: "Possessive Pronouns", example: "The blue bag is mine.", highlightWords: ["mine"] },
        ],
    },
    adjectives: {
        title: "Adjectives",
        summary: "Describe nouns with words that add color and detail.",
        petQuote: "Let's paint our sentences with describing words!",
        aspects: [
            { rule: "Describing Size", example: "The tiny kitten slept.", highlightWords: ["tiny"] },
            { rule: "Describing Color", example: "I found a red ball.", highlightWords: ["red"] },
            { rule: "Order of Adjectives", example: "She has a small blue bag.", highlightWords: ["small", "blue"] },
        ],
    },
    adverbs: {
        title: "Adverbs",
        summary: "Tell how, when, or where an action happens.",
        petQuote: "Zoom quickly, learn happily!",
        aspects: [
            { rule: "How", example: "He runs quickly.", highlightWords: ["quickly"] },
            { rule: "When", example: "We will practice tomorrow.", highlightWords: ["tomorrow"] },
            { rule: "Where", example: "The dog waits outside.", highlightWords: ["outside"] },
        ],
    },
    prepositions: {
        title: "Prepositions",
        summary: "Show the relationship between words in a sentence.",
        petQuote: "Look under, over, and beside for meaning clues!",
        aspects: [
            { rule: "Place", example: "The book is on the table.", highlightWords: ["on"] },
            { rule: "Time", example: "Class starts at nine.", highlightWords: ["at"] },
            { rule: "Direction", example: "We walked into the room.", highlightWords: ["into"] },
        ],
    },
    conjunctions: {
        title: "Conjunctions",
        summary: "Join words and ideas into smoother sentences.",
        petQuote: "Connect ideas like puzzle pieces!",
        aspects: [
            { rule: "And / But", example: "I like tea and juice.", highlightWords: ["and"] },
            { rule: "Because", example: "She smiled because she won.", highlightWords: ["because"] },
            { rule: "Or", example: "Do you want rice or noodles?", highlightWords: ["or"] },
        ],
    },
    articles: {
        title: "Articles",
        summary: "Use a, an, and the with confidence.",
        petQuote: "Tiny words, big difference!",
        aspects: [
            { rule: "A", example: "I saw a cat.", highlightWords: ["a"] },
            { rule: "An", example: "She ate an apple.", highlightWords: ["an"] },
            { rule: "The", example: "The moon is bright.", highlightWords: ["The"] },
        ],
    },
    tenses: {
        title: "Tenses",
        summary: "Choose verb forms for past, present, and future.",
        petQuote: "Time travel with verbs!",
        aspects: [
            { rule: "Past", example: "We played yesterday.", highlightWords: ["played", "yesterday"] },
            { rule: "Present", example: "I play every day.", highlightWords: ["play"] },
            { rule: "Future", example: "They will play tomorrow.", highlightWords: ["will", "tomorrow"] },
        ],
    },
    punctuation: {
        title: "Punctuation",
        summary: "Use marks to make writing clear and expressive.",
        petQuote: "Commas pause, periods stop, and questions ask!",
        aspects: [
            { rule: "Period", example: "I love reading.", highlightWords: ["."] },
            { rule: "Question Mark", example: "Are you ready?", highlightWords: ["?"] },
            { rule: "Comma", example: "We packed books, pens, and snacks.", highlightWords: [","] },
        ],
    },
    "sentence-structure": {
        title: "Sentence Structure",
        summary: "Build complete sentences with clear word order.",
        petQuote: "Strong sentences are built one block at a time!",
        aspects: [
            { rule: "Subject + Verb", example: "Birds sing.", highlightWords: ["Birds", "sing"] },
            { rule: "Complete Thought", example: "The baby laughed loudly.", highlightWords: ["baby", "laughed"] },
            { rule: "Word Order", example: "My friend reads books.", highlightWords: ["friend", "reads", "books"] },
        ],
    },
};

const aspectIcons = [
    "category",
    "location_city",
    "exposure_plus_1",
    "list_alt",
    "sort_by_alpha",
    "checklist",
    "book_2",
    "extension",
    "tactic",
];

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const renderHighlightedExample = (exampleText, highlightWords = []) => {
    const validWords = Array.from(
        new Set(
            highlightWords
                .filter((word) => typeof word === "string")
                .map((word) => word.trim())
                .filter(Boolean)
        )
    ).sort((firstWord, secondWord) => secondWord.length - firstWord.length);

    if (validWords.length === 0) {
        return exampleText;
    }

    const highlightPattern = validWords.map((word) => escapeRegExp(word)).join("|");
    const highlightRegex = new RegExp(`(${highlightPattern})`, "gi");

    return exampleText.split(highlightRegex).map((chunk, chunkIndex) => {
        const isHighlighted = validWords.some((word) => word.toLowerCase() === chunk.toLowerCase());

        if (!isHighlighted) {
            return chunk;
        }

        return (
            <span key={`${chunk}-${chunkIndex}`} className="font-semibold text-primary">
                {chunk}
            </span>
        );
    });
};

export default function Screen3TopicIntroPage() {
    const [headerName, setHeaderName] = useState("Adventurer");
    const [headerSecondaryText, setHeaderSecondaryText] = useState("Choose your first topic");
    const [headerAvatar, setHeaderAvatar] = useState(defaultAvatar);
    const [companionAvatar, setCompanionAvatar] = useState(defaultAvatar);
    const [headerLevelLabel, setHeaderLevelLabel] = useState("Level 1 • Explorer");

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
                    setHeaderSecondaryText(`${profile.petName.trim()} companion`);
                }
                if (typeof profile?.heroName === "string" && profile.heroName.trim()) {
                    setHeaderSecondaryText(profile.heroName.trim());
                }
                const restoredPetImage = typeof profile?.petImage === "string" ? profile.petImage.trim() : "";
                setCompanionAvatar(restoredPetImage || defaultAvatar);
                if (typeof profile?.heroImage === "string" && profile.heroImage.trim()) {
                    setHeaderAvatar(profile.heroImage.trim());
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

        const progressRaw = localStorage.getItem(playerProgressKey);
        if (progressRaw) {
            try {
                const parsedProgress = JSON.parse(progressRaw);
                const { level, title } = getPlayerLevelInfo(parsedProgress);
                setHeaderLevelLabel(`Level ${level} • ${title}`);
            } catch (error) {
                console.error("Failed to parse player progress", error);
                setHeaderLevelLabel("Level 1 • Explorer");
            }
        } else {
            setHeaderLevelLabel("Level 1 • Explorer");
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
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-100 text-slate-900">
            <div className="gpa-kid-bg" aria-hidden="true" />
            <span className="gpa-kid-icon gpa-kid-icon-cloud-left material-symbols-outlined" aria-hidden="true">cloud</span>
            <span className="gpa-kid-icon gpa-kid-icon-star-mid material-symbols-outlined" aria-hidden="true">star</span>
            <span className="gpa-kid-icon gpa-kid-icon-sparkle material-symbols-outlined" aria-hidden="true">auto_awesome</span>
            <span className="gpa-kid-icon gpa-kid-icon-bone material-symbols-outlined" aria-hidden="true">abc</span>

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

            <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-4 py-6 md:py-8">
                {isLoading && (
                    <section className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-4 text-center">
                        <p className="text-sm font-bold text-slate-500">Loading topic content...</p>
                    </section>
                )}

                {!isLoading && loadError && (
                    <section className="w-full max-w-3xl rounded-[28px] border border-rose-200 bg-rose-50 p-4 text-center">
                        <h3 className="mb-1 text-sm font-black text-rose-600">We couldn't load this topic.</h3>
                        <p className="mb-3 text-xs text-rose-500">{loadError}</p>
                        <Link
                            href="/world-map"
                            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-black text-white"
                        >
                            Back to Map
                        </Link>
                    </section>
                )}

                {!isLoading && !loadError && topic && (
                    <section className="w-full max-w-5xl pt-4 md:pt-8">
                        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-2 shadow-sm">
                            <span className="material-symbols-outlined text-primary text-[18px]">book_2</span>
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">{topic.title}</h2>
                        </div>
                        <p className="mt-3 text-center text-lg font-semibold text-slate-700">{topic.summary}</p>

                        <section className="mt-8 grid grid-cols-1 gap-5 md:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
                            {topic.aspects.map((aspect, index) => {
                                const aspectIcon = aspectIcons[index % aspectIcons.length];
                                const highlightedExample = renderHighlightedExample(aspect.example, aspect.highlightWords);

                                return (
                                    <article
                                        key={aspect.rule}
                                        className="rounded-[28px] border border-primary/15 bg-white px-5 py-8 text-center shadow-sm"
                                    >
                                        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <span className="material-symbols-outlined text-[20px]">{aspectIcon}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">{aspect.rule}</h3>
                                        <p className="mt-2 text-sm italic text-slate-500">
                                            Example: {highlightedExample}
                                        </p>
                                    </article>
                                );
                            })}

                            {topic.aspects.length === 0 && (
                                <article className="rounded-[28px] border border-primary/15 bg-white px-5 py-8 text-center shadow-sm md:col-span-full">
                                    <h3 className="text-xl font-black text-slate-900">No aspects available yet</h3>
                                    <p className="mt-2 text-sm text-slate-500">Please pick another topic from the map.</p>
                                </article>
                            )}
                        </section>

                        <section className="mt-12 flex flex-col items-center justify-center gap-6 md:flex-row md:items-end">
                            <div className="relative">
                                <div className="size-[190px] overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={companionAvatar}
                                        alt={`${headerSecondaryText} avatar`}
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 flex items-center">
                                    <button
                                        id="muteToggleButton"
                                        type="button"
                                        onClick={handleToggleMute}
                                        disabled={!voiceSupported}
                                        className={`size-8 rounded-full border border-slate-200 bg-white text-primary shadow-sm ${!voiceSupported
                                            ? "cursor-not-allowed text-slate-400"
                                            : ""
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-base">{voiceMuted ? "volume_off" : "volume_up"}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="max-w-xl rounded-[28px] border border-primary/15 bg-white px-7 py-6 text-left shadow-sm">
                                <p className="mt-1 text-xl font-black leading-snug text-slate-900">{topic.petQuote}</p>
                                <p className="mt-2 text-xs text-slate-500" aria-live="polite">
                                    {!voiceSupported
                                        ? "Voice unavailable in this browser. Text mode is active."
                                        : voiceMuted
                                            ? "Voice is muted. Tap to unmute."
                                            : `Listening with ${headerName}'s companion.`}
                                </p>
                            </div>
                        </section>

                        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-9 py-3.5 text-lg font-black text-white shadow-lg shadow-primary/25"
                            >
                                Start Challenge
                                <span className="material-symbols-outlined text-base">play_circle</span>
                            </button>
                            <Link
                                href="/world-map"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-9 py-3.5 text-lg font-black text-primary"
                            >
                                <span className="material-symbols-outlined text-base">map</span>
                                Back to Map
                            </Link>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
