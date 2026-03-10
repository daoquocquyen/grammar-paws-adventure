import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import ChallengePage from "../../app/challenge/page";

const resolveCurrentQuestionCorrectly = async () => {
    const metadata = screen.getByTestId("challenge-selection-metadata");
    const correctAnswer = (metadata.getAttribute("data-current-correct-answer") || "").trim().toLowerCase();
    const optionButtons = within(screen.getByTestId("challenge-answer-options")).getAllByRole("button");
    const correctButton = optionButtons.find((button) => (button.textContent || "").trim().toLowerCase() === correctAnswer);

    if (!correctButton) {
        throw new Error("Could not find correct option button");
    }

    fireEvent.click(correctButton);

    const primaryAction = screen.getByTestId("challenge-primary-action");
    await waitFor(() => expect(primaryAction).toBeEnabled());
    fireEvent.click(primaryAction);
};

describe("Story 3.4 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
    });

    afterEach(() => {
        cleanup();
    });

    it("shows base-only summary totals and keeps persistence idempotent across summary rerender", async () => {
        const renderResult = render(<ChallengePage />);

        for (let index = 0; index < 9; index += 1) {
            await resolveCurrentQuestionCorrectly();
        }

        await waitFor(() => expect(screen.getByTestId("challenge-summary")).toBeInTheDocument());
        expect(screen.getByTestId("challenge-summary-total-xp")).toHaveTextContent("90");
        expect(screen.getByTestId("challenge-summary-max-xp")).toHaveTextContent("90");
        expect(screen.queryByText("Base XP")).not.toBeInTheDocument();
        expect(screen.queryByTestId("challenge-summary-bonus-xp")).not.toBeInTheDocument();
        expect(screen.queryByTestId("challenge-summary-bonus-list")).not.toBeInTheDocument();

        const beforeRerender = JSON.parse(window.localStorage.getItem("gpa_player_progress_v1") || "{}");
        const beforeTotalXp = beforeRerender.totalXp;

        renderResult.rerender(<ChallengePage />);

        const afterRerender = JSON.parse(window.localStorage.getItem("gpa_player_progress_v1") || "{}");
        expect(afterRerender.totalXp).toBe(beforeTotalXp);
    }, 15000);
});
