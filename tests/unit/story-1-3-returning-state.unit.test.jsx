import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import Home from "../../app/onboarding/page";

describe("Story 1.3 unit", () => {
    it("repairs malformed progress and accessories payloads", () => {
        window.localStorage.clear();
        window.localStorage.setItem(
            "gpa_player_profile_v1",
            JSON.stringify({ version: 1, name: "Nova", heroId: "hero-girl-2", petName: "Calico Cat" })
        );
        window.localStorage.setItem("gpa_player_progress_v1", "{bad json");
        window.localStorage.setItem("gpa_pet_accessories_v1", "{bad json");

        render(<Home />);

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
