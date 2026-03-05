import { expect, test } from "@playwright/test";

test.describe("Story 1.3 acceptance", () => {
    test("initializes progress and accessories storage on valid start", async ({ page }) => {
        await page.goto("/");

        await page.getByLabel("Enter your hero name").fill("Mia");
        await page.getByRole("button", { name: "Mia" }).first().click();
        await page.getByRole("button", { name: "Golden Retriever" }).first().click();
        await page.getByRole("button", { name: "Start Adventure" }).first().click();

        await page.waitForURL(/\/world-map$/, { timeout: 20_000 });

        const state = await page.evaluate(() => ({
            progress: JSON.parse(window.localStorage.getItem("gpa_player_progress_v1")),
            accessories: JSON.parse(window.localStorage.getItem("gpa_pet_accessories_v1")),
        }));

        expect(state.progress).toEqual({ version: 1, completedTopics: [], topicProgress: {} });
        expect(state.accessories).toEqual({ version: 1, unlockedAccessoryIds: [], equippedAccessoryId: null });
    });
});
