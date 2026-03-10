import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import ChallengePage from "../../app/challenge/page";

const buildSpeechMock = () => {
    const originalSpeechSynthesis = window.speechSynthesis;
    const originalSpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
    const speakMock = vi.fn((utterance) => {
        if (typeof utterance?.onend === "function") {
            utterance.onend();
        }
    });
    const cancelMock = vi.fn();

    window.speechSynthesis = {
        cancel: cancelMock,
        speak: speakMock,
    };
    window.SpeechSynthesisUtterance = function MockSpeechSynthesisUtterance(text) {
        this.text = text;
        this.rate = 1;
        this.pitch = 1;
        this.onend = null;
        this.onerror = null;
    };

    return {
        cancelMock,
        restore: () => {
            window.speechSynthesis = originalSpeechSynthesis;
            window.SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
        },
        speakMock,
    };
};

const findWrongAnswerButton = () => {
    const metadata = screen.getByTestId("challenge-selection-metadata");
    const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();
    const optionButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");

    const wrongButton = optionButtons.find((button) => (button.textContent || "").trim().toLowerCase() !== correctAnswer);
    if (!wrongButton) {
        throw new Error("Missing wrong option for voice narration test");
    }

    return wrongButton;
};

const findCorrectAnswerButton = ({ mustBeEnabled = false } = {}) => {
    const metadata = screen.getByTestId("challenge-selection-metadata");
    const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();
    const optionButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");

    const correctButton = optionButtons.find((button) => {
        const matchesCorrectAnswer = (button.textContent || "").trim().toLowerCase() === correctAnswer;
        if (!matchesCorrectAnswer) {
            return false;
        }
        return mustBeEnabled ? !button.disabled : true;
    });
    if (!correctButton) {
        throw new Error("Missing correct option for voice narration test");
    }

    return correctButton;
};

describe("Story 3.5 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
    });

    afterEach(() => {
        cleanup();
    });

    it("narrates hero+question for each question start, and hero-only on same-question feedback", async () => {
        const { speakMock, restore } = buildSpeechMock();

        try {
            render(<ChallengePage />);

            await waitFor(() => expect(speakMock).toHaveBeenCalledTimes(2));
            fireEvent.click(findWrongAnswerButton());

            await waitFor(() => expect(speakMock).toHaveBeenCalledTimes(3));
            const allSpokenTexts = speakMock.mock.calls.map((call) => String(call[0]?.text || "").toLowerCase());
            const blankNarrationCount = allSpokenTexts.filter((text) => text.includes("blank")).length;

            expect(blankNarrationCount).toBe(1);
            expect(allSpokenTexts[2]).toContain("this sentence needs");

            await waitFor(() => {
                expect(findCorrectAnswerButton({ mustBeEnabled: true })).toBeDefined();
            });
            fireEvent.click(findCorrectAnswerButton({ mustBeEnabled: true }));
            const primaryAction = screen.getByTestId("challenge-primary-action");
            await waitFor(() => expect(primaryAction).toBeEnabled());
            fireEvent.click(primaryAction);

            await waitFor(() => {
                const nextAllSpokenTexts = speakMock.mock.calls.map((call) => String(call[0]?.text || "").toLowerCase());
                const nextBlankNarrationCount = nextAllSpokenTexts.filter((text) => text.includes("blank")).length;
                expect(nextBlankNarrationCount).toBe(2);
            });
        } finally {
            restore();
        }
    });

    it("cancels active narration on page exit and unmount", async () => {
        const { cancelMock, restore } = buildSpeechMock();

        try {
            const { unmount } = render(<ChallengePage />);
            const callsBeforeExit = cancelMock.mock.calls.length;

            window.dispatchEvent(new Event("pagehide"));
            window.dispatchEvent(new Event("beforeunload"));

            await waitFor(() => expect(cancelMock.mock.calls.length).toBeGreaterThan(callsBeforeExit));

            const callsBeforeUnmount = cancelMock.mock.calls.length;
            unmount();

            expect(cancelMock.mock.calls.length).toBeGreaterThan(callsBeforeUnmount);
        } finally {
            restore();
        }
    });
});
