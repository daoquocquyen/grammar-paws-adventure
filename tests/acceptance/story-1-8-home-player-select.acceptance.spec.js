import { expect, test } from "@playwright/test";

test.describe("Story 1.8 acceptance", () => {
    test("redirects to onboarding when no saved users exist", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL(/\/onboarding$/);
    });

    test("shows existing users with detailed profile info and routes new user to onboarding", async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem(
                "gpa_player_profiles_v1",
                JSON.stringify({
                    version: 1,
                    profiles: [
                        {
                            version: 1,
                            playerId: "nova",
                            name: "Nova",
                            heroId: "hero-girl-2",
                            heroName: "Zuri",
                            heroImage: "/heros/zuri.png",
                            petName: "Calico Cat",
                            petImage: "/companions/calico-cat.png",
                            lastPlayedAt: "2026-03-12T08:00:00.000Z",
                        },
                    ],
                })
            );
            window.localStorage.setItem(
                "gpa_player_progress_v1__player__nova",
                JSON.stringify({
                    version: 1,
                    completedTopics: ["nouns", "pronouns"],
                    topicProgress: {
                        nouns: { percent: 100 },
                        pronouns: { percent: 82 },
                    },
                })
            );
        });

        await page.goto("/");

        await expect(page.getByRole("heading", { name: "Choose Your Adventurer" })).toBeVisible();
        await expect(page.getByRole("button", { name: /Nova/i })).toBeVisible();
        await expect(page.getByText("Hero: Zuri")).toBeVisible();
        await expect(page.getByText("Companion: Calico Cat")).toBeVisible();
        await expect(page.getByText("Active Topic: Verbs")).toBeVisible();
        await expect(page.getByText("Completed Topics: 2")).toBeVisible();

        await page.getByRole("button", { name: "New Adventurer" }).first().click();
        await expect(page).toHaveURL(/\/onboarding$/);
    });

    test("selecting existing user routes to world map", async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem(
                "gpa_player_profiles_v1",
                JSON.stringify({
                    version: 1,
                    profiles: [
                        {
                            version: 1,
                            playerId: "nova",
                            name: "Nova",
                            heroId: "hero-girl-2",
                            heroName: "Zuri",
                            heroImage: "/heros/zuri.png",
                            petName: "Calico Cat",
                            petImage: "/companions/calico-cat.png",
                            lastPlayedAt: "2026-03-12T08:00:00.000Z",
                        },
                    ],
                })
            );
        });

        await page.goto("/");
        await page.getByRole("button", { name: /Nova/i }).click();
        await expect(page).toHaveURL(/\/world-map$/, { timeout: 20_000 });
    });
});
