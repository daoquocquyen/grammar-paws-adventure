import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import TopicIntroPage from "../../app/topic-intro/page";

describe("Story 1.5 unit", () => {
    it("degrades to text mode when voice is unavailable", () => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
        delete window.speechSynthesis;
        delete window.SpeechSynthesisUtterance;

        render(<TopicIntroPage />);

        expect(screen.getByText("Voice unavailable in this browser. Text mode is active.")).toBeInTheDocument();
    });
});
