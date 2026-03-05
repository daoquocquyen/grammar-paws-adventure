import { describe, expect, it } from "vitest";

import {
    createTopicQuestionBank,
    getRecentQuestionIds,
    RECENT_TOPIC_ATTEMPT_COOLDOWN,
    selectChallengeQuestions,
} from "../../src/lib/challengeQuestionSelection";

const buildAttempts = (questionIdsByAttempt) =>
    questionIdsByAttempt.map((questionIds, index) => ({
        questionIds,
        createdAt: `2026-03-05T00:00:0${index}Z`,
    }));

describe("Story 2.2 unit", () => {
    it("creates topic-matched challenge questions with varying content", () => {
        const nounsBank = createTopicQuestionBank("nouns", ["common"]);
        const verbsBank = createTopicQuestionBank("verbs", ["ing-ending"]);

        expect(nounsBank).toHaveLength(6);
        expect(verbsBank).toHaveLength(6);
        expect(nounsBank.every((question) => question.topicKey === "nouns")).toBe(true);
        expect(verbsBank.every((question) => question.topicKey === "verbs")).toBe(true);

        const nounsPrompts = new Set(nounsBank.map((question) => question.prompt));
        const nounsCorrectAnswers = new Set(nounsBank.map((question) => question.correctAnswer));
        expect(nounsPrompts).toEqual(new Set(["Nouns: choose the common noun."]));
        expect(nounsCorrectAnswers.size).toBeGreaterThan(1);
        expect(verbsBank[0].prompt).toContain("Verbs");
        expect(nounsBank[0].prompt).not.toBe(verbsBank[0].prompt);
        expect(nounsBank[0].whyCorrect).toContain(`"${nounsBank[0].correctAnswer}"`);
        expect(nounsBank[0].whyWrong).toContain(`"${nounsBank[0].correctAnswer}"`);
        expect(nounsBank[0].whyWrong).toContain("The correct answer is");
    });

    it("selects questions across multiple aspects before repeating", () => {
        const questionBank = createTopicQuestionBank("verbs", ["ing-ending", "auxiliary", "time-marker"]);
        const selection = selectChallengeQuestions({
            questions: questionBank,
            aspectCount: 3,
            topicAttempts: [],
            randomFn: () => 0,
        });

        expect(selection.selectedQuestionIds).toHaveLength(9);

        const aspectCoverage = new Set(selection.selectedQuestions.map((question) => question.aspectId));
        expect(aspectCoverage).toEqual(new Set(["ing-ending", "auxiliary", "time-marker"]));
    });

    it("excludes questions from the last two attempts when enough question pool exists", () => {
        const questionBank = createTopicQuestionBank("nouns", ["common", "proper", "plurality"]);
        const topicAttempts = buildAttempts([
            [
                "nouns::common::q1",
                "nouns::proper::q1",
                "nouns::plurality::q1",
            ],
            [
                "nouns::common::q2",
                "nouns::proper::q2",
                "nouns::plurality::q2",
                "nouns::common::q4",
                "nouns::proper::q4",
                "nouns::plurality::q4",
            ],
        ]);

        const selection = selectChallengeQuestions({
            questions: questionBank,
            aspectCount: 3,
            topicAttempts,
            randomFn: () => 0,
        });

        const recentQuestionIds = getRecentQuestionIds(topicAttempts, RECENT_TOPIC_ATTEMPT_COOLDOWN);
        const hasRecentQuestion = selection.selectedQuestionIds.some((questionId) => recentQuestionIds.has(questionId));

        expect(hasRecentQuestion).toBe(false);
        expect(selection.selectedQuestionIds).toHaveLength(9);
    });

    it("falls back safely to recent questions when cooldown exclusion cannot fill target count", () => {
        const questionBank = createTopicQuestionBank("adverbs", ["how", "when", "where"]);
        const topicAttempts = buildAttempts([
            [
                "adverbs::how::q1",
                "adverbs::when::q1",
                "adverbs::where::q1",
                "adverbs::how::q2",
                "adverbs::when::q2",
                "adverbs::where::q2",
                "adverbs::how::q3",
                "adverbs::when::q3",
                "adverbs::where::q3",
            ],
            [
                "adverbs::how::q4",
                "adverbs::when::q4",
                "adverbs::where::q4",
                "adverbs::how::q5",
                "adverbs::when::q5",
                "adverbs::where::q5",
            ],
        ]);

        const selection = selectChallengeQuestions({
            questions: questionBank,
            aspectCount: 3,
            topicAttempts,
            randomFn: () => 0,
        });

        const uniqueQuestionCount = new Set(selection.selectedQuestionIds).size;
        expect(selection.selectedQuestionIds).toHaveLength(9);
        expect(uniqueQuestionCount).toBe(9);

        const recentQuestionIds = getRecentQuestionIds(topicAttempts);
        const reusedRecentQuestions = selection.selectedQuestionIds.filter((questionId) => recentQuestionIds.has(questionId));
        expect(reusedRecentQuestions.length).toBeGreaterThan(0);
    });
});
