import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import ChallengePage from "../../app/challenge/page";

describe("Story 2.5 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
    });

    afterEach(() => {
        cleanup();
    });

    it("renders indicator mapping and micro-interaction state transitions without punitive UI", async () => {
        render(<ChallengePage />);

        const metadata = screen.getByTestId("challenge-selection-metadata");
        const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();
        const primaryAction = screen.getByTestId("challenge-primary-action");
        const answerButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const firstWrongButton = answerButtons.find(
            (button) => (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!firstWrongButton) {
            throw new Error("Missing wrong option");
        }

        fireEvent.click(firstWrongButton);

        await waitFor(() => expect(primaryAction).toHaveTextContent("Continue"));
        expect(primaryAction).toBeDisabled();

        expect(firstWrongButton).toHaveAttribute("data-option-state", "wrong");

        await waitFor(() => {
            const buttons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
            const enabledCorrectButton = buttons.find(
                (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() === correctAnswer
            );
            expect(enabledCorrectButton).toBeDefined();
        });

        const retryButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const correctButton = retryButtons.find(
            (button) => !button.disabled && (button.textContent || "").trim().toLowerCase() === correctAnswer
        );
        if (!correctButton) {
            throw new Error("Missing enabled correct option in retry");
        }

        fireEvent.click(correctButton);
        await waitFor(() => expect(primaryAction).toHaveTextContent("Continue"));
        await waitFor(() => expect(primaryAction).toBeEnabled());
        await waitFor(() =>
            expect(screen.getByTestId("challenge-pet-message")).toHaveTextContent("+6 XP! You fixed it!")
        );

        expect(correctButton).toHaveAttribute("data-option-state", "correct");
        expect(screen.getByTestId("challenge-indicator-0")).toHaveAttribute("data-indicator-type", "HOLLOW_STAR");
        expect(screen.queryByTestId("challenge-xp-message")).not.toBeInTheDocument();

        expect(screen.queryByText(/Wrong/i)).not.toBeInTheDocument();
    });

    it("bounces back when a wrong option is dragged into the blank", async () => {
        render(<ChallengePage />);

        const metadata = screen.getByTestId("challenge-selection-metadata");
        const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();

        const optionButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const wrongButton = optionButtons.find(
            (button) => (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!wrongButton) {
            throw new Error("Missing wrong option for drag test");
        }

        const blank = screen.getByTestId("challenge-blank");
        const rectSpy = vi.spyOn(blank, "getBoundingClientRect").mockReturnValue({
            x: 100,
            y: 100,
            width: 220,
            height: 80,
            top: 100,
            left: 100,
            right: 320,
            bottom: 180,
            toJSON: () => ({}),
        });

        fireEvent.mouseDown(wrongButton, {
            button: 0,
            clientX: 10,
            clientY: 10,
        });
        fireEvent.mouseMove(window, {
            clientX: 140,
            clientY: 130,
        });

        fireEvent.mouseUp(window, {
            clientX: 140,
            clientY: 130,
        });

        const wrongButtonText = (wrongButton.textContent || "").trim();
        await waitFor(() => expect(blank).toHaveAttribute("data-blank-state", "wrong-feedback"));
        expect(screen.getByTestId("challenge-blank")).toHaveTextContent("_______");

        const primaryAction = screen.getByTestId("challenge-primary-action");
        expect(primaryAction).toHaveTextContent("Continue");
        expect(primaryAction).toBeDisabled();

        await waitFor(() => {
            const currentWrongButton = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button")
                .find((button) => (button.textContent || "").trim() === wrongButtonText);
            expect(currentWrongButton).toBeDefined();
            expect(currentWrongButton).toHaveAttribute("data-option-state", "wrong");
            expect(currentWrongButton).toBeDisabled();
        });

        const optionButtonsAfterDrop = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        expect((optionButtonsAfterDrop[optionButtonsAfterDrop.length - 1].textContent || "").trim()).toBe(
            wrongButtonText
        );

        rectSpy.mockRestore();
    });

    it("keeps dragged correct option in the blank and removes it from answer options", async () => {
        render(<ChallengePage />);

        const metadata = screen.getByTestId("challenge-selection-metadata");
        const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();

        const initialButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const initialOptionCount = initialButtons.length;
        const correctButton = initialButtons.find(
            (button) => (button.textContent || "").trim().toLowerCase() === correctAnswer
        );
        if (!correctButton) {
            throw new Error("Missing correct option for drag test");
        }

        const blank = screen.getByTestId("challenge-blank");
        const rectSpy = vi.spyOn(blank, "getBoundingClientRect").mockReturnValue({
            x: 100,
            y: 100,
            width: 220,
            height: 80,
            top: 100,
            left: 100,
            right: 320,
            bottom: 180,
            toJSON: () => ({}),
        });

        fireEvent.mouseDown(correctButton, {
            button: 0,
            clientX: 10,
            clientY: 10,
        });
        fireEvent.mouseMove(window, {
            clientX: 140,
            clientY: 130,
        });
        fireEvent.mouseUp(window, {
            clientX: 140,
            clientY: 130,
        });

        await waitFor(() => expect(blank).toHaveAttribute("data-blank-state", "filled-correct"));
        expect(blank).toHaveTextContent(correctAnswer);

        const optionButtonsAfterDrop = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const renderedOptionsText = optionButtonsAfterDrop.map((button) => (button.textContent || "").trim().toLowerCase());
        expect(renderedOptionsText).not.toContain(correctAnswer);
        expect(optionButtonsAfterDrop).toHaveLength(initialOptionCount - 1);

        rectSpy.mockRestore();
    });

    it("does not check answer when drag is released outside the blank drop zone", async () => {
        render(<ChallengePage />);

        const metadata = screen.getByTestId("challenge-selection-metadata");
        const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();

        const optionButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
        const wrongButton = optionButtons.find(
            (button) => (button.textContent || "").trim().toLowerCase() !== correctAnswer
        );
        if (!wrongButton) {
            throw new Error("Missing wrong option for outside-drop test");
        }

        const blank = screen.getByTestId("challenge-blank");
        const rectSpy = vi.spyOn(blank, "getBoundingClientRect").mockReturnValue({
            x: 100,
            y: 100,
            width: 220,
            height: 80,
            top: 100,
            left: 100,
            right: 320,
            bottom: 180,
            toJSON: () => ({}),
        });

        fireEvent.mouseDown(wrongButton, {
            button: 0,
            clientX: 10,
            clientY: 10,
        });
        fireEvent.mouseMove(window, {
            clientX: 70,
            clientY: 70,
        });
        fireEvent.mouseUp(window, {
            clientX: 70,
            clientY: 70,
        });

        const primaryAction = screen.getByTestId("challenge-primary-action");
        expect(primaryAction).toHaveAttribute("data-phase", "ready");
        expect(primaryAction).toBeDisabled();
        expect(blank).toHaveAttribute("data-blank-state", "idle");
        expect(wrongButton).toHaveAttribute("data-option-state", "idle");
        expect(wrongButton).toBeEnabled();

        rectSpy.mockRestore();
    });
});
