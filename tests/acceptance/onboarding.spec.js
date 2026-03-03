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
        const bravePuppyButton = page.getByRole("button", { name: "Brave Puppy" }).first();
        const startAdventureButton = page.getByRole("button", { name: "Start Adventure" }).first();

        await bravePuppyButton.click();
        await expect(bravePuppyButton).toHaveAttribute("aria-pressed", "true");
        await startAdventureButton.click();

        await expect(page).toHaveURL(/\/screen2-world-map-topic-selection$/);
    });

    test("persists and restores player profile across refresh", async ({ page }) => {
        await page.getByLabel("Enter your hero name").fill("Nia");
        const wiseKittenButton = page.getByRole("button", { name: "Wise Kitten" }).first();
        const startAdventureButton = page.getByRole("button", { name: "Start Adventure" }).first();

        await wiseKittenButton.click();
        await expect(wiseKittenButton).toHaveAttribute("aria-pressed", "true");
        await startAdventureButton.click();

        await expect(page).toHaveURL(/\/screen2-world-map-topic-selection$/);

        const persistedProfile = await page.evaluate(() => {
            const raw = window.localStorage.getItem("gpa_player_profile_v1");
            return raw ? JSON.parse(raw) : null;
        });

        expect(persistedProfile).toMatchObject({
            version: 1,
            name: "Nia",
            petName: "Wise Kitten",
        });

        await page.goto("/");
        await expect(page.getByLabel("Enter your hero name")).toHaveValue("Nia");
        await expect(page.getByRole("button", { name: "Wise Kitten" })).toHaveAttribute("aria-pressed", "true");
    });
});
