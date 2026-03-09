import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import WorldMapPage from "../../app/world-map/page";

const getTopicCard = (topicTitle) => {
    const topicHeading = screen.getByRole("heading", { name: topicTitle });
    return topicHeading.closest("article");
};

describe("Story 1.4 unit", () => {
    afterEach(() => {
        cleanup();
    });

    it("stores selected topic and routes to topic-intro", () => {
        window.localStorage.clear();
        pushMock.mockReset();
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Mia", heroName: "Mia", petName: "Golden Retriever" })
        );

        render(<WorldMapPage />);

        fireEvent.click(screen.getAllByRole("button", { name: "Start Topic" })[0]);

        expect(window.localStorage.getItem("gpa_selected_topic_v1")).toBeTruthy();
        expect(pushMock).toHaveBeenCalledWith("/topic-intro");
    });

    it("keeps challenge 5 locked until challenge 4 is passed", () => {
        window.localStorage.clear();
        pushMock.mockReset();
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Mia", heroName: "Mia", petName: "Golden Retriever" })
        );
        window.localStorage.setItem(
            "gpa_player_progress_v1",
            JSON.stringify({
                version: 1,
                totalXp: 1200,
                completedTopics: ["nouns", "pronouns", "verbs"],
                topicProgress: {
                    articles: 70,
                },
            })
        );

        render(<WorldMapPage />);

        const adjectivesCard = getTopicCard("Adjectives");
        expect(adjectivesCard).toBeTruthy();
        expect(within(adjectivesCard).getByText("LOCKED")).toBeInTheDocument();
    });

    it("unlocks challenge 5 after challenge 4 is passed", () => {
        window.localStorage.clear();
        pushMock.mockReset();
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Mia", heroName: "Mia", petName: "Golden Retriever" })
        );
        window.localStorage.setItem(
            "gpa_player_progress_v1",
            JSON.stringify({
                version: 1,
                completedTopics: ["nouns", "pronouns", "verbs", "articles"],
                topicProgress: {
                    articles: 80,
                },
            })
        );

        render(<WorldMapPage />);

        const adjectivesCard = getTopicCard("Adjectives");
        expect(adjectivesCard).toBeTruthy();
        expect(within(adjectivesCard).getByText("IN PROGRESS")).toBeInTheDocument();
    });
});
