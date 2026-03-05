import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import WorldMapPage from "../../app/world-map/page";

describe("Story 1.4 unit", () => {
    it("stores selected topic and routes to topic-intro", () => {
        window.localStorage.clear();
        pushMock.mockReset();
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Mia", heroName: "Mia", petName: "Golden Retriever" })
        );

        render(<WorldMapPage />);

        fireEvent.click(screen.getAllByRole("button", { name: "Start Topic" })[0]);

        expect(window.localStorage.getItem("gpa_selected_topic_v1")).toBeTruthy();
        expect(pushMock).toHaveBeenCalledWith("/topic-intro");
    });
});
