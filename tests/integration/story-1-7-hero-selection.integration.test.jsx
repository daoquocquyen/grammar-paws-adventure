import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/page";

describe("Story 1.7 integration", () => {
    beforeEach(() => {
        pushMock.mockReset();
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders 8 hero options and requires hero selection", () => {
        render(<Home />);

        const heroNames = ["Mia", "Leo", "Zuri", "Kenji", "Lyly", "Toby", "Sofia", "Matheus"];
        const heroButtons = heroNames.map((heroName) => screen.getAllByRole("button", { name: heroName })[0]);
        expect(heroButtons).toHaveLength(8);

        fireEvent.change(screen.getByLabelText("Enter your hero name"), { target: { value: "Mia" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Golden Retriever" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "Start Adventure" })[0]);

        expect(document.getElementById("heroValidationMessage")).toHaveTextContent("Please choose one 3D hero before you start.");
        expect(pushMock).not.toHaveBeenCalled();
    });
});
