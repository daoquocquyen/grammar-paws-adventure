import { describe, expect, it } from "vitest";

import {
    getChallengeQuestionCount,
    MAX_CHALLENGE_QUESTION_COUNT,
    MIN_CHALLENGE_QUESTION_COUNT,
    QUESTION_COUNT_MULTIPLIER,
} from "../../src/lib/challengeQuestionCount";

describe("Story 2.1 unit", () => {
    it("returns 12 for 4 aspects", () => {
        expect(getChallengeQuestionCount(4)).toBe(12);
    });

    it("returns min cap for 1 aspect", () => {
        expect(getChallengeQuestionCount(1)).toBe(MIN_CHALLENGE_QUESTION_COUNT);
    });

    it("returns max cap for 8 aspects", () => {
        expect(getChallengeQuestionCount(8)).toBe(MAX_CHALLENGE_QUESTION_COUNT);
    });

    it("rounds down decimal aspect count before applying formula", () => {
        expect(getChallengeQuestionCount(4.9)).toBe(4 * QUESTION_COUNT_MULTIPLIER);
    });

    it("falls back safely for invalid aspect count values", () => {
        expect(getChallengeQuestionCount(-2)).toBe(MIN_CHALLENGE_QUESTION_COUNT);
        expect(getChallengeQuestionCount(Number.NaN)).toBe(MIN_CHALLENGE_QUESTION_COUNT);
        expect(getChallengeQuestionCount(Infinity)).toBe(MIN_CHALLENGE_QUESTION_COUNT);
    });
});
