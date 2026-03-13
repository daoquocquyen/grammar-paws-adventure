import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/onboarding/page";

describe("Story 1.6 integration", () => {
    beforeEach(() => {
        pushMock.mockReset();
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("keeps Screen 1 behavior stable after component refactor", () => {
        render(<Home />);

        expect(screen.getByRole("heading", { name: "Your name" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Your Hero" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Your Companion" })).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("Enter your hero name"), { target: { value: "Mia" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Mia" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Golden Retriever" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        expect(pushMock).toHaveBeenCalledWith("/world-map");
    });
});
