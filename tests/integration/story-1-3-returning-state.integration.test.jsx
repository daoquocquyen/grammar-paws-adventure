import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/page";

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
});
