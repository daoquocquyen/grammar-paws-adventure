import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}));

import ChallengePage from "../../app/challenge/page";

describe("Story 2.2 integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders challenge metadata that avoids recent question IDs when sufficient pool exists", () => {
        window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
        window.localStorage.setItem(
            "gpa_topic_attempt_history_v1",
            JSON.stringify({
                nouns: [
                    {
                        questionIds: [
                            "nouns::common::q1",
                            "nouns::proper::q1",
                            "nouns::plurality::q1",
                        ],
                        createdAt: "2026-03-05T00:00:00.000Z",
                    },
                    {
                        questionIds: [
                            "nouns::common::q2",
                            "nouns::proper::q2",
                            "nouns::plurality::q2",
                        ],
                        createdAt: "2026-03-05T00:00:01.000Z",
                    },
                ],
            })
        );

        render(<ChallengePage />);

        const cooldownMetadata = screen.getByText(/Cooldown window:/i);
        const selectedQuestionIds = (cooldownMetadata.getAttribute("data-selected-question-ids") ?? "").split(",").filter(Boolean);

        expect(cooldownMetadata).toHaveAttribute("data-question-count", "9");
        expect(selectedQuestionIds).toHaveLength(9);
        expect(selectedQuestionIds).not.toContain("nouns::common::q1");
        expect(selectedQuestionIds).not.toContain("nouns::proper::q1");
        expect(selectedQuestionIds).not.toContain("nouns::plurality::q1");
        expect(selectedQuestionIds).not.toContain("nouns::common::q2");
        expect(selectedQuestionIds).not.toContain("nouns::proper::q2");
        expect(selectedQuestionIds).not.toContain("nouns::plurality::q2");
    });
});