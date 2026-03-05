import { expect, test } from "@playwright/test";

test.describe("Story 1.4 acceptance", () => {
    test("routes from world map to topic intro and persists selected topic", async ({ page }) => {
        await page.goto("/");

        await page.evaluate(() => {
            window.localStorage.setItem(
                "gpa_player_profile_v1",
                JSON.stringify({
                    version: 1,
                    name: "Mia",
                    heroId: "hero-girl-1",
                    heroName: "Mia",
                    heroModelType: "3d",
                    petName: "Golden Retriever",
                    petImage: "/companions/golden-retriever.png",
                })
            );
            window.localStorage.setItem(
                "gpa_player_progress_v1",
                JSON.stringify({ version: 1, completedTopics: [], topicProgress: {} })
            );
        });

        await page.goto("/world-map");
        await page.getByRole("button", { name: /^Start Topic$/ }).first().click();

        await expect(page).toHaveURL(/\/topic-intro$/, { timeout: 20_000 });
        const selectedTopic = await page.evaluate(() => window.localStorage.getItem("gpa_selected_topic_v1"));
        expect(selectedTopic).toBeTruthy();
    });
});
