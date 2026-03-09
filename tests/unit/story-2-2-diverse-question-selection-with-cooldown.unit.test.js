import { describe, expect, it } from "vitest";

import {
    createTopicQuestionBank,
    getQuestionSelectionKey,
    getQuestionStemKey,
    getRecentQuestionIds,
    RECENT_TOPIC_ATTEMPT_COOLDOWN,
    selectChallengeQuestions,
} from "../../src/lib/challengeQuestionSelection";

const buildAttempts = (questionIdsByAttempt) =>
    questionIdsByAttempt.map((questionIds, index) => ({
        questionIds,
        createdAt: `2026-03-05T00:00:0${index}Z`,
    }));

const buildSyntheticQuestion = ({ id, aspectId, stemSeed }) => ({
    id,
    aspectId,
    prompt: `Prompt ${stemSeed}`,
    sentencePrefix: `Prefix ${stemSeed}`,
    sentenceSuffix: ".",
    correctAnswer: `answer-${stemSeed}`,
    options: [`answer-${stemSeed}`, `wrong-a-${stemSeed}`, `wrong-b-${stemSeed}`, `wrong-c-${stemSeed}`],
});

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

        const selectedStemKeys = selection.selectedQuestions.map(getQuestionStemKey);
        expect(new Set(selectedStemKeys).size).toBe(selection.selectedQuestions.length);
    });

    it("excludes recent questions when enough non-duplicate stem pool exists", () => {
        const aspectIds = ["a1", "a2", "a3"];
        const questionBank = aspectIds.flatMap((aspectId) =>
            Array.from({ length: 6 }, (_, index) =>
                buildSyntheticQuestion({
                    id: `topic::${aspectId}::q${index + 1}`,
                    aspectId,
                    stemSeed: `${aspectId}-${index + 1}`,
                })
            )
        );
        const topicAttempts = buildAttempts([
            [
                "topic::a1::q1",
                "topic::a2::q1",
                "topic::a3::q1",
            ],
            [
                "topic::a1::q2",
                "topic::a2::q2",
                "topic::a3::q2",
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

    it("keeps selected stems unique across random picks", () => {
        const questionBank = createTopicQuestionBank("verbs", ["ing-ending", "auxiliary", "time-marker"]);

        for (let run = 0; run < 30; run += 1) {
            const selection = selectChallengeQuestions({
                questions: questionBank,
                aspectCount: 3,
                topicAttempts: [],
            });
            const stemKeys = selection.selectedQuestions.map((question) => getQuestionStemKey(question)).filter(Boolean);
            expect(new Set(stemKeys).size).toBe(stemKeys.length);
        }
    });

    it("keeps stem-level dedupe across preferred and fallback merge paths", () => {
        const questionBank = [
            buildSyntheticQuestion({ id: "custom::q1", aspectId: "custom", stemSeed: "a" }),
            buildSyntheticQuestion({ id: "custom::q2", aspectId: "custom", stemSeed: "b" }),
            buildSyntheticQuestion({ id: "custom::q3", aspectId: "custom", stemSeed: "c" }),
            buildSyntheticQuestion({ id: "custom::q4", aspectId: "custom", stemSeed: "d" }),
            buildSyntheticQuestion({ id: "custom::q5", aspectId: "custom", stemSeed: "e" }),
            buildSyntheticQuestion({ id: "custom::q6", aspectId: "custom", stemSeed: "f" }),
            buildSyntheticQuestion({ id: "custom::q7", aspectId: "custom", stemSeed: "e" }),
            buildSyntheticQuestion({ id: "custom::q8", aspectId: "custom", stemSeed: "b" }),
            buildSyntheticQuestion({ id: "custom::q9", aspectId: "custom", stemSeed: "g" }),
        ];
        const topicAttempts = buildAttempts([["custom::q1", "custom::q2", "custom::q3", "custom::q4"]]);

        const selection = selectChallengeQuestions({
            questions: questionBank,
            aspectCount: 1,
            topicAttempts,
            randomFn: () => 0,
        });

        const stemKeys = selection.selectedQuestions.map((question) => getQuestionStemKey(question)).filter(Boolean);
        const selectionKeys = selection.selectedQuestions.map((question) => getQuestionSelectionKey(question)).filter(Boolean);

        expect(selection.selectedQuestionIds).toHaveLength(6);
        expect(new Set(stemKeys).size).toBe(stemKeys.length);
        expect(new Set(selectionKeys).size).toBe(selectionKeys.length);
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

    it("keeps sentence frames aligned with correct answers to avoid meaning mismatches", () => {
        const commonNouns = createTopicQuestionBank("nouns", ["common"]);
        const properNouns = createTopicQuestionBank("nouns", ["proper"]);
        const whenAdverbs = createTopicQuestionBank("adverbs", ["when"]);

        expect(commonNouns.map((question) => question.correctAnswer)).toEqual([
            "dog",
            "teacher",
            "library",
            "dog",
            "teacher",
            "library",
        ]);
        expect(properNouns[2].correctAnswer).toBe("Liam");
        expect(whenAdverbs[2].sentencePrefix).toBe("They visited us");
        expect(whenAdverbs[2].correctAnswer).toBe("yesterday");
    });
});
