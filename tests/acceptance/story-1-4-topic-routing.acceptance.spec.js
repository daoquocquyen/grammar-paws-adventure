import { expect, test } from "@playwright/test";

test.describe("Story 1.4 acceptance", () => {
    test("routes from world map to topic intro and persists selected topic", async ({ page }) => {
        await page.goto("/onboarding");

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

    test("renders mastery from topic XP snapshot with range-based wording", async ({ page }) => {
        await page.goto("/onboarding");

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
                JSON.stringify({
                    version: 1,
                    completedTopics: ["nouns"],
                    topicProgress: {
                        nouns: {
                            earnedBaseXp: 72,
                            maxBaseXp: 90,
                            percent: 100,
                        },
                        pronouns: {
                            earnedBaseXp: 38,
                            maxBaseXp: 90,
                        },
                    },
                })
            );
        });

        await page.goto("/world-map");

        const nounsCard = page.locator("article").filter({
            has: page.getByRole("heading", { name: "Nouns" }),
        }).first();

        await expect(nounsCard.getByText("80%")).toBeVisible();
        await expect(nounsCard.getByText("72/90 XP")).toHaveCount(0);
        await expect(nounsCard.getByText("STRONG")).toBeVisible();
        await expect(page.getByText("38/90 XP")).toHaveCount(0);
    });
});
