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

const resolveCurrentQuestionCorrectly = async () => {
    const primaryAction = screen.getByTestId("challenge-primary-action");

    fireEvent.click(findCorrectAnswerButton());
    await waitFor(() => expect(primaryAction).toBeEnabled());
    fireEvent.click(primaryAction);
};

describe("Story 3.5 unit", () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
    });

    afterEach(() => {
        cleanup();
    });

    it("reads hero then question for each new question, and reads hero-only for same-question updates", async () => {
        const { speakMock, restore } = buildSpeechMock();

        try {
            render(<ChallengePage />);

            await waitFor(() => expect(speakMock).toHaveBeenCalledTimes(2));
            const firstSpokenText = String(speakMock.mock.calls[0][0]?.text || "");
            const secondSpokenText = String(speakMock.mock.calls[1][0]?.text || "");

            expect(firstSpokenText.toLowerCase()).toContain("hint");
            expect(secondSpokenText.toLowerCase()).toContain("blank");

            fireEvent.click(findWrongAnswerButton());

            await waitFor(() => expect(speakMock).toHaveBeenCalledTimes(3));
            const updatedHeroSpokenText = String(speakMock.mock.calls[2][0]?.text || "");
            expect(updatedHeroSpokenText.toLowerCase()).toContain("this sentence needs");
            expect(updatedHeroSpokenText.toLowerCase()).not.toContain("blank");

            await waitFor(() => {
                expect(findCorrectAnswerButton({ mustBeEnabled: true })).toBeDefined();
            });
            fireEvent.click(findCorrectAnswerButton({ mustBeEnabled: true }));
            const primaryAction = screen.getByTestId("challenge-primary-action");
            await waitFor(() => expect(primaryAction).toBeEnabled());
            fireEvent.click(primaryAction);

            await waitFor(() => {
                const allSpokenTexts = speakMock.mock.calls.map((call) => String(call[0]?.text || "").toLowerCase());
                const blankNarrationCount = allSpokenTexts.filter((text) => text.includes("blank")).length;
                expect(blankNarrationCount).toBe(2);
            });
        } finally {
            restore();
        }
    });

    it("does not narrate challenge speech when voice is muted in saved settings", async () => {
        const { speakMock, restore } = buildSpeechMock();
        window.localStorage.setItem("gpa_voice_settings_v1", JSON.stringify({ muted: true }));

        try {
            render(<ChallengePage />);
            await waitFor(() => {
                expect(speakMock).toHaveBeenCalledTimes(0);
            });
        } finally {
            restore();
        }
    });

    it("reads summary pet message once after finishing the challenge", async () => {
        const { speakMock, restore } = buildSpeechMock();

        try {
            render(<ChallengePage />);

            for (let index = 0; index < 9; index += 1) {
                await resolveCurrentQuestionCorrectly();
            }

            await waitFor(() => expect(screen.getByTestId("challenge-summary")).toBeInTheDocument());
            const allSpokenTexts = speakMock.mock.calls.map((call) => String(call[0]?.text || "").toLowerCase());
            const summaryNarrationCount = allSpokenTexts.filter((text) =>
                text.includes("congratulations! you unlocked the next topic")
            ).length;
            expect(summaryNarrationCount).toBe(1);
        } finally {
            restore();
        }
    }, 20000);
});
