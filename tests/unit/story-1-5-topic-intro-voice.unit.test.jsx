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

    it("cancels speech when leaving topic-intro", () => {
        const originalSpeechSynthesis = window.speechSynthesis;
        const originalSpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
        const cancelMock = vi.fn();

        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
        window.speechSynthesis = {
            cancel: cancelMock,
            speak: vi.fn(),
        };
        window.SpeechSynthesisUtterance = function MockSpeechSynthesisUtterance(text) {
            this.text = text;
        };

        try {
            const { unmount } = render(<TopicIntroPage />);
            const callsBeforeUnmount = cancelMock.mock.calls.length;

            unmount();

            expect(cancelMock.mock.calls.length).toBeGreaterThan(callsBeforeUnmount);
        } finally {
            window.speechSynthesis = originalSpeechSynthesis;
            window.SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
        }
    });
});
