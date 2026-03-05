import { expect, test } from "@playwright/test";

test.describe("Story 2.2 acceptance", () => {
    test("produces a different question set on consecutive retries for same topic", async ({ page }) => {
        await page.goto("/");

        await page.evaluate(() => {
            window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
            window.localStorage.removeItem("gpa_topic_attempt_history_v1");
        });

        await page.goto("/challenge");

        const metadata = page.getByTestId("challenge-selection-metadata");
        await expect(metadata).toHaveAttribute("data-question-count", "9");

        const firstQuestionIds = ((await metadata.getAttribute("data-selected-question-ids")) ?? "")
            .split(",")
            .filter(Boolean);

        await page.reload();

        const secondMetadata = page.getByTestId("challenge-selection-metadata");
        const secondQuestionIds = ((await secondMetadata.getAttribute("data-selected-question-ids")) ?? "")
            .split(",")
            .filter(Boolean);

        expect(firstQuestionIds).toHaveLength(9);
        expect(secondQuestionIds).toHaveLength(9);
        expect(secondQuestionIds.join(",")).not.toBe(firstQuestionIds.join(","));
    });
});
