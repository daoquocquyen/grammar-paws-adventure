import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import TopicIntroPage from "../../app/topic-intro/page";

describe("Story 1.5 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("shows error state for unknown selected topic", () => {
        window.localStorage.setItem("gpa_selected_topic_v1", "unknown-topic");

        render(<TopicIntroPage />);

        expect(screen.getByText("We couldn't load this topic.")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Back to Map" })).toHaveAttribute("href", "/world-map");
    });
});
