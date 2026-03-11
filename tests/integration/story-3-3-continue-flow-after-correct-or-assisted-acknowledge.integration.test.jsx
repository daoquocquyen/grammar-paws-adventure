import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import ChallengePage from "../../app/challenge/page";

const clickCorrectOption = () => {
    const metadata = screen.getByTestId("challenge-selection-metadata");
    const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();

    const optionButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
    const button = optionButtons.find((item) => ((item.textContent || "").trim().toLowerCase() === correctAnswer));

    if (!button) {
        throw new Error("Missing correct option");
    }

    fireEvent.click(button);
};

const getCurrentCorrectAnswer = () => (
    (screen.getByTestId("challenge-selection-metadata").getAttribute("data-current-correct-answer") || "")
        .trim()
        .toLowerCase()
);

const findEnabledWrongButton = () => {
    const correctAnswer = getCurrentCorrectAnswer();
    const optionButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
    return optionButtons.find(
        (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() !== correctAnswer
    );
};

const resolveCurrentQuestionAsSkipped = async () => {
    const primaryAction = screen.getByTestId("challenge-primary-action");

    for (let attempt = 0; attempt < 3; attempt += 1) {
        const wrongButton = findEnabledWrongButton();
        if (!wrongButton) {
            throw new Error(`Missing enabled wrong option for skip attempt ${attempt + 1}`);
        }
        fireEvent.click(wrongButton);

        if (attempt < 2) {
            await waitFor(() => {
                const nextWrongButton = findEnabledWrongButton();
                expect(nextWrongButton).toBeDefined();
            });
        }
    }

    await waitFor(() => expect(primaryAction).toBeEnabled());
    fireEvent.click(primaryAction);
};

describe("Story 3.3 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
    });

    afterEach(() => {
        cleanup();
    });

    it("maps primary action labels by state and resets transient state after acknowledge", async () => {
        render(<ChallengePage />);

        const metadata = screen.getByTestId("challenge-selection-metadata");
        const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();
        const primaryAction = screen.getByTestId("challenge-primary-action");
        expect(primaryAction).toHaveTextContent("Next");
        expect(primaryAction).toBeDisabled();

        const buttons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const firstWrongButton = buttons.find(
            (button) => (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!firstWrongButton) {
            throw new Error("Missing wrong option for first attempt");
        }

        fireEvent.click(firstWrongButton);

        await waitFor(() => expect(primaryAction).toHaveTextContent("Next"));
        expect(primaryAction).toBeDisabled();

        await waitFor(() => {
            const buttons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
            const enabledWrongButton = buttons.find(
                (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() !== correctAnswer
            );
            expect(enabledWrongButton).toBeDefined();
        });

        const retryButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const secondWrongButton = retryButtons.find(
            (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!secondWrongButton) {
            throw new Error("Missing wrong option for second attempt");
        }
        fireEvent.click(secondWrongButton);

        await waitFor(() => expect(primaryAction).toHaveTextContent("Next"));
        expect(primaryAction).toBeDisabled();
        await waitFor(() => {
            const buttons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
            const enabledCorrectButton = buttons.find(
                (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() === correctAnswer
            );
            expect(enabledCorrectButton).toBeDefined();
        });

        const coachedButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const coachedCorrectButton = coachedButtons.find(
            (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() === correctAnswer
        );
        if (!coachedCorrectButton) {
            throw new Error("Missing correct option for coached attempt");
        }

        fireEvent.click(coachedCorrectButton);

        expect(primaryAction).toHaveTextContent("Next");
        expect(primaryAction).toBeDisabled();
        await waitFor(() =>
            expect(screen.getByTestId("challenge-pet-message")).toHaveTextContent("+3 XP!")
        );
        expect(screen.queryByTestId("challenge-xp-message")).not.toBeInTheDocument();
        await waitFor(() => expect(primaryAction).toHaveTextContent("Next"));
        await waitFor(() => expect(primaryAction).toBeEnabled());

        fireEvent.click(primaryAction);

        expect(screen.getByTestId("challenge-progress-text")).toHaveTextContent("2/9");
        expect(screen.getByTestId("challenge-blank")).toHaveTextContent("_______");
        expect(primaryAction).toHaveTextContent("Next");
        expect(primaryAction).toBeDisabled();
    });

    it("routes from last question to level-complete summary without off-by-one progress issues", async () => {
        render(<ChallengePage />);

        expect(screen.getByTestId("challenge-progress-text")).toHaveTextContent("1/9");
        expect(screen.getByTestId("challenge-progress-bar-fill")).toHaveStyle({ width: "0%" });
        expect(screen.getByTestId("challenge-finish-indicator")).toHaveAttribute("data-finish-state", "inactive");
        const primaryAction = screen.getByTestId("challenge-primary-action");

        for (let index = 0; index < 8; index += 1) {
            clickCorrectOption();
            await waitFor(() => expect(primaryAction).toBeEnabled());
            fireEvent.click(primaryAction);
        }

        clickCorrectOption();
        await waitFor(() => expect(primaryAction).toBeEnabled());
        expect(screen.getByTestId("challenge-finish-indicator")).toHaveAttribute("data-finish-state", "active");
        fireEvent.click(primaryAction);

        await waitFor(() => expect(screen.getByTestId("challenge-summary")).toBeInTheDocument());
        expect(screen.queryByTestId("challenge-progress-text")).not.toBeInTheDocument();
        expect(screen.queryByTestId("challenge-progress-bar-fill")).not.toBeInTheDocument();
        expect(screen.queryByTestId("challenge-finish-indicator")).not.toBeInTheDocument();
        expect(screen.getByTestId("challenge-summary-percentage")).toHaveTextContent("100%");
        expect(screen.getByTestId("challenge-summary-xp-gate")).toHaveTextContent("90/72");
        expect(screen.getByTestId("challenge-summary-pet-message")).toHaveTextContent(/unlocked the next topic/i);
        expect(screen.getByTestId("challenge-summary-next-topic-action")).toHaveAttribute("href", "/world-map");
        expect(screen.getByTestId("challenge-summary-world-map-action")).toHaveAttribute("href", "/world-map");
        expect(screen.queryByTestId("challenge-summary-retry-action")).not.toBeInTheDocument();
        expect(screen.getByTestId("challenge-summary-accuracy")).toHaveTextContent("100%");
        expect(screen.getByTestId("challenge-summary-first-try-accuracy")).toHaveTextContent("100%");
        expect(screen.getByTestId("challenge-summary-corrected-mistakes")).toHaveTextContent("0");
        expect(screen.getByTestId("challenge-summary-accuracy-card")).toHaveAttribute("data-performance-tone", "excellent");
        expect(screen.getByTestId("challenge-summary-first-try-accuracy-card")).toHaveAttribute("data-performance-tone", "excellent");
        expect(screen.getByTestId("challenge-summary-corrected-mistakes-card")).toHaveAttribute("data-performance-tone", "excellent");
    }, 15000);

    it("shows retry action and fail metrics when pass threshold is not met", async () => {
        window.localStorage.setItem("gpa_selected_topic_v1", "verbs");
        render(<ChallengePage />);

        for (let index = 0; index < 6; index += 1) {
            await resolveCurrentQuestionAsSkipped();
        }

        await waitFor(() => expect(screen.getByTestId("challenge-summary")).toBeInTheDocument());
        expect(screen.getByTestId("challenge-summary-pass-fail")).toHaveTextContent(/Keep practicing/i);
        expect(screen.getByTestId("challenge-summary-xp-gate")).toHaveTextContent("0/48");
        expect(screen.getByTestId("challenge-summary-percentage")).toHaveTextContent("0%");
        expect(screen.getByTestId("challenge-summary-accuracy")).toHaveTextContent("0%");
        expect(screen.getByTestId("challenge-summary-first-try-accuracy")).toHaveTextContent("0%");
        expect(screen.getByTestId("challenge-summary-corrected-mistakes")).toHaveTextContent("0");
        expect(screen.getByTestId("challenge-summary-accuracy-card")).toHaveAttribute("data-performance-tone", "needs_practice");
        expect(screen.getByTestId("challenge-summary-first-try-accuracy-card")).toHaveAttribute("data-performance-tone", "needs_practice");
        expect(screen.getByTestId("challenge-summary-corrected-mistakes-card")).toHaveAttribute("data-performance-tone", "excellent");
        expect(screen.getByTestId("challenge-summary-retry-action")).toBeInTheDocument();
        expect(screen.getByTestId("challenge-summary-world-map-action")).toHaveAttribute("href", "/world-map");
        expect(screen.queryByTestId("challenge-summary-next-topic-action")).not.toBeInTheDocument();
    }, 30000);
});
