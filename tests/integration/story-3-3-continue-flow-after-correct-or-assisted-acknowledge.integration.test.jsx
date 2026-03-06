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
        expect(primaryAction).toHaveTextContent("Continue");
        expect(primaryAction).toBeDisabled();

        const buttons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const firstWrongButton = buttons.find(
            (button) => (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!firstWrongButton) {
            throw new Error("Missing wrong option for first attempt");
        }

        fireEvent.click(firstWrongButton);

        await waitFor(() => expect(primaryAction).toHaveTextContent("Continue"));
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

        await waitFor(() => expect(primaryAction).toHaveTextContent("I understand"));
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

        expect(primaryAction).toHaveTextContent("I understand");
        expect(primaryAction).toBeDisabled();
        await waitFor(() => expect(primaryAction).toBeEnabled());

        fireEvent.click(primaryAction);

        expect(screen.getByTestId("challenge-progress-text")).toHaveTextContent("2/9");
        expect(screen.getByTestId("challenge-blank")).toHaveTextContent("_______");
        expect(primaryAction).toHaveTextContent("Continue");
        expect(primaryAction).toBeDisabled();
    });

    it("routes from last question to level-complete summary without off-by-one progress issues", async () => {
        render(<ChallengePage />);

        expect(screen.getByTestId("challenge-progress-text")).toHaveTextContent("1/9");
        expect(screen.getByTestId("challenge-progress-bar-fill")).toHaveStyle({ width: "0%" });

        for (let index = 0; index < 9; index += 1) {
            clickCorrectOption();
            const primaryAction = screen.getByTestId("challenge-primary-action");
            await waitFor(() => expect(primaryAction).toBeEnabled());
            fireEvent.click(primaryAction);
        }

        await waitFor(() => expect(screen.getByTestId("challenge-summary")).toBeInTheDocument());
        expect(screen.getByTestId("challenge-progress-text")).toHaveTextContent("9/9");
        expect(screen.getByTestId("challenge-progress-bar-fill")).toHaveStyle({ width: "100%" });
    }, 15000);
});
