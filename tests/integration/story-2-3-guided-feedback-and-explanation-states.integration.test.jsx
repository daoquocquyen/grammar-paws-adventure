import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import ChallengePage from "../../app/challenge/page";

describe("Story 2.3 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
    });

    afterEach(() => {
        cleanup();
    });

    it("runs hint -> guided retry -> third wrong locks question and enables next", async () => {
        render(<ChallengePage />);

        expect(screen.getByTestId("challenge-hero-message").textContent).toContain("Hint");

        const metadata = screen.getByTestId("challenge-selection-metadata");
        const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();
        const answerZone = screen.getByTestId("challenge-answer-options");
        const answerButtons = within(answerZone).getAllByRole("button");
        const firstWrongButton = answerButtons.find(
            (button) => (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!firstWrongButton) {
            throw new Error("Missing wrong option for first attempt");
        }

        fireEvent.click(firstWrongButton);

        const primaryAction = screen.getByTestId("challenge-primary-action");
        expect(primaryAction).toHaveTextContent("Next");
        expect(primaryAction).toBeDisabled();

        await waitFor(() => {
            const buttons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
            const enabledWrongButton = buttons.find(
                (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() !== correctAnswer
            );
            expect(enabledWrongButton).toBeDefined();
        });

        const secondStateButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const secondWrongButton = secondStateButtons.find(
            (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!secondWrongButton) {
            throw new Error("Missing wrong option for second attempt");
        }
        fireEvent.click(secondWrongButton);

        expect(primaryAction).toHaveTextContent("Next");
        expect(primaryAction).toBeDisabled();
        await waitFor(() =>
            expect((screen.getByTestId("challenge-hero-message").textContent ?? "").toLowerCase()).toContain(
                `"${correctAnswer}"`
            )
        );
        expect(screen.getByTestId("challenge-blank")).toHaveTextContent("_______");
        expect(screen.queryByTestId("challenge-xp-message")).not.toBeInTheDocument();

        await waitFor(() => {
            const buttons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
            const enabledWrongButton = buttons.find(
                (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() !== correctAnswer
            );
            expect(enabledWrongButton).toBeDefined();
        });

        const coachedButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const thirdWrongButton = coachedButtons.find(
            (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!thirdWrongButton) {
            throw new Error("Missing wrong option for coached retry attempt");
        }

        fireEvent.click(thirdWrongButton);

        await waitFor(() =>
            expect(screen.getByTestId("challenge-pet-message").textContent?.toLowerCase() || "").toContain(
                "tap next"
            )
        );
        expect(screen.getByTestId("challenge-progress-text")).toHaveTextContent("1/9");
        expect(primaryAction).toBeEnabled();
        const lockedButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        lockedButtons.forEach((button) => expect(button).toBeDisabled());
    });
});
