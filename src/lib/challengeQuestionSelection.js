import { getChallengeQuestionCount } from "./challengeQuestionCount";

const RECENT_TOPIC_ATTEMPT_COOLDOWN = 2;
const QUESTIONS_PER_ASPECT = 6;

const toSafeString = (value) => (typeof value === "string" ? value.trim() : "");

const shuffleWithRandom = (items, randomFn = Math.random) => {
    const clonedItems = [...items];
    for (let index = clonedItems.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(randomFn() * (index + 1));
        [clonedItems[index], clonedItems[swapIndex]] = [clonedItems[swapIndex], clonedItems[index]];
    }
    return clonedItems;
};

const buildAspectGroups = (questions, randomFn) => {
    const groupedQuestions = new Map();

    questions.forEach((question) => {
        const aspectId = toSafeString(question?.aspectId);
        const questionId = toSafeString(question?.id);

        if (!aspectId || !questionId) {
            return;
        }

        if (!groupedQuestions.has(aspectId)) {
            groupedQuestions.set(aspectId, []);
        }

        groupedQuestions.get(aspectId).push({ ...question, id: questionId, aspectId });
    });

    return Array.from(groupedQuestions.entries()).map(([aspectId, groupQuestions]) => ({
        aspectId,
        questions: shuffleWithRandom(groupQuestions, randomFn),
    }));
};

const pickRoundRobinByAspect = (questions, pickCount, randomFn) => {
    const aspectGroups = buildAspectGroups(questions, randomFn);
    const selectedQuestions = [];
    const selectedQuestionIds = new Set();

    if (aspectGroups.length === 0 || pickCount <= 0) {
        return selectedQuestions;
    }

    while (selectedQuestions.length < pickCount) {
        const availableGroups = aspectGroups.filter((group) => group.questions.length > 0);

        if (availableGroups.length === 0) {
            break;
        }

        const visitOrder = shuffleWithRandom(availableGroups, randomFn);

        visitOrder.forEach((group) => {
            if (selectedQuestions.length >= pickCount || group.questions.length === 0) {
                return;
            }

            const nextQuestion = group.questions.shift();
            if (!selectedQuestionIds.has(nextQuestion.id)) {
                selectedQuestionIds.add(nextQuestion.id);
                selectedQuestions.push(nextQuestion);
            }
        });
    }

    return selectedQuestions;
};

export const getRecentQuestionIds = (topicAttempts, cooldownAttemptCount = RECENT_TOPIC_ATTEMPT_COOLDOWN) => {
    if (!Array.isArray(topicAttempts) || topicAttempts.length === 0) {
        return new Set();
    }

    const safeCooldown = Math.max(0, Number.isFinite(cooldownAttemptCount) ? Math.floor(cooldownAttemptCount) : 0);
    if (safeCooldown === 0) {
        return new Set();
    }

    const recentAttempts = topicAttempts.slice(-safeCooldown);
    const recentQuestionIds = new Set();

    recentAttempts.forEach((attempt) => {
        if (!Array.isArray(attempt?.questionIds)) {
            return;
        }

        attempt.questionIds.forEach((questionId) => {
            const safeQuestionId = toSafeString(questionId);
            if (safeQuestionId) {
                recentQuestionIds.add(safeQuestionId);
            }
        });
    });

    return recentQuestionIds;
};

export const selectChallengeQuestions = ({
    questions,
    aspectCount,
    topicAttempts,
    cooldownAttemptCount = RECENT_TOPIC_ATTEMPT_COOLDOWN,
    randomFn = Math.random,
}) => {
    const safeQuestions = Array.isArray(questions) ? questions : [];
    const questionCount = getChallengeQuestionCount(aspectCount);
    const recentQuestionIds = getRecentQuestionIds(topicAttempts, cooldownAttemptCount);

    const preferredQuestions = safeQuestions.filter((question) => !recentQuestionIds.has(toSafeString(question?.id)));
    const selectedQuestions = pickRoundRobinByAspect(preferredQuestions, questionCount, randomFn);

    if (selectedQuestions.length < questionCount) {
        const alreadySelectedIds = new Set(selectedQuestions.map((question) => question.id));
        const fallbackQuestions = safeQuestions.filter((question) => !alreadySelectedIds.has(toSafeString(question?.id)));
        const fallbackSelections = pickRoundRobinByAspect(
            fallbackQuestions,
            questionCount - selectedQuestions.length,
            randomFn
        );
        selectedQuestions.push(...fallbackSelections);
    }

    return {
        questionCount,
        selectedQuestions,
        selectedQuestionIds: selectedQuestions.map((question) => question.id),
        recentQuestionIds,
    };
};

export const createTopicQuestionBank = (topicKey, aspectIds = []) => {
    const safeTopicKey = toSafeString(topicKey) || "topic";
    const uniqueAspectIds = Array.from(
        new Set(
            (Array.isArray(aspectIds) ? aspectIds : [])
                .map((aspectId) => toSafeString(aspectId))
                .filter(Boolean)
        )
    );

    return uniqueAspectIds.flatMap((aspectId) =>
        Array.from({ length: QUESTIONS_PER_ASPECT }, (_, index) => {
            const questionOrdinal = index + 1;
            return {
                id: `${safeTopicKey}::${aspectId}::q${questionOrdinal}`,
                aspectId,
                prompt: `Practice ${aspectId} question ${questionOrdinal}`,
            };
        })
    );
};

export { QUESTIONS_PER_ASPECT, RECENT_TOPIC_ATTEMPT_COOLDOWN };
