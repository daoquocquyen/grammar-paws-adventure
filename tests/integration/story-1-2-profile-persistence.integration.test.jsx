import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/page";

describe("Story 1.2 integration", () => {
    beforeEach(() => {
        pushMock.mockReset();
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("hydrates persisted profile into Screen 1 state", () => {
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Nova", heroId: "hero-girl-2", petName: "Calico Cat" })
        );

        render(<Home />);

        expect(screen.getByLabelText("Enter your hero name")).toHaveValue("Nova");
        expect(screen.getAllByRole("button", { name: "Zuri" })[0]).toHaveAttribute("aria-pressed", "true");
        expect(screen.getAllByRole("button", { name: "Calico Cat" })[0]).toHaveAttribute("aria-pressed", "true");
    });
});
