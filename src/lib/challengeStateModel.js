export const CHALLENGE_PHASES = Object.freeze({
    READY: "ready",
    WRONG_FIRST: "wrong_first",
    CORRECT_FIRST: "correct_first",
    CORRECT_SECOND: "correct_second",
    ASSISTED: "assisted",
    AWAIT_ACKNOWLEDGE: "await_acknowledge",
});

export const OUTCOME_CLASSES = Object.freeze({
    FIRST_TRY_CORRECT: "first_try_correct",
    SECOND_TRY_CORRECT: "second_try_correct",
    ASSISTED: "assisted",
    SKIPPED: "skipped",
});

export const EXPLANATION_DELAY_MS = 500;

const toSafeString = (value) => (typeof value === "string" ? value.trim() : "");

export const resolvePhaseFromAttempt = ({ attemptCount, isCorrect }) => {
    const safeAttemptCount = Number.isFinite(attemptCount) ? Math.max(0, Math.floor(attemptCount)) : 0;

    if (safeAttemptCount === 0) {
        return isCorrect ? CHALLENGE_PHASES.CORRECT_FIRST : CHALLENGE_PHASES.WRONG_FIRST;
    }

    if (safeAttemptCount === 1) {
        return isCorrect ? CHALLENGE_PHASES.CORRECT_SECOND : CHALLENGE_PHASES.ASSISTED;
    }

    return CHALLENGE_PHASES.ASSISTED;
};

export const getOutcomeClassFromPhase = (phase) => {
    if (phase === CHALLENGE_PHASES.CORRECT_FIRST) {
        return OUTCOME_CLASSES.FIRST_TRY_CORRECT;
    }

    if (phase === CHALLENGE_PHASES.CORRECT_SECOND) {
        return OUTCOME_CLASSES.SECOND_TRY_CORRECT;
    }

    if (phase === CHALLENGE_PHASES.ASSISTED || phase === CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE) {
        return OUTCOME_CLASSES.ASSISTED;
    }

    return null;
};

export const getIndicatorForOutcome = (outcomeClass) => {
    if (outcomeClass === OUTCOME_CLASSES.FIRST_TRY_CORRECT) {
        return "STAR";
    }

    if (outcomeClass === OUTCOME_CLASSES.SECOND_TRY_CORRECT) {
        return "HOLLOW_STAR";
    }

    if (outcomeClass === OUTCOME_CLASSES.ASSISTED) {
        return "CHECK";
    }

    return "EMPTY";
};

export const getIndicatorGlyph = (indicatorType) => {
    if (indicatorType === "STAR") {
        return "\u2b50";
    }

    if (indicatorType === "HOLLOW_STAR") {
        return "\u2606";
    }

    if (indicatorType === "CHECK") {
        return "\u2713";
    }

    return "";
};

export const getPrimaryActionState = ({
    phase,
    isExplanationVisible,
    hasResolvedQuestion,
}) => {
    if (phase === CHALLENGE_PHASES.ASSISTED || phase === CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE) {
        return {
            label: "Next",
            enabled: phase === CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE && Boolean(isExplanationVisible),
        };
    }

    return {
        label: "Next",
        enabled: Boolean(hasResolvedQuestion && isExplanationVisible),
    };
};

export const getHeroFeedbackText = ({
    phase,
    question,
    selectedAnswer,
    correctAnswer,
    isRetrySelectionActive,
}) => {
    const safeHint = toSafeString(question?.hint) || "choose the option that matches the grammar clue.";
    const safeCorrectReason =
        toSafeString(question?.whyCorrect) ||
        toSafeString(question?.correctFeedback) ||
        "Great choice. That answer matches the sentence rule.";
    const safeSelected = toSafeString(selectedAnswer);
    const safeCorrect = toSafeString(correctAnswer) || "the correct option";

    if (phase === CHALLENGE_PHASES.READY) {
        if (isRetrySelectionActive) {
            return `Retry clue: ${safeHint}`;
        }
        return `Hint: ${safeHint}`;
    }

    if (phase === CHALLENGE_PHASES.WRONG_FIRST) {
        return `This sentence needs ${safeHint} Which option matches that clue?`;
    }

    if (phase === CHALLENGE_PHASES.CORRECT_FIRST || phase === CHALLENGE_PHASES.CORRECT_SECOND) {
        return safeCorrectReason;
    }

    return `Let's solve it step by step. First, read the clue carefully. Then match the grammar rule. The correct answer is "${safeCorrect}".`;
};

export const getPetFeedbackText = ({ phase, hasResolvedQuestion, outcomeClass, attemptCount }) => {
    if (outcomeClass === OUTCOME_CLASSES.FIRST_TRY_CORRECT) {
        return "Amazing focus. +10 XP!";
    }

    if (outcomeClass === OUTCOME_CLASSES.SECOND_TRY_CORRECT) {
        return "Nice fix. +6 XP!";
    }

    if (outcomeClass === OUTCOME_CLASSES.ASSISTED) {
        return "Great effort. +3 XP!";
    }

    if (phase === CHALLENGE_PHASES.WRONG_FIRST) {
        return "Nice effort! Use the clue and try one more time.";
    }

    if (phase === CHALLENGE_PHASES.ASSISTED || phase === CHALLENGE_PHASES.AWAIT_ACKNOWLEDGE) {
        if (
            phase === CHALLENGE_PHASES.ASSISTED &&
            Number.isFinite(attemptCount) &&
            attemptCount >= 3 &&
            !hasResolvedQuestion
        ) {
            return "That one is tricky. You can do it, try again!";
        }
        return "Step by step is brave and smart. Keep going.";
    }

    if (hasResolvedQuestion) {
        return "Awesome focus! Keep that energy going.";
    }

    return "Pick the best answer and we will learn together.";
};

export const getXpMessageForOutcome = (outcomeClass) => {
    if (outcomeClass === OUTCOME_CLASSES.FIRST_TRY_CORRECT) {
        return "+10 XP! Amazing focus!";
    }

    if (outcomeClass === OUTCOME_CLASSES.SECOND_TRY_CORRECT) {
        return "+6 XP! You fixed it!";
    }

    if (outcomeClass === OUTCOME_CLASSES.ASSISTED) {
        return "+3 XP! Learning moment!";
    }

    return "+0 XP! Keep practicing!";
};
