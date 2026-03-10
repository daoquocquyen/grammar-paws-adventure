import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import ChallengePage from "../../app/challenge/page";

const clickOptionByText = (label) => {
    const optionButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
    const targetButton = optionButtons.find(
        (button) => (button.textContent || "").trim().toLowerCase() === label.trim().toLowerCase()
    );

    if (!targetButton) {
        throw new Error(`Missing answer option: ${label}`);
    }

    fireEvent.click(targetButton);
};

const completeQuestionWithCorrectAnswer = async () => {
    const metadata = screen.getByTestId("challenge-selection-metadata");
    const correctAnswer = metadata.getAttribute("data-current-correct-answer") || "";

    clickOptionByText(correctAnswer);

    const primaryAction = screen.getByTestId("challenge-primary-action");
    await waitFor(() => expect(primaryAction).toBeEnabled());
    fireEvent.click(primaryAction);
};

describe("Story 3.1 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
    });

    afterEach(() => {
        cleanup();
    });

    it("awards XP once per question and computes summary from canonical outcomes", async () => {
        render(<ChallengePage />);

        for (let index = 0; index < 9; index += 1) {
            await completeQuestionWithCorrectAnswer();
        }

        await waitFor(() => expect(screen.getByTestId("challenge-summary")).toBeInTheDocument());

        expect(screen.getByTestId("challenge-summary-total-xp")).toHaveTextContent("90");
        expect(screen.queryByTestId("challenge-summary-bonus-xp")).not.toBeInTheDocument();
        expect(screen.getByTestId("challenge-summary-pass-fail")).toHaveTextContent(/Pass achieved/i);

        const progressRaw = window.localStorage.getItem("gpa_player_progress_v1");
        expect(progressRaw).toBeTruthy();

        const savedProgress = JSON.parse(progressRaw || "{}");
        expect(savedProgress.latestChallenge.outcomes).toHaveLength(9);
        expect(savedProgress.latestChallenge.score.correctCount).toBe(9);
        expect(savedProgress.latestChallenge.score.passed).toBe(true);
        expect(savedProgress.latestChallenge.xp.total).toBe(90);
        expect(savedProgress.latestChallenge.xp.bonus).toBeUndefined();
    }, 15000);

    it("shows XP gate text and question-count progress fill in challenge progress UI", async () => {
        render(<ChallengePage />);

        expect(screen.getByTestId("challenge-xp-pass-progress-text")).toHaveTextContent("XP 0/90 (72 to pass)");
        expect(screen.getByTestId("challenge-progress-bar-fill")).toHaveStyle({ width: "0%" });

        await completeQuestionWithCorrectAnswer();

        expect(screen.getByTestId("challenge-xp-pass-progress-text")).toHaveTextContent("XP 10/90 (72 to pass)");
        const questionProgressFill = screen.getByTestId("challenge-progress-bar-fill");
        const questionProgressWidth = Number.parseFloat((questionProgressFill.style.width || "0").replace("%", ""));
        expect(questionProgressWidth).toBeGreaterThan(11);
        expect(questionProgressWidth).toBeLessThan(12);
    });
});
