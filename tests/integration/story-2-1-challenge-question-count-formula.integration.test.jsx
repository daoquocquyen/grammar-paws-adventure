import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import TopicIntroPage from "../../app/topic-intro/page";

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
        expect(startChallengeButton).toHaveAttribute("data-question-count", "9");
    });
});
