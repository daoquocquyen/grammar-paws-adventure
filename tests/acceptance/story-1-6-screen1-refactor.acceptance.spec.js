import { expect, test } from "@playwright/test";

test.describe("Story 1.6 acceptance", () => {
    test("keeps Screen 1 sections and valid start flow intact", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByRole("heading", { name: "Your name" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Your Hero" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Your Companion" })).toBeVisible();

        await page.getByLabel("Enter your hero name").fill("Mia");
        await page.getByRole("button", { name: "Mia" }).first().click();
        await page.getByRole("button", { name: "Golden Retriever" }).first().click();
        await page.getByRole("button", { name: "Start Adventure" }).first().click();

        await expect(page).toHaveURL(/\/world-map$/, { timeout: 20_000 });
    });
});
