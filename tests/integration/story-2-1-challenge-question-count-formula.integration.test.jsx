import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import TopicIntroPage from "../../app/topic-intro/page";
import { getChallengeQuestionCount } from "../../src/lib/challengeQuestionCount";
import { getTopicAspectIds } from "../../src/lib/topicCatalog";

describe("Story 2.1 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("shows computed challenge question count metadata from selected topic aspects", () => {
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");

        render(<TopicIntroPage />);

        const startChallengeButton = screen.getByRole("button", { name: /Start Challenge/ });
        const expectedQuestionCount = getChallengeQuestionCount(getTopicAspectIds("nouns").length);
        expect(startChallengeButton).toHaveAttribute("data-question-count", String(expectedQuestionCount));
    });

    it("adjusts metadata when selected topic has a different aspect count", () => {
        window.localStorage.setItem("gpa_selected_topic_v1", "verbs");

        render(<TopicIntroPage />);

        const startChallengeButton = screen.getByRole("button", { name: /Start Challenge/ });
        const expectedQuestionCount = getChallengeQuestionCount(getTopicAspectIds("verbs").length);
        expect(startChallengeButton).toHaveAttribute("data-question-count", String(expectedQuestionCount));
    });
});
