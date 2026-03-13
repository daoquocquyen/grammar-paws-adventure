import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/onboarding/page";

describe("Story 1.2 unit", () => {
    it("persists versioned player profile before navigating", () => {
        window.localStorage.clear();
        pushMock.mockReset();

        render(<Home />);

        fireEvent.change(screen.getByLabelText("Enter your hero name"), { target: { value: "Mia" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Mia" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Golden Retriever" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        const profile = JSON.parse(window.localStorage.getItem("gpa_player_profile_v1"));

        expect(profile).toEqual(
            expect.objectContaining({
                version: 1,
                name: "Mia",
                heroName: "Mia",
                petName: "Golden Retriever",
            })
        );
        expect(pushMock).toHaveBeenCalledWith("/world-map");
    });
});
