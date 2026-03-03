import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/page";

describe("Screen 1 onboarding integration", () => {
    beforeEach(() => {
        pushMock.mockReset();
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("shows validation messages and blocks navigation when name and pet are missing", () => {
        render(<Home />);

        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        expect(screen.getByText("Please enter your name so your pet can cheer for you!")).toBeInTheDocument();
        expect(screen.getByText("Please choose one companion before you start.")).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it("navigates to screen 2 when name and pet are provided", () => {
        render(<Home />);

        fireEvent.change(screen.getByLabelText("Enter your hero name"), { target: { value: "Mia" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Brave Puppy" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        expect(pushMock).toHaveBeenCalledWith("/screen2-world-map-topic-selection");
    });

    it("persists a versioned player profile before navigation", () => {
        render(<Home />);

        fireEvent.change(screen.getByLabelText("Enter your hero name"), { target: { value: "Mia" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Brave Puppy" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        const rawProfile = window.localStorage.getItem("gpa_player_profile_v1");
        const parsedProfile = rawProfile ? JSON.parse(rawProfile) : null;

        expect(parsedProfile).toEqual(
            expect.objectContaining({
                version: 1,
                name: "Mia",
                petName: "Brave Puppy",
            })
        );
        expect(pushMock).toHaveBeenCalledWith("/screen2-world-map-topic-selection");
    });

    it("hydrates name and selected pet from stored versioned profile", () => {
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Nova", petName: "Wise Kitten" })
        );

        render(<Home />);

        expect(screen.getByLabelText("Enter your hero name")).toHaveValue("Nova");
        expect(screen.getAllByRole("button", { name: "Wise Kitten" })[0]).toHaveAttribute("aria-pressed", "true");
    });

    it("fails safely when localStorage profile payload is malformed", () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
        window.localStorage.setItem("gpa_player_profile_v1", "{bad json");

        render(<Home />);

        expect(screen.getByLabelText("Enter your hero name")).toHaveValue("");
        expect(screen.getAllByRole("button", { name: "Wise Kitten" })[0]).toHaveAttribute("aria-pressed", "false");

        consoleErrorSpy.mockRestore();
    });
});
