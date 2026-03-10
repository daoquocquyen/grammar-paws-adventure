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

    it("defaults focus to the latest unlocked topic card", () => {
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
                completedTopics: ["nouns", "pronouns", "verbs"],
                topicProgress: {
                    articles: 40,
                },
            })
        );

        render(<WorldMapPage />);

        expect(screen.getByText(/ready to leap into articles/i)).toBeInTheDocument();
    });

    it("auto-scrolls the carousel to reveal the latest unlocked default focus", () => {
        const clientWidthSpy = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(400);
        const scrollWidthSpy = vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(1200);
        const originalScrollTo = HTMLElement.prototype.scrollTo;
        const scrollToMock = vi.fn();
        HTMLElement.prototype.scrollTo = scrollToMock;
        try {
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
                        adjectives: 15,
                    },
                })
            );

            render(<WorldMapPage />);

            expect(screen.getByText(/ready to leap into adjectives/i)).toBeInTheDocument();
            expect(scrollToMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    left: expect.any(Number),
                    behavior: "auto",
                })
            );
            const hasPositiveScrollTarget = scrollToMock.mock.calls.some(
                ([options]) => options && typeof options.left === "number" && options.left > 0
            );
            expect(hasPositiveScrollTarget).toBe(true);
        } finally {
            HTMLElement.prototype.scrollTo = originalScrollTo;
            clientWidthSpy.mockRestore();
            scrollWidthSpy.mockRestore();
        }
    });

    it("renders mastery percent from topic XP snapshot instead of forcing 100 for completed topics", () => {
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
                completedTopics: ["nouns"],
                topicProgress: {
                    nouns: {
                        earnedBaseXp: 72,
                        maxBaseXp: 90,
                        percent: 100,
                    },
                },
            })
        );

        render(<WorldMapPage />);

        const nounsCard = getTopicCard("Nouns");
        expect(nounsCard).toBeTruthy();
        expect(within(nounsCard).getByText("80%")).toBeInTheDocument();
        expect(within(nounsCard).queryByText("72/90 XP")).not.toBeInTheDocument();
        expect(within(nounsCard).getByText("STRONG")).toBeInTheDocument();
    });

    it("uses mastery wording tiers by percent range", () => {
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
                    nouns: { earnedBaseXp: 90, maxBaseXp: 90 },
                    pronouns: { earnedBaseXp: 81, maxBaseXp: 90 },
                    verbs: { earnedBaseXp: 54, maxBaseXp: 90 },
                    articles: { earnedBaseXp: 27, maxBaseXp: 90 },
                    adjectives: { earnedBaseXp: 9, maxBaseXp: 90 },
                },
            })
        );

        render(<WorldMapPage />);

        expect(within(getTopicCard("Nouns")).getByText("MASTERED")).toBeInTheDocument();
        expect(within(getTopicCard("Pronouns")).getByText("STRONG")).toBeInTheDocument();
        expect(within(getTopicCard("Verbs")).getByText("GROWING")).toBeInTheDocument();
        expect(within(getTopicCard("Articles")).getByText("BUILDING")).toBeInTheDocument();
        expect(within(getTopicCard("Adjectives")).getByText("IN PROGRESS")).toBeInTheDocument();
        expect(within(getTopicCard("Adjectives")).queryByText("9/90 XP")).not.toBeInTheDocument();
    });
});
