import { expect, test } from "@playwright/test";

test.describe("Story 1.5 acceptance", () => {
    test("shows safe topic-intro error state for unknown selected topic", async ({ page }) => {
        await page.goto("/");

        await page.evaluate(() => {
            window.localStorage.setItem("gpa_selected_topic_v1", "unknown-topic-key");
        });

        await page.goto("/topic-intro");

        await expect(page.getByRole("heading", { name: "We couldn't load this topic." })).toBeVisible();
        await expect(page.getByRole("link", { name: "Back to Map" })).toHaveAttribute("href", "/world-map");
    });
});
