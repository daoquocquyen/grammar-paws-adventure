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
    const [headerLevelLabel, setHeaderLevelLabel] = useState("Level 1 • Explorer");

    const [selectedTopicKey, setSelectedTopicKey] = useState("verbs");
    const [topicAttempts, setTopicAttempts] = useState([]);

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

            <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 md:py-8">
                <section className="w-full rounded-[28px] border border-primary/15 bg-white px-6 py-7 shadow-sm md:px-8">
                    <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white px-5 py-2 shadow-sm">
                        <span className="material-symbols-outlined text-primary text-[18px]">tactic</span>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Challenge</h2>
                    </div>

                    <p className="mt-3 text-center text-base font-semibold text-slate-700">
                        Your grammar challenge session is ready.
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <article className="rounded-2xl border border-primary/15 bg-slate-50 px-4 py-4 text-center">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Topic</p>
                            <p className="mt-1 text-lg font-black text-slate-900">{selectedTopicKey}</p>
                        </article>
                        <article className="rounded-2xl border border-primary/15 bg-slate-50 px-4 py-4 text-center">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Question Count</p>
                            <p className="mt-1 text-lg font-black text-slate-900">{questionCount}</p>
                        </article>
                        <article className="rounded-2xl border border-primary/15 bg-slate-50 px-4 py-4 text-center">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Cooldown</p>
                            <p className="mt-1 text-lg font-black text-slate-900">{RECENT_TOPIC_ATTEMPT_COOLDOWN} attempt(s)</p>
                        </article>
                    </div>

                    <p
                        className="mt-4 text-center text-xs font-semibold text-slate-500"
                        data-question-count={questionCount}
                        data-selected-question-ids={selectedQuestionIds.join(",")}
                        data-recent-question-ids={Array.from(recentQuestionIds).join(",")}
                    >
                        Cooldown window: last {RECENT_TOPIC_ATTEMPT_COOLDOWN} attempt(s)
                    </p>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {selectedQuestionIds.slice(0, 6).map((questionId, index) => (
                        <article key={questionId} className="rounded-[24px] border border-primary/15 bg-white px-5 py-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-black text-slate-900">Question {index + 1}</p>
                                <span className="material-symbols-outlined text-primary">quiz</span>
                            </div>
                            <p className="mt-2 text-xs font-semibold text-slate-500 break-all">{questionId}</p>
                        </article>
                    ))}

                    {selectedQuestionIds.length === 0 && (
                        <article className="rounded-[24px] border border-primary/15 bg-white px-5 py-6 text-center shadow-sm md:col-span-3">
                            <p className="text-base font-bold text-slate-600">Preparing your challenge questions...</p>
                        </article>
                    )}
                </section>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/topic-intro"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-8 py-3 text-base font-black text-primary"
                    >
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Back to Topic Intro
                    </Link>
                    <Link
                        href="/world-map"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-black text-white shadow-lg shadow-primary/25"
                    >
                        <span className="material-symbols-outlined text-base">map</span>
                        Back to Map
                    </Link>
                </div>
            </main>
        </div>
    );
}
