import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const replaceMock = vi.fn();
const routerMock = { push: pushMock, replace: replaceMock };

vi.mock("next/navigation", () => ({
    useRouter: () => routerMock,
}));

import HomePage from "../../app/page";

describe("Story 1.8 integration", () => {
    beforeEach(() => {
        pushMock.mockReset();
        replaceMock.mockReset();
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("redirects to onboarding when no saved learners exist", () => {
        render(<HomePage />);

        expect(replaceMock).toHaveBeenCalledWith("/onboarding");
    });

    it("continues as selected existing learner and routes to world map", () => {
        window.localStorage.setItem(
            "gpa_player_profiles_v1",
            JSON.stringify({
                version: 1,
                profiles: [
                    {
                        version: 1,
                        playerId: "nova",
                        name: "Nova",
                        heroId: "hero-girl-2",
                        heroName: "Zuri",
                        heroImage: "/heros/zuri.png",
                        petName: "Calico Cat",
                        petImage: "/companions/calico-cat.png",
                        lastPlayedAt: "2026-03-12T08:00:00.000Z",
                    },
                ],
            })
        );
        window.localStorage.setItem(
            "gpa_player_progress_v1__player__nova",
            JSON.stringify({
                version: 1,
                completedTopics: ["nouns", "pronouns"],
                topicProgress: {
                    nouns: { percent: 100 },
                    pronouns: { percent: 82 },
                },
            })
        );

        render(<HomePage />);

        expect(replaceMock).not.toHaveBeenCalled();
        expect(screen.getByText("Hero: Zuri")).toBeInTheDocument();
        expect(screen.getByText("Companion: Calico Cat")).toBeInTheDocument();
        expect(screen.getByText("Active Topic: Verbs")).toBeInTheDocument();
        expect(screen.getByText("Completed Topics: 2")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /Nova/i }));

        expect(pushMock).toHaveBeenCalledWith("/world-map");
        const activeProfile = JSON.parse(window.localStorage.getItem("gpa_player_profile_v1"));
        expect(activeProfile).toEqual(expect.objectContaining({ playerId: "nova", name: "Nova" }));
        expect(JSON.parse(window.localStorage.getItem("gpa_player_progress_v1__player__nova"))).toEqual({
            version: 1,
            completedTopics: ["nouns", "pronouns"],
            topicProgress: {
                nouns: { percent: 100 },
                pronouns: { percent: 82 },
            },
        });
    });

    it("shows active topic as the last unlocked topic", () => {
        window.localStorage.setItem(
            "gpa_player_profiles_v1",
            JSON.stringify({
                version: 1,
                profiles: [
                    {
                        version: 1,
                        playerId: "nova",
                        name: "Nova",
                        heroId: "hero-girl-2",
                        heroName: "Zuri",
                        heroImage: "/heros/zuri.png",
                        petName: "Calico Cat",
                        petImage: "/companions/calico-cat.png",
                        lastPlayedAt: "2026-03-12T08:00:00.000Z",
                    },
                ],
            })
        );
        window.localStorage.setItem(
            "gpa_player_progress_v1__player__nova",
            JSON.stringify({
                version: 1,
                completedTopics: [
                    "nouns",
                    "pronouns",
                    "verbs",
                    "articles",
                    "adjectives",
                    "prepositions",
                    "adverbs",
                    "conjunctions",
                    "sentence-structure",
                    "punctuation",
                    "tenses",
                ],
                topicProgress: {},
            })
        );

        render(<HomePage />);

        expect(screen.getByText("Active Topic: Tenses")).toBeInTheDocument();
    });
});
