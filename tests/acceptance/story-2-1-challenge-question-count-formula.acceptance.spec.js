import { expect, test } from "@playwright/test";

test.describe("Story 2.1 acceptance", () => {
    test("renders challenge button metadata and routes to challenge page on click", async ({ page }) => {
        await page.goto("/onboarding");

        await page.evaluate(() => {
            window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
        });

        await page.goto("/topic-intro");

        const startChallengeButton = page.getByRole("button", { name: /Start Challenge/ });
        await expect(startChallengeButton).toBeVisible();
        await expect(startChallengeButton).toHaveAttribute("data-question-count", "9");

        await startChallengeButton.click();
        await expect(page).toHaveURL(/\/challenge$/);
    });
});
