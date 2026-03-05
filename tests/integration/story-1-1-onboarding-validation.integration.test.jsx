import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/page";

describe("Story 1.1 integration", () => {
    beforeEach(() => {
        pushMock.mockReset();
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("shows inline validation and blocks navigation when fields are missing", () => {
        render(<Home />);

        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        expect(screen.getByText("Please enter your name so your pet can cheer for you!")).toBeInTheDocument();
        expect(screen.getByText("Please choose one 3D hero before you start.")).toBeInTheDocument();
        expect(screen.getByText("Please choose one companion before you start.")).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });
});
