"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CharacterSpeechBubble from "../../src/components/CharacterSpeechBubble";
import HeaderBlock from "../../src/components/HeaderBlock";
import { DEFAULT_COMPANION_AVATAR } from "../../src/lib/avatarDefaults";
import {
    DEFAULT_HERO_THEME_COLOR,
    DEFAULT_PET_THEME_COLOR,
    getHeroThemeColor,
    getPetThemeColor,
} from "../../src/lib/avatarBubbleThemes";
import {
    createTopicQuestionBank,
    getQuestionStemKey,
    RECENT_TOPIC_ATTEMPT_COOLDOWN,
    selectChallengeQuestions,
} from "../../src/lib/challengeQuestionSelection";
import {
    CHALLENGE_PHASES,
    EXPLANATION_DELAY_MS,
    getHeroFeedbackText,
    getIndicatorForOutcome,
    getOutcomeClassFromPhase,
    getPetFeedbackText,
    getPrimaryActionState,
    OUTCOME_CLASSES,
    resolvePhaseFromAttempt,
} from "../../src/lib/challengeStateModel";
import { calculateChallengeTotals } from "../../src/lib/challengeScoring";
import {
    PLAYER_PROGRESS_STORAGE_KEY,
    PROFILE_STORAGE_KEY,
    TOPIC_ATTEMPT_HISTORY_STORAGE_KEY,
    getPlayerIdFromProfile,
    getPlayerScopedStorageKey,
    hasExplicitPlayerId,
} from "../../src/lib/playerStorage";
import { getPlayerLevelInfo } from "../../src/lib/playerLevel";
import { DEFAULT_TOPIC_KEY, getTopicAspectIds, hasTopic } from "../../src/lib/topicCatalog";
import { extractTopicProgressMetrics } from "../../src/lib/topicProgress";

const selectedTopicStorageKey = "gpa_selected_topic_v1";
const voiceSettingsKey = "gpa_voice_settings_v1";

const defaultAvatar = DEFAULT_COMPANION_AVATAR;
const toSafeLower = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");
const toSafeString = (value) => (typeof value === "string" ? value.trim() : "");
const canUseSpeechSynthesis = () => (
    typeof window !== "undefined"
    && "speechSynthesis" in window
    && typeof window.SpeechSynthesisUtterance === "function"
);
const buildChallengeQuestionNarration = (questionPrefix, questionSuffix) => {
    const safePrefix = toSafeString(questionPrefix) || "The";
    const safeSuffix = toSafeString(questionSuffix) || "is sleeping.";
    return `${safePrefix} blank ${safeSuffix}`.replace(/\s+/g, " ").trim();
};
const speakMessagesSequentially = (messages) => {
    if (!canUseSpeechSynthesis()) {
        return;
    }

    const safeMessages = (Array.isArray(messages) ? messages : [])
        .map((message) => toSafeString(message))
        .filter(Boolean);
    if (safeMessages.length === 0) {
        return;
    }

    const speakAtIndex = (index) => {
        if (index >= safeMessages.length) {
            return;
        }

        const utterance = new window.SpeechSynthesisUtterance(safeMessages[index]);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        if (index < safeMessages.length - 1) {
            utterance.onend = () => speakAtIndex(index + 1);
            utterance.onerror = () => speakAtIndex(index + 1);
        }
        window.speechSynthesis.speak(utterance);
    };

    speakAtIndex(0);
};
const getSeededRandom = (seedInput) => {
    const seedText = toSafeString(seedInput) || "seed";
    let state = 0;

    for (let index = 0; index < seedText.length; index += 1) {
        state = (state * 31 + seedText.charCodeAt(index)) >>> 0;
    }

    if (state === 0) {
        state = 123456789;
    }

    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 4294967296;
    };
};
const getIndicatorXpLabel = (indicatorType) => {
    if (indicatorType === "STAR") {
        return "+10";
    }
    if (indicatorType === "HOLLOW_STAR") {
        return "+8";
    }
    if (indicatorType === "CHECK") {
        return "+3";
    }
    return "";
};
const getIndicatorXpTextClass = (indicatorType) => {
    if (indicatorType === "STAR") {
        return "text-emerald-700";
    }
    if (indicatorType === "HOLLOW_STAR") {
        return "text-sky-700";
    }
    if (indicatorType === "CHECK") {
        return "text-yellow-600";
    }
    return "text-slate-300";
};
const getResolvedIndicatorIcon = (indicatorType) => {
    if (indicatorType === "EMPTY") {
        return "close";
    }
    return "check";
};
const PERFORMANCE_TONE_STYLES = Object.freeze({
    excellent: {
        cardClass: "border-emerald-200 bg-emerald-50/70",
        valueClass: "text-emerald-700",
        labelClass: "text-emerald-700",
    },
    good: {
        cardClass: "border-sky-200 bg-sky-50/70",
        valueClass: "text-sky-700",
        labelClass: "text-sky-700",
    },
    fair: {
        cardClass: "border-amber-200 bg-amber-50/80",
        valueClass: "text-amber-700",
        labelClass: "text-amber-700",
    },
    needs_practice: {
        cardClass: "border-rose-200 bg-rose-50/80",
        valueClass: "text-rose-700",
        labelClass: "text-rose-700",
    },
});
const getPercentageToneKey = (percentValue) => {
    const safePercentValue = Number.isFinite(percentValue) ? Math.max(0, Math.min(100, Math.round(percentValue))) : 0;

    if (safePercentValue >= 90) {
        return "excellent";
    }
    if (safePercentValue >= 75) {
        return "good";
    }
    if (safePercentValue >= 50) {
        return "fair";
    }
    return "needs_practice";
};
const getCorrectedMistakesToneKey = (correctedMistakeCount, totalQuestions) => {
    const safeCorrectedMistakeCount = Number.isFinite(correctedMistakeCount)
        ? Math.max(0, Math.round(correctedMistakeCount))
        : 0;
    const safeTotalQuestions = Number.isFinite(totalQuestions)
        ? Math.max(0, Math.round(totalQuestions))
        : 0;

    if (safeTotalQuestions <= 0 || safeCorrectedMistakeCount <= 0) {
        return "excellent";
    }

    const correctionRatio = safeCorrectedMistakeCount / safeTotalQuestions;
    if (correctionRatio <= 0.15) {
        return "good";
    }
    if (correctionRatio <= 0.35) {
        return "fair";
    }
    return "needs_practice";
};

const defaultProgressState = {
    version: 1,
    completedTopics: [],
    topicProgress: {},
};

const readTopicAttemptHistory = (storageKey, legacyFallbackKey = "") => {
    try {
        const rawHistory = localStorage.getItem(storageKey) ?? (
            legacyFallbackKey ? localStorage.getItem(legacyFallbackKey) : null
        );
        if (!rawHistory) {
            return {};
        }

        const parsedHistory = JSON.parse(rawHistory);
        return parsedHistory && typeof parsedHistory === "object" ? parsedHistory : {};
    } catch {
        return {};
    }
};

const saveTopicAttemptHistory = (historyByTopic, storageKey, legacyMirrorKey = "") => {
    try {
        const serializedHistory = JSON.stringify(historyByTopic);
        localStorage.setItem(storageKey, serializedHistory);
        if (legacyMirrorKey && legacyMirrorKey !== storageKey) {
            localStorage.setItem(legacyMirrorKey, serializedHistory);
        }
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
    const [heroBubbleBorderColor, setHeroBubbleBorderColor] = useState(DEFAULT_HERO_THEME_COLOR);
    const [petBubbleBorderColor, setPetBubbleBorderColor] = useState(DEFAULT_PET_THEME_COLOR);
    const [activeProgressStorageKey, setActiveProgressStorageKey] = useState(PLAYER_PROGRESS_STORAGE_KEY);
    const [activeTopicAttemptHistoryKey, setActiveTopicAttemptHistoryKey] = useState(TOPIC_ATTEMPT_HISTORY_STORAGE_KEY);
    const [allowLegacyStorageFallback, setAllowLegacyStorageFallback] = useState(true);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const [voiceMuted, setVoiceMuted] = useState(false);

    const [selectedTopicKey, setSelectedTopicKey] = useState(DEFAULT_TOPIC_KEY);
    const [topicAttempts, setTopicAttempts] = useState([]);
    const [isTopicHydrated, setIsTopicHydrated] = useState(false);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);

    const [phase, setPhase] = useState(CHALLENGE_PHASES.READY);
    const [attemptCount, setAttemptCount] = useState(0);
    const [isRetrySelectionActive, setIsRetrySelectionActive] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [answerIsCorrect, setAnswerIsCorrect] = useState(null);
    const [disabledRetryOption, setDisabledRetryOption] = useState("");
    const [recentWrongOption, setRecentWrongOption] = useState("");
    const [isExplanationVisible, setIsExplanationVisible] = useState(true);
    const [questionXpMessage, setQuestionXpMessage] = useState("");
    const [showSummary, setShowSummary] = useState(false);
    const [summaryPersisted, setSummaryPersisted] = useState(false);
    const [questionOutcomes, setQuestionOutcomes] = useState({});
    const [draggedAnswer, setDraggedAnswer] = useState("");
    const [dropTargetActive, setDropTargetActive] = useState(false);
    const [bouncedBackOption, setBouncedBackOption] = useState("");
    const [forcedRightmostOption, setForcedRightmostOption] = useState("");
    const [hiddenAnswerPanelOption, setHiddenAnswerPanelOption] = useState("");
    const [blankWrongFeedback, setBlankWrongFeedback] = useState(false);
    const [transitioningBounceOption, setTransitioningBounceOption] = useState("");
    const [draggingOption, setDraggingOption] = useState("");
    const [dragPreview, setDragPreview] = useState({
        active: false,
        x: 0,
        y: 0,
        value: "",
        width: 0,
        height: 0,
        fontSize: "",
        borderRadius: "",
        transitioning: false,
    });

    const explanationTimerRef = useRef(null);
    const bounceBackTimerRef = useRef(null);
    const blankWrongFeedbackTimerRef = useRef(null);
    const dragPreviewHideTimerRef = useRef(null);
    const blankDropZoneRef = useRef(null);
    const answerOptionsContainerRef = useRef(null);
    const dragGestureRef = useRef({
        isPointerDown: false,
        isDragging: false,
        startX: 0,
        startY: 0,
        value: "",
        previewWidth: 0,
        previewHeight: 0,
        previewFontSize: "",
        previewBorderRadius: "",
    });
    const dragListenersRef = useRef({
        move: null,
        up: null,
        cancel: null,
        mouseMove: null,
        mouseUp: null,
    });
    const suppressClickRef = useRef(false);
    const lastNarratedQuestionKeyRef = useRef("");
    const lastNarratedHeroMessageRef = useRef("");
    const lastNarratedSummaryMessageRef = useRef("");

    const aspectIds = useMemo(() => getTopicAspectIds(selectedTopicKey), [selectedTopicKey]);

    const topicQuestionBank = useMemo(
        () => createTopicQuestionBank(selectedTopicKey, aspectIds),
        [selectedTopicKey, aspectIds]
    );
    const questionSelectionSeed = useMemo(() => {
        const attemptKeys = Array.isArray(topicAttempts)
            ? topicAttempts.map((attempt) => {
                const createdAt = toSafeString(attempt?.createdAt);
                const questionIds = Array.isArray(attempt?.questionIds) ? attempt.questionIds.join("|") : "";
                return `${createdAt}:${questionIds}`;
            })
            : [];

        return [selectedTopicKey, aspectIds.join("|"), attemptKeys.join("::")].join("||");
    }, [aspectIds, selectedTopicKey, topicAttempts]);

    const { questionCount, selectedQuestions, selectedQuestionIds, recentQuestionIds } = useMemo(
        () =>
            selectChallengeQuestions({
                questions: topicQuestionBank,
                aspectCount: aspectIds.length,
                topicAttempts,
                cooldownAttemptCount: RECENT_TOPIC_ATTEMPT_COOLDOWN,
                randomFn: getSeededRandom(questionSelectionSeed),
            }),
        [topicQuestionBank, aspectIds.length, topicAttempts, questionSelectionSeed]
    );
    const selectedQuestionStemCount = selectedQuestions.length;
    const uniqueSelectedQuestionStemCount = useMemo(
        () => new Set(selectedQuestions.map((question) => getQuestionStemKey(question)).filter(Boolean)).size,
        [selectedQuestions]
    );

    const stopNarration = useCallback(() => {
        if (!canUseSpeechSynthesis()) {
            return;
        }

        window.speechSynthesis.cancel();
    }, []);

    useEffect(() => {
        const canSpeak = canUseSpeechSynthesis();
        setVoiceSupported(canSpeak);

        if (!canSpeak) {
            return;
        }

        const voiceRaw = localStorage.getItem(voiceSettingsKey);
        if (!voiceRaw) {
            setVoiceMuted(false);
            return;
        }

        try {
            const parsedVoiceSettings = JSON.parse(voiceRaw);
            setVoiceMuted(Boolean(parsedVoiceSettings?.muted));
        } catch {
            setVoiceMuted(false);
        }
    }, []);

    useEffect(() => {
        let resolvedPlayerId = "";
        let nextAllowLegacyStorageFallback = true;
        const profileRaw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (profileRaw) {
            try {
                const profile = JSON.parse(profileRaw);
                resolvedPlayerId = getPlayerIdFromProfile(profile);
                nextAllowLegacyStorageFallback = !hasExplicitPlayerId(profile);

                if (typeof profile?.name === "string" && profile.name.trim()) {
                    setHeaderName(profile.name.trim());
                }

                if (typeof profile?.heroName === "string" && profile.heroName.trim()) {
                    setHeaderSecondaryText(profile.heroName.trim());
                }

                setHeroBubbleBorderColor(getHeroThemeColor(profile?.heroId, profile?.heroName));
                setPetBubbleBorderColor(getPetThemeColor(profile?.petName));

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

        const scopedProgressStorageKey = getPlayerScopedStorageKey(PLAYER_PROGRESS_STORAGE_KEY, resolvedPlayerId);
        const scopedTopicAttemptHistoryKey = getPlayerScopedStorageKey(TOPIC_ATTEMPT_HISTORY_STORAGE_KEY, resolvedPlayerId);
        setActiveProgressStorageKey(scopedProgressStorageKey);
        setActiveTopicAttemptHistoryKey(scopedTopicAttemptHistoryKey);
        setAllowLegacyStorageFallback(nextAllowLegacyStorageFallback);

        const progressRaw = localStorage.getItem(scopedProgressStorageKey) ?? (
            nextAllowLegacyStorageFallback ? localStorage.getItem(PLAYER_PROGRESS_STORAGE_KEY) : null
        );
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
        const safeTopic = restoredTopic && hasTopic(restoredTopic) ? restoredTopic : DEFAULT_TOPIC_KEY;
        const historyByTopic = readTopicAttemptHistory(
            scopedTopicAttemptHistoryKey,
            nextAllowLegacyStorageFallback ? TOPIC_ATTEMPT_HISTORY_STORAGE_KEY : ""
        );
        const restoredTopicAttempts = Array.isArray(historyByTopic[safeTopic]) ? historyByTopic[safeTopic] : [];

        setSelectedTopicKey(safeTopic);
        setTopicAttempts(restoredTopicAttempts);
        setIsTopicHydrated(true);
    }, []);

    useEffect(() => {
        if (!isTopicHydrated || selectedQuestionIds.length === 0) {
            return;
        }

        const historyByTopic = readTopicAttemptHistory(
            activeTopicAttemptHistoryKey,
            allowLegacyStorageFallback ? TOPIC_ATTEMPT_HISTORY_STORAGE_KEY : ""
        );
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

        saveTopicAttemptHistory(
            nextHistoryByTopic,
            activeTopicAttemptHistoryKey,
            TOPIC_ATTEMPT_HISTORY_STORAGE_KEY
        );
    }, [activeTopicAttemptHistoryKey, allowLegacyStorageFallback, isTopicHydrated, selectedTopicKey, selectedQuestionIds]);

    useEffect(() => {
        return () => {
            stopNarration();
            if (explanationTimerRef.current) {
                clearTimeout(explanationTimerRef.current);
            }
            if (bounceBackTimerRef.current) {
                clearTimeout(bounceBackTimerRef.current);
            }
            if (blankWrongFeedbackTimerRef.current) {
                clearTimeout(blankWrongFeedbackTimerRef.current);
            }
            if (dragPreviewHideTimerRef.current) {
                clearTimeout(dragPreviewHideTimerRef.current);
            }
            if (dragListenersRef.current.move) {
                window.removeEventListener("pointermove", dragListenersRef.current.move);
                dragListenersRef.current.move = null;
            }
            if (dragListenersRef.current.up) {
                window.removeEventListener("pointerup", dragListenersRef.current.up);
                dragListenersRef.current.up = null;
            }
            if (dragListenersRef.current.cancel) {
                window.removeEventListener("pointercancel", dragListenersRef.current.cancel);
                dragListenersRef.current.cancel = null;
            }
            if (dragListenersRef.current.mouseMove) {
                window.removeEventListener("mousemove", dragListenersRef.current.mouseMove);
                dragListenersRef.current.mouseMove = null;
            }
            if (dragListenersRef.current.mouseUp) {
                window.removeEventListener("mouseup", dragListenersRef.current.mouseUp);
                dragListenersRef.current.mouseUp = null;
            }
        };
    }, [stopNarration]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const handlePageExit = () => {
            stopNarration();
        };

        window.addEventListener("pagehide", handlePageExit);
        window.addEventListener("beforeunload", handlePageExit);

        return () => {
            window.removeEventListener("pagehide", handlePageExit);
            window.removeEventListener("beforeunload", handlePageExit);
        };
    }, [stopNarration]);

    const progressDisplayTotal = questionCount;
    const maxQuestionIndex = useMemo(() => Math.max(0, progressDisplayTotal - 1), [progressDisplayTotal]);

    const currentQuestionIndex = useMemo(
        () => Math.max(0, Math.min(maxQuestionIndex, currentQuestionNumber)),
        [currentQuestionNumber, maxQuestionIndex]
    );

    const currentQuestion = useMemo(
        () => selectedQuestions[currentQuestionIndex] ?? null,
        [selectedQuestions, currentQuestionIndex]
    );

    const answerOptions = useMemo(() => {
        if (Array.isArray(currentQuestion?.options) && currentQuestion.options.length > 0) {
            return currentQuestion.options.slice(0, 4);
        }
        return ["cat", "cats", "dog", "dogs"];
    }, [currentQuestion]);

    const displayedAnswerOptions = useMemo(() => {
        const safeHiddenOption = toSafeString(hiddenAnswerPanelOption);
        const visibleOptions = safeHiddenOption
            ? answerOptions.filter((optionValue) => optionValue !== safeHiddenOption)
            : answerOptions;
        const safeForcedOption = toSafeString(forcedRightmostOption);
        if (!safeForcedOption || !visibleOptions.includes(safeForcedOption)) {
            return visibleOptions;
        }

        return [...visibleOptions.filter((optionValue) => optionValue !== safeForcedOption), safeForcedOption];
    }, [answerOptions, forcedRightmostOption, hiddenAnswerPanelOption]);

    const correctAnswer = useMemo(
        () =>
            (typeof currentQuestion?.correctAnswer === "string" && currentQuestion.correctAnswer.trim()
                ? currentQuestion.correctAnswer.trim()
                : answerOptions[0]),
        [currentQuestion, answerOptions]
    );

    const currentQuestionPrefix = currentQuestion?.sentencePrefix ?? "The";
    const currentQuestionSuffix = currentQuestion?.sentenceSuffix ?? "is sleeping.";
    const isQuestionContentAvailable = progressDisplayTotal > 0 && currentQuestion !== null;
    const currentQuestionNarrationKey = useMemo(() => {
        if (!isQuestionContentAvailable) {
            return "";
        }

        const questionId = toSafeString(currentQuestion?.id);
        if (questionId) {
            return `id::${questionId}`;
        }

        return [
            currentQuestionIndex,
            toSafeString(currentQuestionPrefix),
            toSafeString(currentQuestionSuffix),
        ].join("::");
    }, [
        currentQuestion,
        currentQuestionIndex,
        currentQuestionPrefix,
        currentQuestionSuffix,
        isQuestionContentAvailable,
    ]);

    const currentOutcome = questionOutcomes[currentQuestionIndex] ?? null;
    const hasResolvedQuestion = Boolean(currentOutcome);

    const indicatorStates = useMemo(
        () =>
            Array.from({ length: progressDisplayTotal }, (_, questionIndex) =>
                getIndicatorForOutcome(questionOutcomes[questionIndex])
            ),
        [progressDisplayTotal, questionOutcomes]
    );

    const orderedOutcomes = useMemo(
        () =>
            Array.from({ length: progressDisplayTotal }, (_, index) => questionOutcomes[index] ?? OUTCOME_CLASSES.SKIPPED),
        [progressDisplayTotal, questionOutcomes]
    );

    const challengeTotals = useMemo(() => calculateChallengeTotals(orderedOutcomes), [orderedOutcomes]);
    const completedQuestionCount = useMemo(() => {
        if (showSummary) {
            return progressDisplayTotal;
        }

        return Array.from({ length: progressDisplayTotal }, (_, index) => questionOutcomes[index])
            .filter(Boolean)
            .length;
    }, [showSummary, progressDisplayTotal, questionOutcomes]);
    const questionProgressPercent = useMemo(
        () => (progressDisplayTotal > 0
            ? Math.max(0, Math.min(100, (completedQuestionCount / progressDisplayTotal) * 100))
            : 0),
        [completedQuestionCount, progressDisplayTotal]
    );
    const progressCounterText = `${progressDisplayTotal > 0 ? currentQuestionIndex + 1 : 0}/${progressDisplayTotal}`;
    const xpPassProgressText = `XP ${challengeTotals.summary.baseXp}/${challengeTotals.summary.maxBaseXp} (${challengeTotals.summary.requiredBaseXpToPass} to pass)`;
    const indicatorColumnCount = progressDisplayTotal + 1;
    const indicatorRailMinWidth = Math.max(560, indicatorColumnCount * 74);
    const isFinishMarkerActive = progressDisplayTotal > 0 && completedQuestionCount >= progressDisplayTotal;
    const xpPassBadgeClass = challengeTotals.summary.passed
        ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-[0_2px_8px_rgba(16,185,129,0.25)]"
        : "border-primary/40 bg-primary/10 text-primary shadow-[0_2px_10px_rgba(37,157,244,0.28)]";
    const summaryPercentage = Math.round(challengeTotals.summary.xpPassRate * 100);
    const summaryXpGateText = `${challengeTotals.summary.baseXp}/${challengeTotals.summary.requiredBaseXpToPass}`;
    const summaryUnlockStateText = challengeTotals.summary.passed ? "Unlocked" : "Locked";
    const summaryAccuracyPercent = Math.round(challengeTotals.summary.accuracyRate * 100);
    const summaryFirstTryAccuracyPercent = Math.round(challengeTotals.summary.firstTryAccuracy * 100);
    const summaryAccuracyToneKey = getPercentageToneKey(summaryAccuracyPercent);
    const summaryFirstTryAccuracyToneKey = getPercentageToneKey(summaryFirstTryAccuracyPercent);
    const summaryCorrectedMistakesToneKey = getCorrectedMistakesToneKey(
        challengeTotals.summary.correctedMistakeCount,
        challengeTotals.summary.totalQuestions
    );
    const summaryAccuracyToneStyles = PERFORMANCE_TONE_STYLES[summaryAccuracyToneKey];
    const summaryFirstTryAccuracyToneStyles = PERFORMANCE_TONE_STYLES[summaryFirstTryAccuracyToneKey];
    const summaryCorrectedMistakesToneStyles = PERFORMANCE_TONE_STYLES[summaryCorrectedMistakesToneKey];
    const summaryPetResultMessage = challengeTotals.summary.passed
        ? "Congratulations! You unlocked the next topic. Let's keep exploring."
        : "Cheerful effort! Earn a little more XP to unlock the next topic.";
    const summaryPassFailMessage = challengeTotals.summary.passed
        ? "Pass achieved! Great effort and focus."
        : "Keep practicing. You are getting stronger each round.";

    const primaryAction = useMemo(
        () =>
            getPrimaryActionState({
                phase,
                isExplanationVisible,
                hasResolvedQuestion,
            }),
        [phase, isExplanationVisible, hasResolvedQuestion]
    );

    const heroMessage = useMemo(
        () =>
            getHeroFeedbackText({
                phase,
                question: currentQuestion,
                selectedAnswer,
                correctAnswer,
                isRetrySelectionActive,
                isExplanationVisible,
            }),
        [phase, currentQuestion, selectedAnswer, correctAnswer, isRetrySelectionActive, isExplanationVisible]
    );

    const petMessage = useMemo(
        () => getPetFeedbackText({ phase, hasResolvedQuestion, outcomeClass: currentOutcome, attemptCount }),
        [phase, hasResolvedQuestion, currentOutcome, attemptCount]
    );

    useEffect(() => {
        if (!voiceSupported || voiceMuted || showSummary || !isQuestionContentAvailable) {
            return;
        }

        const safeHeroMessage = toSafeString(heroMessage);
        const questionNarration = buildChallengeQuestionNarration(currentQuestionPrefix, currentQuestionSuffix);
        const hasQuestionChanged = Boolean(currentQuestionNarrationKey)
            && currentQuestionNarrationKey !== lastNarratedQuestionKeyRef.current;

        if (hasQuestionChanged) {
            const narrationMessages = [];
            if (safeHeroMessage) {
                narrationMessages.push(safeHeroMessage);
            }
            if (questionNarration) {
                narrationMessages.push(questionNarration);
            }

            if (narrationMessages.length === 0) {
                return;
            }

            stopNarration();
            lastNarratedQuestionKeyRef.current = currentQuestionNarrationKey;
            lastNarratedHeroMessageRef.current = safeHeroMessage;
            speakMessagesSequentially(narrationMessages);
            return;
        }

        if (!safeHeroMessage || safeHeroMessage === lastNarratedHeroMessageRef.current) {
            return;
        }

        stopNarration();
        lastNarratedHeroMessageRef.current = safeHeroMessage;
        speakMessagesSequentially([safeHeroMessage]);
    }, [
        currentQuestionNarrationKey,
        currentQuestionPrefix,
        currentQuestionSuffix,
        heroMessage,
        isQuestionContentAvailable,
        showSummary,
        stopNarration,
        voiceMuted,
        voiceSupported,
    ]);

    useEffect(() => {
        if (!showSummary) {
            lastNarratedSummaryMessageRef.current = "";
            return;
        }

        if (!voiceSupported || voiceMuted) {
            return;
        }

        const safeSummaryMessage = toSafeString(summaryPetResultMessage);
        if (!safeSummaryMessage || safeSummaryMessage === lastNarratedSummaryMessageRef.current) {
            return;
        }

        stopNarration();
        lastNarratedSummaryMessageRef.current = safeSummaryMessage;
        speakMessagesSequentially([safeSummaryMessage]);
    }, [showSummary, summaryPetResultMessage, stopNarration, voiceMuted, voiceSupported]);

    const clearExplanationTimer = () => {
        if (explanationTimerRef.current) {
            clearTimeout(explanationTimerRef.current);
            explanationTimerRef.current = null;
        }
    };

    const resetQuestionTransientState = () => {
        clearExplanationTimer();
        setPhase(CHALLENGE_PHASES.READY);
        setAttemptCount(0);
        setIsRetrySelectionActive(false);
        setSelectedAnswer("");
        setAnswerIsCorrect(null);
        setDisabledRetryOption("");
        setRecentWrongOption("");
        setIsExplanationVisible(true);
        setQuestionXpMessage("");
        setDraggedAnswer("");
        setDropTargetActive(false);
        setBouncedBackOption("");
        setForcedRightmostOption("");
        setHiddenAnswerPanelOption("");
        setBlankWrongFeedback(false);
        setTransitioningBounceOption("");
        setDraggingOption("");
        setDragPreview({
            active: false,
            x: 0,
            y: 0,
            value: "",
            width: 0,
            height: 0,
            fontSize: "",
            borderRadius: "",
            transitioning: false,
        });

        if (blankWrongFeedbackTimerRef.current) {
            clearTimeout(blankWrongFeedbackTimerRef.current);
            blankWrongFeedbackTimerRef.current = null;
        }
        if (dragPreviewHideTimerRef.current) {
            clearTimeout(dragPreviewHideTimerRef.current);
            dragPreviewHideTimerRef.current = null;
        }
    };

    const setExplanationDelay = ({ nextPhaseAfterDelay = null, revealCorrectAnswer = false }) => {
        setIsExplanationVisible(false);
        clearExplanationTimer();

        explanationTimerRef.current = setTimeout(() => {
            if (revealCorrectAnswer) {
                setSelectedAnswer(correctAnswer);
                setAnswerIsCorrect(true);
            }

            if (nextPhaseAfterDelay) {
                setPhase(nextPhaseAfterDelay);
            }

            setIsExplanationVisible(true);
        }, EXPLANATION_DELAY_MS);
    };

    const recordOutcomeIfMissing = (outcomeClass) => {
        if (!outcomeClass) {
            return;
        }

        setQuestionOutcomes((previousOutcomes) => {
            if (previousOutcomes[currentQuestionIndex]) {
                return previousOutcomes;
            }

            return {
                ...previousOutcomes,
                [currentQuestionIndex]: outcomeClass,
            };
        });

        setQuestionXpMessage("");
    };

    const triggerBounceBack = (answerValue, dragMeta = null) => {
        if (bounceBackTimerRef.current) {
            clearTimeout(bounceBackTimerRef.current);
        }
        if (blankWrongFeedbackTimerRef.current) {
            clearTimeout(blankWrongFeedbackTimerRef.current);
        }
        if (dragPreviewHideTimerRef.current) {
            clearTimeout(dragPreviewHideTimerRef.current);
        }

        setBouncedBackOption(answerValue);
        setForcedRightmostOption(answerValue);
        setBlankWrongFeedback(true);
        setDraggedAnswer("");
        setDropTargetActive(false);
        setDraggingOption("");

        const hasDragMeta =
            dragMeta &&
            Number.isFinite(dragMeta.dropX) &&
            Number.isFinite(dragMeta.dropY);

        if (hasDragMeta) {
            setTransitioningBounceOption(answerValue);
            setDragPreview({
                active: true,
                x: dragMeta.dropX,
                y: dragMeta.dropY,
                value: answerValue,
                width: dragMeta.previewWidth ?? 0,
                height: dragMeta.previewHeight ?? 0,
                fontSize: dragMeta.previewFontSize ?? "",
                borderRadius: dragMeta.previewBorderRadius ?? "",
                transitioning: false,
            });

            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    const containerNode = answerOptionsContainerRef.current;
                    if (!(containerNode instanceof HTMLElement)) {
                        return;
                    }

                    const optionNodes = Array.from(containerNode.querySelectorAll("[data-option-value]"));
                    const targetNode = optionNodes.find(
                        (node) => node instanceof HTMLElement && node.getAttribute("data-option-value") === answerValue
                    );
                    if (!(targetNode instanceof HTMLElement)) {
                        return;
                    }

                    const targetRect = targetNode.getBoundingClientRect();
                    const targetStyle = window.getComputedStyle(targetNode);
                    setDragPreview((previousPreview) => ({
                        ...previousPreview,
                        active: true,
                        x: targetRect.left + targetRect.width / 2,
                        y: targetRect.top + targetRect.height / 2,
                        width: previousPreview.width || targetRect.width,
                        height: previousPreview.height || targetRect.height,
                        fontSize: previousPreview.fontSize || targetStyle.fontSize,
                        borderRadius: previousPreview.borderRadius || targetStyle.borderRadius,
                        transitioning: true,
                    }));
                });
            });

            dragPreviewHideTimerRef.current = setTimeout(() => {
                setDragPreview({
                    active: false,
                    x: 0,
                    y: 0,
                    value: "",
                    width: 0,
                    height: 0,
                    fontSize: "",
                    borderRadius: "",
                    transitioning: false,
                });
                setTransitioningBounceOption("");
            }, 480);
        } else {
            setTransitioningBounceOption("");
            setDragPreview({
                active: false,
                x: 0,
                y: 0,
                value: "",
                width: 0,
                height: 0,
                fontSize: "",
                borderRadius: "",
                transitioning: false,
            });
        }

        bounceBackTimerRef.current = setTimeout(() => {
            setBouncedBackOption("");
        }, 560);
        blankWrongFeedbackTimerRef.current = setTimeout(() => {
            setBlankWrongFeedback(false);
        }, 380);
    };

    const handleSelectAnswer = (answerValue, source = "click", dragMeta = null) => {
        const canAnswerNow =
            phase === CHALLENGE_PHASES.READY ||
            phase === CHALLENGE_PHASES.WRONG_FIRST ||
            phase === CHALLENGE_PHASES.ASSISTED;
        if (!isQuestionContentAvailable || showSummary || hasResolvedQuestion || !canAnswerNow || !isExplanationVisible) {
            return;
        }

        if (phase !== CHALLENGE_PHASES.ASSISTED && attemptCount >= 2) {
            return;
        }

        if (phase === CHALLENGE_PHASES.ASSISTED) {
            const isCorrectAfterCoaching = toSafeLower(answerValue) === toSafeLower(correctAnswer);

            if (isCorrectAfterCoaching) {
                setSelectedAnswer(answerValue);
                setAnswerIsCorrect(true);
                setRecentWrongOption("");
                setIsRetrySelectionActive(false);
                setDisabledRetryOption("");
                setHiddenAnswerPanelOption(source === "drag" ? answerValue : "");
                const assistedOutcomeClass = getOutcomeClassFromPhase(CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE);
                recordOutcomeIfMissing(assistedOutcomeClass);
                setExplanationDelay({
                    nextPhaseAfterDelay: CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE,
                    revealCorrectAnswer: false,
                });
                return;
            }

            setAnswerIsCorrect(false);
            setSelectedAnswer("");
            setRecentWrongOption(answerValue);
            setIsRetrySelectionActive(false);
            setDisabledRetryOption("");
            setHiddenAnswerPanelOption("");
            setQuestionXpMessage("");
            setAttemptCount(3);
            if (source === "drag") {
                triggerBounceBack(answerValue, dragMeta);
            }
            setQuestionOutcomes((previousOutcomes) => {
                if (previousOutcomes[currentQuestionIndex]) {
                    return previousOutcomes;
                }
                return {
                    ...previousOutcomes,
                    [currentQuestionIndex]: OUTCOME_CLASSES.SKIPPED,
                };
            });
            setPhase(CHALLENGE_PHASES.ASSISTED);
            return;
        }

        if (isRetrySelectionActive && disabledRetryOption && answerValue === disabledRetryOption) {
            return;
        }

        const isCorrectChoice = toSafeLower(answerValue) === toSafeLower(correctAnswer);
        const nextPhase = resolvePhaseFromAttempt({
            attemptCount,
            isCorrect: isCorrectChoice,
        });

        if (isCorrectChoice) {
            setSelectedAnswer(answerValue);
            setAnswerIsCorrect(true);
            setRecentWrongOption("");
            setAttemptCount((previousCount) => Math.min(2, previousCount + 1));
            setPhase(nextPhase);
            setIsRetrySelectionActive(false);
            setDisabledRetryOption("");
            setHiddenAnswerPanelOption(source === "drag" ? answerValue : "");
            const outcomeClass = getOutcomeClassFromPhase(nextPhase);
            recordOutcomeIfMissing(outcomeClass);
            setExplanationDelay({ nextPhaseAfterDelay: null, revealCorrectAnswer: false });
            return;
        }

        if (nextPhase === CHALLENGE_PHASES.WRONG_FIRST) {
            setAnswerIsCorrect(false);
            setSelectedAnswer("");
            setRecentWrongOption(answerValue);
            setAttemptCount((previousCount) => Math.min(2, previousCount + 1));
            setPhase(CHALLENGE_PHASES.WRONG_FIRST);
            setIsRetrySelectionActive(true);
            setDisabledRetryOption(answerValue);
            setHiddenAnswerPanelOption("");
            if (source === "drag") {
                triggerBounceBack(answerValue, dragMeta);
            }
            setExplanationDelay({ nextPhaseAfterDelay: null, revealCorrectAnswer: false });
            return;
        }

        setAnswerIsCorrect(false);
        setSelectedAnswer("");
        setRecentWrongOption(answerValue);
        setAttemptCount((previousCount) => Math.min(2, previousCount + 1));
        setPhase(CHALLENGE_PHASES.ASSISTED);
        setIsRetrySelectionActive(false);
        setDisabledRetryOption("");
        setHiddenAnswerPanelOption("");
        if (source === "drag") {
            triggerBounceBack(answerValue, dragMeta);
        }
        setExplanationDelay({
            nextPhaseAfterDelay: null,
            revealCorrectAnswer: false,
        });
    };

    const detachDragListeners = () => {
        if (dragListenersRef.current.move) {
            window.removeEventListener("pointermove", dragListenersRef.current.move);
            dragListenersRef.current.move = null;
        }
        if (dragListenersRef.current.up) {
            window.removeEventListener("pointerup", dragListenersRef.current.up);
            dragListenersRef.current.up = null;
        }
        if (dragListenersRef.current.cancel) {
            window.removeEventListener("pointercancel", dragListenersRef.current.cancel);
            dragListenersRef.current.cancel = null;
        }
        if (dragListenersRef.current.mouseMove) {
            window.removeEventListener("mousemove", dragListenersRef.current.mouseMove);
            dragListenersRef.current.mouseMove = null;
        }
        if (dragListenersRef.current.mouseUp) {
            window.removeEventListener("mouseup", dragListenersRef.current.mouseUp);
            dragListenersRef.current.mouseUp = null;
        }
    };

    const isPointInsideBlank = (clientX, clientY) => {
        const blankNode = blankDropZoneRef.current;
        if (!blankNode) {
            return false;
        }

        const rect = blankNode.getBoundingClientRect();
        return (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        );
    };

    const handleAnswerPointerDown = (event, answerValue, isRetryDisabled) => {
        if (!isAnswerSelectionEnabled || isRetryDisabled || !answerValue) {
            return;
        }

        if (event.pointerType === "mouse" && event.button != null && event.button !== 0) {
            return;
        }

        const targetNode = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
        const targetRect = targetNode?.getBoundingClientRect();
        const targetStyle = targetNode ? window.getComputedStyle(targetNode) : null;

        dragGestureRef.current = {
            isPointerDown: true,
            isDragging: false,
            startX: event.clientX,
            startY: event.clientY,
            value: answerValue,
            previewWidth: targetRect?.width ?? 0,
            previewHeight: targetRect?.height ?? 0,
            previewFontSize: targetStyle?.fontSize ?? "",
            previewBorderRadius: targetStyle?.borderRadius ?? "",
        };

        detachDragListeners();

        const onPointerMove = (moveEvent) => {
            const activeGesture = dragGestureRef.current;
            if (!activeGesture.isPointerDown) {
                return;
            }

            const deltaX = moveEvent.clientX - activeGesture.startX;
            const deltaY = moveEvent.clientY - activeGesture.startY;
            const movementDistance = Math.hypot(deltaX, deltaY);

            if (!activeGesture.isDragging && movementDistance >= 6) {
                activeGesture.isDragging = true;
                suppressClickRef.current = true;
                setDraggedAnswer(activeGesture.value);
                setDraggingOption(activeGesture.value);
            }

            if (!activeGesture.isDragging) {
                return;
            }

            moveEvent.preventDefault();
            setDragPreview({
                active: true,
                x: moveEvent.clientX,
                y: moveEvent.clientY,
                value: activeGesture.value,
                width: activeGesture.previewWidth,
                height: activeGesture.previewHeight,
                fontSize: activeGesture.previewFontSize,
                borderRadius: activeGesture.previewBorderRadius,
            });
            setDropTargetActive(isPointInsideBlank(moveEvent.clientX, moveEvent.clientY));
        };

        const finishGesture = (endEvent) => {
            const activeGesture = dragGestureRef.current;
            if (!activeGesture.isPointerDown) {
                return;
            }
            const endDeltaX = endEvent.clientX - activeGesture.startX;
            const endDeltaY = endEvent.clientY - activeGesture.startY;
            const endMovementDistance = Math.hypot(endDeltaX, endDeltaY);
            const wasDragAttempt = activeGesture.isDragging || endMovementDistance >= 8;
            const isDragDrop = activeGesture.isPointerDown && activeGesture.isDragging;
            const droppedAnswer = activeGesture.value;
            const shouldDrop =
                isDragDrop &&
                isPointInsideBlank(endEvent.clientX, endEvent.clientY);

            dragGestureRef.current = {
                isPointerDown: false,
                isDragging: false,
                startX: 0,
                startY: 0,
                value: "",
                previewWidth: 0,
                previewHeight: 0,
                previewFontSize: "",
                previewBorderRadius: "",
            };
            detachDragListeners();

            setDragPreview({
                active: false,
                x: 0,
                y: 0,
                value: "",
                width: 0,
                height: 0,
                fontSize: "",
                borderRadius: "",
                transitioning: false,
            });
            setDraggedAnswer("");
            setDraggingOption("");
            setDropTargetActive(false);

            if (shouldDrop) {
                handleSelectAnswer(droppedAnswer, "drag", {
                    dropX: endEvent.clientX,
                    dropY: endEvent.clientY,
                    previewWidth: activeGesture.previewWidth,
                    previewHeight: activeGesture.previewHeight,
                    previewFontSize: activeGesture.previewFontSize,
                    previewBorderRadius: activeGesture.previewBorderRadius,
                });
            }

            suppressClickRef.current = wasDragAttempt;
            window.setTimeout(() => {
                suppressClickRef.current = false;
            }, wasDragAttempt ? 80 : 0);
        };

        dragListenersRef.current = {
            move: onPointerMove,
            up: finishGesture,
            cancel: finishGesture,
            mouseMove: null,
            mouseUp: null,
        };
        const supportsPointerEvents = typeof window !== "undefined" && "PointerEvent" in window;

        if (supportsPointerEvents) {
            window.addEventListener("pointermove", onPointerMove, { passive: false });
            window.addEventListener("pointerup", finishGesture);
            window.addEventListener("pointercancel", finishGesture);
        } else {
            dragListenersRef.current.mouseMove = onPointerMove;
            dragListenersRef.current.mouseUp = finishGesture;
            window.addEventListener("mousemove", onPointerMove);
            window.addEventListener("mouseup", finishGesture);
        }
    };

    const preventNativeDragStart = (event) => {
        event.preventDefault();
    };

    const preventNativeMouseDrag = (event) => {
        if (event.button === 0) {
            event.preventDefault();
        }
    };

    const handleAnswerMouseDown = (event, answerValue, isRetryDisabled) => {
        if (typeof window !== "undefined" && "PointerEvent" in window) {
            return;
        }

        handleAnswerPointerDown(event, answerValue, isRetryDisabled);
    };

    const advanceToNextQuestionOrSummary = () => {
        if (currentQuestionIndex >= maxQuestionIndex) {
            setShowSummary(true);
            return;
        }

        setCurrentQuestionNumber((previousQuestion) => Math.min(maxQuestionIndex, previousQuestion + 1));
        resetQuestionTransientState();
    };

    const handlePrimaryAction = () => {
        if (!isQuestionContentAvailable || !primaryAction.enabled) {
            return;
        }

        if (hasResolvedQuestion) {
            advanceToNextQuestionOrSummary();
        }
    };

    const handleRetryChallenge = useCallback(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.location.assign(`/challenge?retry=${Date.now()}`);
    }, []);

    useEffect(() => {
        if (!showSummary || summaryPersisted) {
            return;
        }

        try {
            const progressRaw = localStorage.getItem(activeProgressStorageKey) ?? (
                allowLegacyStorageFallback ? localStorage.getItem(PLAYER_PROGRESS_STORAGE_KEY) : null
            );
            const parsedProgress = progressRaw ? JSON.parse(progressRaw) : defaultProgressState;
            const safeProgress = parsedProgress && typeof parsedProgress === "object"
                ? parsedProgress
                : defaultProgressState;

            const existingTopicProgress = extractTopicProgressMetrics(safeProgress?.topicProgress?.[selectedTopicKey]);
            const existingTopicPercent = existingTopicProgress.percent;
            const computedTopicPercent = Math.round(challengeTotals.summary.xpPassRate * 100);
            const nextTopicPercent = Math.max(existingTopicPercent, computedTopicPercent);
            const shouldKeepExistingProgress = existingTopicPercent >= computedTopicPercent;
            const rawExistingTopicProgressEntry = safeProgress?.topicProgress?.[selectedTopicKey];
            const existingTopicProgressEntry = rawExistingTopicProgressEntry && typeof rawExistingTopicProgressEntry === "object"
                ? rawExistingTopicProgressEntry
                : {};
            const nextTopicProgressEntry = shouldKeepExistingProgress
                ? {
                    ...existingTopicProgressEntry,
                    percent: nextTopicPercent,
                    earnedBaseXp: existingTopicProgress.earnedBaseXp,
                    maxBaseXp: existingTopicProgress.maxBaseXp,
                }
                : {
                    percent: nextTopicPercent,
                    earnedBaseXp: challengeTotals.summary.baseXp,
                    maxBaseXp: challengeTotals.summary.maxBaseXp,
                };

            const existingCompletedTopics = Array.isArray(safeProgress.completedTopics)
                ? safeProgress.completedTopics.filter((topicKey) => typeof topicKey === "string" && topicKey.trim())
                : [];
            const completedTopicSet = new Set(existingCompletedTopics.map((topicKey) => topicKey.trim()));

            if (challengeTotals.summary.passed) {
                completedTopicSet.add(selectedTopicKey);
            }

            const challengeSnapshot = {
                topicKey: selectedTopicKey,
                completedAt: new Date().toISOString(),
                outcomes: orderedOutcomes,
                score: {
                    totalQuestions: challengeTotals.summary.totalQuestions,
                    correctCount: challengeTotals.summary.correctCount,
                    accuracyRate: challengeTotals.summary.accuracyRate,
                    xpPassRate: challengeTotals.summary.xpPassRate,
                    passRate: challengeTotals.summary.xpPassRate,
                    passed: challengeTotals.summary.passed,
                    requiredBaseXpToPass: challengeTotals.summary.requiredBaseXpToPass,
                },
                xp: {
                    base: challengeTotals.summary.baseXp,
                    maxBase: challengeTotals.summary.maxBaseXp,
                    total: challengeTotals.totalXp,
                },
            };

            const challengeHistoryByTopic = safeProgress.challengeHistoryByTopic && typeof safeProgress.challengeHistoryByTopic === "object"
                ? safeProgress.challengeHistoryByTopic
                : {};
            const previousTopicHistory = Array.isArray(challengeHistoryByTopic[selectedTopicKey])
                ? challengeHistoryByTopic[selectedTopicKey]
                : [];

            const nextProgress = {
                ...safeProgress,
                completedTopics: Array.from(completedTopicSet),
                topicProgress: {
                    ...(safeProgress.topicProgress && typeof safeProgress.topicProgress === "object" ? safeProgress.topicProgress : {}),
                    [selectedTopicKey]: nextTopicProgressEntry,
                },
                latestChallenge: challengeSnapshot,
                challengeHistoryByTopic: {
                    ...challengeHistoryByTopic,
                    [selectedTopicKey]: [...previousTopicHistory, challengeSnapshot].slice(-20),
                },
                totalXp: Math.max(0, Number(safeProgress.totalXp) || 0) + challengeTotals.totalXp,
            };

            const serializedProgress = JSON.stringify(nextProgress);
            localStorage.setItem(activeProgressStorageKey, serializedProgress);
            if (activeProgressStorageKey !== PLAYER_PROGRESS_STORAGE_KEY) {
                localStorage.setItem(PLAYER_PROGRESS_STORAGE_KEY, serializedProgress);
            }
            const { level, title } = getPlayerLevelInfo(nextProgress);
            setHeaderLevelLabel(`Level ${level} • ${title}`);
            setSummaryPersisted(true);
        } catch (error) {
            console.error("Failed to persist challenge summary", error);
        }
    }, [
        showSummary,
        summaryPersisted,
        selectedTopicKey,
        challengeTotals,
        orderedOutcomes,
        activeProgressStorageKey,
        allowLegacyStorageFallback,
    ]);

    const isAnswerSelectionEnabled =
        isQuestionContentAvailable &&
        !showSummary &&
        !hasResolvedQuestion &&
        (phase === CHALLENGE_PHASES.READY || phase === CHALLENGE_PHASES.WRONG_FIRST || phase === CHALLENGE_PHASES.ASSISTED) &&
        isExplanationVisible;

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

            <main
                className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:py-8"
                onDragStartCapture={preventNativeDragStart}
                onDropCapture={preventNativeDragStart}
            >
                {!showSummary && (
                    <section
                        className="rounded-[24px] border border-primary/15 bg-white/95 px-5 py-4 shadow-sm"
                        data-testid="challenge-selection-metadata"
                        data-question-count={questionCount}
                        data-selected-question-ids={selectedQuestionIds.join(",")}
                        data-selected-question-stem-count={selectedQuestionStemCount}
                        data-selected-unique-stem-count={uniqueSelectedQuestionStemCount}
                        data-recent-question-ids={Array.from(recentQuestionIds).join(",")}
                        data-current-correct-answer={toSafeString(correctAnswer)}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="inline-flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.14em] text-slate-600">
                                    <span className="material-symbols-outlined text-base text-primary">tactic</span>
                                    Challenge Progress
                                </div>
                                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${xpPassBadgeClass}`}>
                                        <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                                        <span className="flex flex-col leading-none">
                                            <span className="text-[9px] font-black uppercase tracking-[0.08em]">Earned</span>
                                            <span className="text-sm font-black text-slate-700">
                                                {challengeTotals.summary.baseXp} / {challengeTotals.summary.maxBaseXp}
                                            </span>
                                        </span>
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 shadow-[0_2px_8px_rgba(16,185,129,0.2)]">
                                        <span className="material-symbols-outlined text-[16px]">flag</span>
                                        <span className="flex flex-col leading-none">
                                            <span className="text-[9px] font-black uppercase tracking-[0.08em]">Goal</span>
                                            <span className="text-sm font-black">{challengeTotals.summary.requiredBaseXpToPass} XP</span>
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <span
                                className="sr-only"
                                data-testid="challenge-xp-pass-progress-text"
                                aria-label={`Pass XP progress ${challengeTotals.summary.baseXp} out of ${challengeTotals.summary.maxBaseXp}, ${challengeTotals.summary.requiredBaseXpToPass} to pass`}
                            >
                                {xpPassProgressText}
                            </span>
                            <span
                                className="sr-only"
                                data-testid="challenge-progress-text"
                            >
                                {progressCounterText}
                            </span>

                            <div className="overflow-x-auto pb-1" data-testid="challenge-indicator-row" aria-label="Question quality indicators">
                                <div className="relative mx-auto w-full px-1" style={{ minWidth: `${indicatorRailMinWidth}px` }}>
                                    <div className="absolute left-[26px] right-[26px] top-[19px] h-[3px] rounded-full bg-slate-200" data-testid="challenge-progress-bar-track">
                                        <div
                                            className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(56,189,248,0.42)] transition-all"
                                            style={{ width: `${questionProgressPercent}%` }}
                                            data-testid="challenge-progress-bar-fill"
                                        />
                                    </div>
                                    <div className="relative flex items-start justify-between gap-2">
                                        {indicatorStates.map((indicatorType, index) => {
                                            const outcomeClass = questionOutcomes[index] ?? null;
                                            const isResolved = Boolean(outcomeClass);
                                            const isActiveQuestion = !showSummary && index === currentQuestionIndex && !isResolved;
                                            const xpLabel = getIndicatorXpLabel(indicatorType);
                                            const labelText = isResolved ? (xpLabel ? `${xpLabel} XP` : "+0 XP") : (isActiveQuestion ? "ACTIVE" : "Locked");
                                            const labelClassName = isResolved
                                                ? `text-[10px] font-black uppercase tracking-[0.05em] ${xpLabel ? getIndicatorXpTextClass(indicatorType) : "text-slate-400"}`
                                                : (isActiveQuestion
                                                    ? "text-[10px] font-black uppercase tracking-[0.08em] text-primary"
                                                    : "text-[10px] font-semibold text-slate-400");
                                            const iconName = isResolved ? getResolvedIndicatorIcon(indicatorType) : (isActiveQuestion ? "pets" : "lock");
                                            const indicatorClassName = isResolved
                                                ? "border-primary bg-primary text-white shadow-[0_2px_10px_rgba(37,157,244,0.36)]"
                                                : (isActiveQuestion
                                                    ? "border-primary bg-white text-primary shadow-[0_0_0_2px_rgba(37,157,244,0.18)]"
                                                    : "border-slate-200 bg-slate-100 text-slate-400");

                                            return (
                                                <div key={`indicator-${index}`} className="flex min-w-[62px] flex-col items-center gap-1.5">
                                                    <span
                                                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition ${indicatorClassName}`}
                                                        data-testid={`challenge-indicator-${index}`}
                                                        data-indicator-type={indicatorType}
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">{iconName}</span>
                                                    </span>
                                                    <span className={labelClassName}>{labelText}</span>
                                                </div>
                                            );
                                        })}

                                        <div className="flex min-w-[62px] flex-col items-center gap-1.5">
                                            <span
                                                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                                                    isFinishMarkerActive
                                                        ? "border-primary bg-primary text-white shadow-[0_2px_10px_rgba(37,157,244,0.36)]"
                                                        : "border-slate-300 bg-slate-50 text-slate-500"
                                                }`}
                                                data-testid="challenge-finish-indicator"
                                                data-finish-state={isFinishMarkerActive ? "active" : "inactive"}
                                            >
                                                <span className="material-symbols-outlined text-[16px]">emoji_events</span>
                                            </span>
                                            <span
                                                className={`text-[10px] ${isFinishMarkerActive ? "font-black uppercase tracking-[0.05em] text-primary" : "font-semibold text-slate-500"}`}
                                            >
                                                Finish
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {!showSummary && (
                    <>
                        <section className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-[88px] overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                                    <img className="h-full w-full object-cover" src={companionAvatar} alt="Companion avatar" />
                                </div>
                                <CharacterSpeechBubble
                                    message={petMessage}
                                    tailSide="left"
                                    borderColor={petBubbleBorderColor}
                                    className="max-w-[320px] bg-white/90"
                                    textClassName="text-base font-black text-slate-700 md:text-lg"
                                    flashOnChange
                                    testId="challenge-pet-message"
                                />
                            </div>

                            <div className="flex items-center gap-3 md:justify-end">
                                <CharacterSpeechBubble
                                    message={heroMessage}
                                    tailSide="right"
                                    borderColor={heroBubbleBorderColor}
                                    className="w-[86vw] max-w-[340px] h-[210px] md:h-[184px] bg-white/90 flex items-center"
                                    textClassName="text-base font-black text-slate-700 md:text-lg"
                                    flashOnChange
                                    testId="challenge-hero-message"
                                />
                                <div className="size-[88px] overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                                    <img className="h-full w-full object-cover" src={headerAvatar} alt="Hero avatar" />
                                </div>
                            </div>
                        </section>

                        <section className="mx-auto mt-10 w-full max-w-5xl rounded-[34px] border-2 border-primary/25 bg-white px-8 py-6 text-center shadow-sm md:px-10 md:py-7">
                            <p className="text-3xl font-black leading-tight text-slate-900 md:text-[2rem] md:whitespace-nowrap" data-testid="challenge-question-sentence">
                                {currentQuestionPrefix}{" "}
                                <span
                                    ref={blankDropZoneRef}
                                    className={`inline-flex min-w-[180px] items-center justify-center rounded-2xl border-2 px-6 py-1 transition ${
                                        selectedAnswer
                                            ? answerIsCorrect
                                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                                : "border-amber-300 bg-amber-50 text-amber-700"
                                            : blankWrongFeedback
                                                ? "border-rose-300 bg-rose-50 text-rose-700 gpa-blank-wrong"
                                            : dropTargetActive
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-primary/30 bg-primary/5 text-primary"
                                    }`}
                                    data-testid="challenge-blank"
                                    data-blank-state={
                                        selectedAnswer
                                            ? answerIsCorrect
                                                ? "filled-correct"
                                                : "filled-wrong"
                                            : blankWrongFeedback
                                                ? "wrong-feedback"
                                                : dropTargetActive
                                                    ? "drop-target"
                                                    : "idle"
                                    }
                                >
                                    {selectedAnswer || "_______"}
                                </span>{" "}
                                {currentQuestionSuffix}
                            </p>
                            {questionXpMessage && (
                                <p className="mt-2 text-base font-black text-emerald-600" data-testid="challenge-xp-message">
                                    {questionXpMessage}
                                </p>
                            )}
                        </section>

                        <section ref={answerOptionsContainerRef} className="mx-auto mt-9 flex w-full max-w-5xl flex-wrap items-center justify-center gap-3 md:gap-4" data-testid="challenge-answer-options">
                            {displayedAnswerOptions.map((optionValue, optionIndex) => {
                                const isSelected = selectedAnswer === optionValue;
                                const isRetryDisabled = isRetrySelectionActive && disabledRetryOption === optionValue;
                                const isWrongSelection = recentWrongOption === optionValue && !answerIsCorrect;
                                const showCorrectGlow =
                                    hasResolvedQuestion &&
                                    toSafeLower(optionValue) === toSafeLower(correctAnswer) &&
                                    (phase === CHALLENGE_PHASES.CORRECT_FIRST ||
                                        phase === CHALLENGE_PHASES.CORRECT_SECOND ||
                                        phase === CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE);

                                return (
                                    <button
                                        key={`${currentQuestion?.id ?? "fallback"}-${optionValue}-${optionIndex}`}
                                        type="button"
                                        draggable={false}
                                        onPointerDown={(event) => handleAnswerPointerDown(event, optionValue, isRetryDisabled)}
                                        onMouseDown={(event) => {
                                            preventNativeMouseDrag(event);
                                            handleAnswerMouseDown(event, optionValue, isRetryDisabled);
                                        }}
                                        onDragStart={preventNativeDragStart}
                                        onClick={(event) => {
                                            if (suppressClickRef.current || event.detail !== 0) {
                                                return;
                                            }
                                            // Keep keyboard activation accessible, but ignore pointer/tap clicks.
                                            handleSelectAnswer(optionValue, "keyboard");
                                        }}
                                        aria-pressed={isSelected ? "true" : "false"}
                                        aria-disabled={!isAnswerSelectionEnabled || isRetryDisabled ? "true" : "false"}
                                        disabled={!isAnswerSelectionEnabled || isRetryDisabled}
                                        data-option-value={optionValue}
                                        data-dragging={draggingOption === optionValue ? "true" : "false"}
                                        data-testid={`challenge-answer-option-${optionIndex}`}
                                        data-option-state={
                                            bouncedBackOption === optionValue
                                                ? "bounce-back"
                                                : showCorrectGlow
                                                ? "correct"
                                                : isWrongSelection
                                                    ? "wrong"
                                                    : isRetryDisabled
                                                        ? "disabled"
                                                        : isSelected
                                                            ? "selected"
                                                            : "idle"
                                        }
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-2xl border px-4 py-2 text-lg font-black shadow-sm transition md:px-5 md:text-xl ${
                                            isSelected
                                                ? answerIsCorrect
                                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 gpa-answer-selected"
                                                    : "border-amber-300 bg-amber-50 text-amber-700 gpa-answer-selected"
                                                : "border-slate-200 bg-white text-slate-700"
                                        } ${isWrongSelection ? "gpa-answer-shake" : ""} ${
                                            showCorrectGlow ? "gpa-answer-correct-glow" : ""
                                        } ${bouncedBackOption === optionValue ? "gpa-answer-bounce-back" : ""} ${
                                            isRetryDisabled ? "cursor-not-allowed" : ""
                                        } ${
                                            draggingOption === optionValue ? "gpa-answer-dragging" : ""
                                        } ${
                                            transitioningBounceOption === optionValue ? "opacity-0" : ""
                                        } ${
                                            isAnswerSelectionEnabled && !isRetryDisabled ? "cursor-grab active:cursor-grabbing select-none touch-none gpa-answer-option" : "gpa-answer-option"
                                        }`}
                                    >
                                        {optionValue}
                                    </button>
                                );
                            })}
                        </section>

                        <section className="mt-auto flex items-center justify-between px-2 py-5">
                            <Link href="/world-map" className="text-lg font-bold text-slate-500 hover:text-slate-700">
                                Skip Challenge
                            </Link>
                            <button
                                type="button"
                                onClick={handlePrimaryAction}
                                disabled={!primaryAction.enabled || !isQuestionContentAvailable}
                                data-testid="challenge-primary-action"
                                data-phase={phase}
                                className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-lg font-black text-white shadow-lg transition ${
                                    !primaryAction.enabled || !isQuestionContentAvailable
                                        ? "cursor-not-allowed bg-slate-400 shadow-slate-300"
                                        : "bg-primary shadow-primary/25"
                                }`}
                            >
                                {primaryAction.label}
                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </button>
                        </section>
                    </>
                )}

                {showSummary && (
                    <section className="mx-auto mt-10 w-full max-w-3xl rounded-[30px] border border-primary/20 bg-white/95 px-6 py-7 shadow-sm" data-testid="challenge-summary">
                        <h2 className="text-center text-3xl font-black text-slate-900">Challenge Summary</h2>
                        <p className="mt-2 text-center text-sm font-semibold text-slate-600" data-testid="challenge-summary-pass-fail">
                            {summaryPassFailMessage}
                        </p>

                        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                            <div className="size-[82px] shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-sm">
                                <img className="h-full w-full object-cover" src={companionAvatar} alt="Companion avatar" />
                            </div>
                            <CharacterSpeechBubble
                                message={summaryPetResultMessage}
                                tailSide="left"
                                borderColor={petBubbleBorderColor}
                                className="bg-white/95"
                                textClassName="text-sm font-black text-slate-700 md:text-base"
                                testId="challenge-summary-pet-message"
                            />
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
                            <div className="rounded-xl bg-white p-3 text-center">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Earned XP</p>
                                <p className="mt-1 text-3xl font-black text-primary" data-testid="challenge-summary-total-xp">{challengeTotals.totalXp}</p>
                            </div>
                            <div className="rounded-xl bg-white p-3 text-center">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Max XP</p>
                                <p className="mt-1 text-3xl font-black text-emerald-600" data-testid="challenge-summary-max-xp">{challengeTotals.summary.maxBaseXp}</p>
                            </div>
                            <div className="rounded-xl bg-white p-3 text-center">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Percentage</p>
                                <p className="mt-1 text-3xl font-black text-sky-600" data-testid="challenge-summary-percentage">{summaryPercentage}%</p>
                            </div>
                            <div className="rounded-xl bg-white p-3 text-center">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">XP Gate</p>
                                <p className="mt-1 text-2xl font-black text-violet-700" data-testid="challenge-summary-xp-gate">{summaryXpGateText}</p>
                            </div>
                        </div>

                        <p className="mt-4 text-center text-sm font-semibold text-slate-700" data-testid="challenge-summary-score">
                            XP Gate: {summaryXpGateText} ({summaryUnlockStateText})
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-center md:grid-cols-3">
                            <div
                                className={`rounded-xl border p-3 ${summaryAccuracyToneStyles.cardClass}`}
                                data-testid="challenge-summary-accuracy-card"
                                data-performance-tone={summaryAccuracyToneKey}
                            >
                                <p className={`text-xs font-bold uppercase tracking-wide ${summaryAccuracyToneStyles.labelClass}`}>Accuracy</p>
                                <p
                                    className={`mt-1 text-2xl font-black ${summaryAccuracyToneStyles.valueClass}`}
                                    data-testid="challenge-summary-accuracy"
                                >
                                    {summaryAccuracyPercent}%
                                </p>
                            </div>
                            <div
                                className={`rounded-xl border p-3 ${summaryFirstTryAccuracyToneStyles.cardClass}`}
                                data-testid="challenge-summary-first-try-accuracy-card"
                                data-performance-tone={summaryFirstTryAccuracyToneKey}
                            >
                                <p className={`text-xs font-bold uppercase tracking-wide ${summaryFirstTryAccuracyToneStyles.labelClass}`}>First-try Accuracy</p>
                                <p
                                    className={`mt-1 text-2xl font-black ${summaryFirstTryAccuracyToneStyles.valueClass}`}
                                    data-testid="challenge-summary-first-try-accuracy"
                                >
                                    {summaryFirstTryAccuracyPercent}%
                                </p>
                            </div>
                            <div
                                className={`rounded-xl border p-3 ${summaryCorrectedMistakesToneStyles.cardClass}`}
                                data-testid="challenge-summary-corrected-mistakes-card"
                                data-performance-tone={summaryCorrectedMistakesToneKey}
                            >
                                <p className={`text-xs font-bold uppercase tracking-wide ${summaryCorrectedMistakesToneStyles.labelClass}`}>Corrected Mistakes</p>
                                <p
                                    className={`mt-1 text-2xl font-black ${summaryCorrectedMistakesToneStyles.valueClass}`}
                                    data-testid="challenge-summary-corrected-mistakes"
                                >
                                    {challengeTotals.summary.correctedMistakeCount}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-3">
                            {challengeTotals.summary.passed ? (
                                <Link
                                    href="/world-map"
                                    data-testid="challenge-summary-next-topic-action"
                                    className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-black text-white shadow-primary/25 shadow-lg"
                                >
                                    Next Topic
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    data-testid="challenge-summary-retry-action"
                                    onClick={handleRetryChallenge}
                                    className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-black text-white shadow-primary/25 shadow-lg"
                                >
                                    Retry Challenge
                                </button>
                            )}
                            <Link
                                href="/world-map"
                                data-testid="challenge-summary-world-map-action"
                                className="inline-flex items-center rounded-full border border-primary/40 bg-white px-6 py-3 text-sm font-black text-primary shadow-sm"
                            >
                                World Map
                            </Link>
                        </div>
                    </section>
                )}
            </main>
            {dragPreview.active && (
                <div
                    className={`gpa-drag-preview ${dragPreview.transitioning ? "gpa-drag-preview-transition" : ""}`}
                    data-testid="challenge-drag-preview"
                    style={{
                        left: `${dragPreview.x}px`,
                        top: `${dragPreview.y}px`,
                        width: dragPreview.width > 0 ? `${dragPreview.width}px` : undefined,
                        height: dragPreview.height > 0 ? `${dragPreview.height}px` : undefined,
                        fontSize: dragPreview.fontSize || undefined,
                        borderRadius: dragPreview.borderRadius || undefined,
                    }}
                >
                    {dragPreview.value}
                </div>
            )}
        </div>
    );
}
