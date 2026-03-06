import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import ChallengePage from "../../app/challenge/page";

describe("Story 3.2 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
    });

    afterEach(() => {
        cleanup();
    });

    it("enforces two-attempt flow with disabled retry option and coached third-attempt retry state", async () => {
        render(<ChallengePage />);

        const metadata = screen.getByTestId("challenge-selection-metadata");
        const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();
        const primaryAction = screen.getByTestId("challenge-primary-action");

        const firstButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const firstWrongButton = firstButtons.find(
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
            buttons.forEach((button) => expect(button).toBeEnabled());
        });
        expect(screen.getByTestId("challenge-blank")).toHaveTextContent("_______");
        expect(screen.queryByTestId("challenge-xp-message")).not.toBeInTheDocument();

        const postAssistedButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        postAssistedButtons.forEach((button) => expect(button).toBeEnabled());

        const thirdWrongButton = postAssistedButtons.find(
            (button) => (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!thirdWrongButton) {
            throw new Error("Missing wrong option for coached retry");
        }

        fireEvent.click(thirdWrongButton);
        await waitFor(() =>
            expect(screen.getByTestId("challenge-pet-message").textContent?.toLowerCase() || "").toContain(
                "try again"
            )
        );
        expect(screen.getByTestId("challenge-progress-text")).toHaveTextContent("1/9");
        expect(screen.getByTestId("challenge-indicator-0")).toHaveAttribute("data-indicator-type", "EMPTY");
    });
});
