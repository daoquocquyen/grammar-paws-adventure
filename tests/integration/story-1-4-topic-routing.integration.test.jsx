import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import WorldMapPage from "../../app/world-map/page";

const getTopicCard = (topicTitle) => {
    const topicHeading = screen.getByRole("heading", { name: topicTitle });
    return topicHeading.closest("article");
};

describe("Story 1.4 integration", () => {
    beforeEach(() => {
        pushMock.mockReset();
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("persists selected topic and routes intro-first", () => {
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Mia", heroName: "Mia", petName: "Golden Retriever" })
        );

        render(<WorldMapPage />);

        fireEvent.click(screen.getAllByRole("button", { name: "Start Topic" })[0]);

        expect(window.localStorage.getItem("gpa_selected_topic_v1")).toBeTruthy();
        expect(pushMock).toHaveBeenCalledWith("/topic-intro");
    });

    it("shows world-map mastery percent from topic XP snapshots", () => {
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Mia", heroName: "Mia", petName: "Golden Retriever" })
        );
        window.localStorage.setItem(
            "gpa_player_progress_v1",
            JSON.stringify({
                version: 1,
                completedTopics: ["nouns"],
                topicProgress: {
                    nouns: { earnedBaseXp: 72, maxBaseXp: 90, percent: 100 },
                    pronouns: { earnedBaseXp: 38, maxBaseXp: 90 },
                },
            })
        );

        render(<WorldMapPage />);

        const nounsCard = getTopicCard("Nouns");
        expect(nounsCard).toBeTruthy();
        expect(within(nounsCard).getByText("80%")).toBeInTheDocument();
        expect(within(nounsCard).queryByText("72/90 XP")).not.toBeInTheDocument();
        expect(within(nounsCard).getByText("STRONG")).toBeInTheDocument();

        const pronounsCard = getTopicCard("Pronouns");
        expect(pronounsCard).toBeTruthy();
        expect(within(pronounsCard).getByText("42%")).toBeInTheDocument();
        expect(within(pronounsCard).queryByText("38/90 XP")).not.toBeInTheDocument();
    });
});
