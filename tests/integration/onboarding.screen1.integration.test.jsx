import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
});
