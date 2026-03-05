"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HeaderBlock from "../../src/components/HeaderBlock";
import { DEFAULT_COMPANION_AVATAR } from "../../src/lib/avatarDefaults";

import {
    createTopicQuestionBank,
    RECENT_TOPIC_ATTEMPT_COOLDOWN,
    selectChallengeQuestions,
} from "../../src/lib/challengeQuestionSelection";
import { getPlayerLevelInfo } from "../../src/lib/playerLevel";

const profileStorageKey = "gpa_player_profile_v1";
const playerProgressKey = "gpa_player_progress_v1";
const selectedTopicStorageKey = "gpa_selected_topic_v1";
const topicAttemptHistoryKey = "gpa_topic_attempt_history_v1";
const defaultAvatar = DEFAULT_COMPANION_AVATAR;

const topicAspectsByTopicKey = {
    verbs: ["ing-ending", "auxiliary", "time-marker"],
    nouns: ["common", "proper", "plurality"],
    pronouns: ["subject", "object", "possessive"],
    adjectives: ["size", "color", "order"],
    adverbs: ["how", "when", "where"],
    prepositions: ["place", "time", "direction"],
    conjunctions: ["and-but", "because", "or"],
    articles: ["a", "an", "the"],
    tenses: ["past", "present", "future"],
    punctuation: ["period", "question-mark", "comma"],
    "sentence-structure": ["subject-verb", "complete-thought", "word-order"],
};

const readTopicAttemptHistory = () => {
    try {
        const rawHistory = localStorage.getItem(topicAttemptHistoryKey);
        if (!rawHistory) {
            return {};
        }

        const parsedHistory = JSON.parse(rawHistory);
        return parsedHistory && typeof parsedHistory === "object" ? parsedHistory : {};
    } catch {
        return {};
    }
};

const saveTopicAttemptHistory = (historyByTopic) => {
    try {
        localStorage.setItem(topicAttemptHistoryKey, JSON.stringify(historyByTopic));
    } catch (error) {
        console.error("Failed to persist topic attempt history", error);
    }
};

export default function ChallengePage() {
    const [headerName, setHeaderName] = useState("Adventurer");
    const [headerSecondaryText, setHeaderSecondaryText] = useState("Ready for challenge");
    const [headerAvatar, setHeaderAvatar] = useState(defaultAvatar);
    const [companionAvatar, setCompanionAvatar] = useState(defaultAvatar);
    const [headerLevelLabel, setHeaderLevelLabel] = useState("Level 1 • Explorer");

    const [selectedTopicKey, setSelectedTopicKey] = useState("verbs");
    const [topicAttempts, setTopicAttempts] = useState([]);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [hasAnswered, setHasAnswered] = useState(false);
    const [answerIsCorrect, setAnswerIsCorrect] = useState(null);
    const [draggedWord, setDraggedWord] = useState("");
    const [dropTargetActive, setDropTargetActive] = useState(false);

    const aspectIds = useMemo(
        () => topicAspectsByTopicKey[selectedTopicKey] ?? topicAspectsByTopicKey.verbs,
        [selectedTopicKey]
    );

    const topicQuestionBank = useMemo(
        () => createTopicQuestionBank(selectedTopicKey, aspectIds),
        [selectedTopicKey, aspectIds]
    );

    const { questionCount, selectedQuestionIds, recentQuestionIds } = useMemo(
        () =>
            selectChallengeQuestions({
                questions: topicQuestionBank,
                aspectCount: aspectIds.length,
                topicAttempts,
                cooldownAttemptCount: RECENT_TOPIC_ATTEMPT_COOLDOWN,
            }),
        [topicQuestionBank, aspectIds.length, topicAttempts]
    );

    useEffect(() => {
        const profileRaw = localStorage.getItem(profileStorageKey);
        if (profileRaw) {
            try {
                const profile = JSON.parse(profileRaw);

                if (typeof profile?.name === "string" && profile.name.trim()) {
                    setHeaderName(profile.name.trim());
                }

                if (typeof profile?.heroName === "string" && profile.heroName.trim()) {
                    setHeaderSecondaryText(profile.heroName.trim());
                }

                if (typeof profile?.heroImage === "string" && profile.heroImage.trim()) {
                    setHeaderAvatar(profile.heroImage.trim());
                }

                if (typeof profile?.petImage === "string" && profile.petImage.trim()) {
                    setCompanionAvatar(profile.petImage.trim());
                }
            } catch (error) {
                console.error("Failed to parse player profile", error);
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
        }

        const restoredTopic = localStorage.getItem(selectedTopicStorageKey);
        const safeTopic = restoredTopic && topicAspectsByTopicKey[restoredTopic] ? restoredTopic : "verbs";
        const historyByTopic = readTopicAttemptHistory();
        const restoredTopicAttempts = Array.isArray(historyByTopic[safeTopic]) ? historyByTopic[safeTopic] : [];

        setSelectedTopicKey(safeTopic);
        setTopicAttempts(restoredTopicAttempts);
    }, []);

    useEffect(() => {
        if (selectedQuestionIds.length === 0) {
            return;
        }

        const historyByTopic = readTopicAttemptHistory();
        const previousTopicAttempts = Array.isArray(historyByTopic[selectedTopicKey])
            ? historyByTopic[selectedTopicKey]
            : [];

        const nextAttempt = {
            questionIds: selectedQuestionIds,
            createdAt: new Date().toISOString(),
        };

        const nextTopicAttempts = [...previousTopicAttempts, nextAttempt].slice(-10);
        const nextHistoryByTopic = {
            ...historyByTopic,
            [selectedTopicKey]: nextTopicAttempts,
        };

        saveTopicAttemptHistory(nextHistoryByTopic);
    }, [selectedTopicKey, selectedQuestionIds]);

    const progressDisplayTotal = 10;

    const currentQuestionIndex = useMemo(
        () => Math.max(1, Math.min(progressDisplayTotal, currentQuestionNumber)),
        [currentQuestionNumber]
    );

    const challengeProgressPercent = useMemo(() => {
        if (progressDisplayTotal <= 0) {
            return 0;
        }

        return Math.max(0, Math.min(100, Math.round((currentQuestionIndex / progressDisplayTotal) * 100)));
    }, [currentQuestionIndex]);

    const petMessage = useMemo(() => {
        if (!hasAnswered) {
            return "You’ve got this explorer! Choose the best word to complete the sentence.";
        }

        if (answerIsCorrect) {
            return "Pawesome! You nailed it!";
        }

        return "Good try! Let’s learn from this and win the next one.";
    }, [hasAnswered, answerIsCorrect]);

    const heroMessage = useMemo(() => {
        if (!hasAnswered) {
            return "Hint: We are talking about one animal, so use a singular noun.";
        }

        if (answerIsCorrect) {
            return "Great job! ‘cat’ is singular, so it matches ‘is sleeping’.";
        }

        return "‘cats’ is plural. We need singular ‘cat’ to fit ‘is sleeping’.";
    }, [hasAnswered, answerIsCorrect]);

    const resultBadge = useMemo(() => {
        if (!hasAnswered) {
            return {
                text: "Ready",
                className: "bg-slate-500",
            };
        }

        if (answerIsCorrect) {
            return {
                text: "Correct!",
                className: "bg-emerald-500",
            };
        }

        return {
            text: "Try Again",
            className: "bg-amber-500",
        };
    }, [hasAnswered, answerIsCorrect]);

    const handleSelectAnswer = (answerValue) => {
        if (hasAnswered) {
            return;
        }

        const isCorrectChoice = answerValue === "cat";
        setSelectedAnswer(answerValue);
        setAnswerIsCorrect(isCorrectChoice);
        setHasAnswered(true);
    };

    const handleDragStart = (event, answerValue) => {
        if (hasAnswered) {
            return;
        }

        setDraggedWord(answerValue);
        event.dataTransfer.setData("text/plain", answerValue);
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setDraggedWord("");
        setDropTargetActive(false);
    };

    const handleBlankDragOver = (event) => {
        if (hasAnswered) {
            return;
        }

        event.preventDefault();
        setDropTargetActive(true);
    };

    const handleBlankDragLeave = () => {
        setDropTargetActive(false);
    };

    const handleBlankDrop = (event) => {
        if (hasAnswered) {
            return;
        }

        event.preventDefault();
        const droppedWord = event.dataTransfer.getData("text/plain") || draggedWord;
        if (droppedWord) {
            handleSelectAnswer(droppedWord);
        }

        setDraggedWord("");
        setDropTargetActive(false);
    };

    const handleNextQuestion = () => {
        if (!hasAnswered || currentQuestionIndex >= progressDisplayTotal) {
            return;
        }

        setCurrentQuestionNumber((previousQuestion) => Math.min(progressDisplayTotal, previousQuestion + 1));
        setSelectedAnswer("");
        setHasAnswered(false);
        setAnswerIsCorrect(null);
        setDraggedWord("");
        setDropTargetActive(false);
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

            <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:py-8">
                <section className="rounded-[24px] border border-primary/15 bg-white/95 px-5 py-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.14em] text-slate-600">
                            <span className="material-symbols-outlined text-primary text-base">tactic</span>
                            Challenge Progress
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-black text-primary">
                            {currentQuestionIndex}/{progressDisplayTotal}
                        </span>
                    </div>

                    <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-primary shadow-sm shadow-primary/30 transition-all"
                            style={{ width: `${challengeProgressPercent}%` }}
                        />
                    </div>

                    <p
                        className="mt-2 text-[11px] font-semibold text-slate-400"
                        data-question-count={questionCount}
                        data-selected-question-ids={selectedQuestionIds.join(",")}
                        data-recent-question-ids={Array.from(recentQuestionIds).join(",")}
                    >
                        Cooldown window: last {RECENT_TOPIC_ATTEMPT_COOLDOWN} attempt(s)
                    </p>
                </section>

                <section className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-[88px] overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                            <img className="h-full w-full object-cover" src={companionAvatar} alt="Companion avatar" />
                        </div>
                        <div className="relative max-w-[230px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                            {petMessage}
                            <span
                                aria-hidden="true"
                                className="absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 border-l border-b border-slate-200 bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:justify-end">
                        <div className="relative max-w-[250px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                            {heroMessage}
                            <span
                                aria-hidden="true"
                                className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 border-t border-r border-slate-200 bg-white"
                            />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className={`rounded-2xl px-4 py-2 text-lg font-black text-white shadow-sm ${resultBadge.className}`}>
                                {resultBadge.text}
                            </div>
                            <div className="size-[88px] overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                                <img className="h-full w-full object-cover" src={headerAvatar} alt="Hero avatar" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto mt-10 w-full max-w-3xl rounded-[34px] border-2 border-primary/25 bg-white px-8 py-10 text-center shadow-sm">
                    <div className="flex items-start justify-between">
                        <p className="w-full pl-6 text-sm font-black uppercase tracking-[0.3em] text-slate-400" />
                        <span className="material-symbols-outlined text-xl text-primary/60">volume_up</span>
                    </div>
                    <p className="mt-4 text-4xl font-black leading-tight text-slate-900">
                        The{" "}
                        <span
                            onDragOver={handleBlankDragOver}
                            onDragLeave={handleBlankDragLeave}
                            onDrop={handleBlankDrop}
                            className={`inline-flex min-w-[180px] items-center justify-center rounded-2xl border-2 px-6 py-1 transition ${selectedAnswer
                                ? answerIsCorrect
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                    : "border-amber-300 bg-amber-50 text-amber-700"
                                : dropTargetActive
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-primary/30 bg-primary/5 text-primary"
                                }`}
                        >
                            {selectedAnswer || "_______"}
                        </span>{" "}
                        is sleeping.
                    </p>
                </section>

                <section className="mt-9 flex items-center justify-center gap-4">
                    <button
                        type="button"
                        draggable={!hasAnswered}
                        onDragStart={(event) => handleDragStart(event, "cat")}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleSelectAnswer("cat")}
                        aria-pressed={selectedAnswer === "cat" ? "true" : "false"}
                        className={`min-w-[88px] rounded-2xl border px-6 py-3 text-3xl font-black shadow-sm transition ${selectedAnswer === "cat"
                            ? answerIsCorrect
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-amber-300 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-white text-slate-700"
                            }`}
                    >
                        cat
                    </button>
                    <button
                        type="button"
                        draggable={!hasAnswered}
                        onDragStart={(event) => handleDragStart(event, "cats")}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleSelectAnswer("cats")}
                        aria-pressed={selectedAnswer === "cats" ? "true" : "false"}
                        className={`min-w-[88px] rounded-2xl border px-6 py-3 text-3xl font-black shadow-sm transition ${selectedAnswer === "cats"
                            ? answerIsCorrect
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-amber-300 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-white text-slate-700"
                            }`}
                    >
                        cats
                    </button>
                </section>

                <section className="mt-auto flex items-center justify-between border-t border-slate-200/80 px-2 py-5">
                    <Link href="/world-map" className="text-lg font-bold text-slate-500 hover:text-slate-700">
                        Skip Challenge
                    </Link>
                    <button
                        type="button"
                        onClick={handleNextQuestion}
                        disabled={!hasAnswered || currentQuestionIndex >= progressDisplayTotal}
                        className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-lg font-black text-white shadow-lg transition ${!hasAnswered || currentQuestionIndex >= progressDisplayTotal
                            ? "cursor-not-allowed bg-slate-400 shadow-slate-300"
                            : "bg-primary shadow-primary/25"
                            }`}
                    >
                        Next Question
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                </section>
            </main>
        </div>
    );
}
