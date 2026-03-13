import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/onboarding/page";

describe("Story 1.3 integration", () => {
    beforeEach(() => {
        pushMock.mockReset();
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("initializes progress and accessory keys on valid start", () => {
        render(<Home />);

        fireEvent.change(screen.getByLabelText("Enter your hero name"), { target: { value: "Mia" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Mia" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Golden Retriever" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        expect(JSON.parse(window.localStorage.getItem("gpa_player_progress_v1"))).toEqual({
            version: 1,
            completedTopics: [],
            topicProgress: {},
        });
        expect(JSON.parse(window.localStorage.getItem("gpa_pet_accessories_v1"))).toEqual({
            version: 1,
            unlockedAccessoryIds: [],
            equippedAccessoryId: null,
        });
    });

    it("scopes progress state to the active user when switching names", () => {
        const alexProgress = {
            version: 1,
            completedTopics: ["verbs"],
            topicProgress: { verbs: 100 },
            totalXp: 120,
        };
        const alexAccessories = {
            version: 1,
            unlockedAccessoryIds: ["cap-red"],
            equippedAccessoryId: "cap-red",
        };

        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({
                version: 1,
                playerId: "alex",
                name: "Alex",
                heroId: "hero-girl-1",
                heroName: "Mia",
                petName: "Golden Retriever",
            })
        );
        window.localStorage.setItem("gpa_player_progress_v1__player__alex", JSON.stringify(alexProgress));
        window.localStorage.setItem("gpa_pet_accessories_v1__player__alex", JSON.stringify(alexAccessories));
        window.localStorage.setItem("gpa_player_progress_v1", JSON.stringify(alexProgress));
        window.localStorage.setItem("gpa_pet_accessories_v1", JSON.stringify(alexAccessories));

        render(<Home />);

        fireEvent.change(screen.getByLabelText("Enter your hero name"), { target: { value: "Luna" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        const newProfile = JSON.parse(window.localStorage.getItem("gpa_player_profile_v1"));
        expect(newProfile.playerId).toBe("luna");
        expect(newProfile.name).toBe("Luna");

        expect(JSON.parse(window.localStorage.getItem("gpa_player_progress_v1__player__luna"))).toEqual({
            version: 1,
            completedTopics: [],
            topicProgress: {},
        });
        expect(JSON.parse(window.localStorage.getItem("gpa_pet_accessories_v1__player__luna"))).toEqual({
            version: 1,
            unlockedAccessoryIds: [],
            equippedAccessoryId: null,
        });

        expect(JSON.parse(window.localStorage.getItem("gpa_player_progress_v1__player__alex"))).toEqual(alexProgress);
        expect(JSON.parse(window.localStorage.getItem("gpa_pet_accessories_v1__player__alex"))).toEqual(alexAccessories);
    });
});
