import { expect, test } from "@playwright/test";

test.describe("Story 1.1 onboarding acceptance", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("blocks start when name and companion are missing", async ({ page }) => {
        await page.getByRole("button", { name: "Start Adventure" }).click();

        await expect(page.locator("#nameValidationMessage")).toContainText("Please enter your name so your pet can cheer for you!");
        await expect(page.locator("#petValidationMessage")).toContainText("Please choose one companion before you start.");
        await expect(page).toHaveURL(/\/$/);
    });

    test("allows start when name and companion are provided", async ({ page }) => {
        await page.getByLabel("Enter your hero name").fill("Mia");
        await page.getByRole("button", { name: "Brave Puppy" }).click();
        await page.getByRole("button", { name: "Start Adventure" }).click();

        await expect(page).toHaveURL(/\/screen2-world-map-topic-selection$/);
    });
});
