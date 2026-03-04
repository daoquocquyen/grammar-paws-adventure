import { expect, test } from "@playwright/test";

test.describe("Story 1.1 onboarding acceptance", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("blocks start when name and companion are missing", async ({ page }) => {
        await page.getByRole("button", { name: "Start Adventure" }).click();

        await expect(page.locator("#nameValidationMessage")).toContainText("Please enter your name so your pet can cheer for you!");
        await expect(page.locator("#heroValidationMessage")).toContainText("Please choose one 3D hero before you start.");
        await expect(page.locator("#petValidationMessage")).toContainText("Please choose one companion before you start.");
        await expect(page).toHaveURL(/\/$/);
    });

    test("allows start when name, hero, and companion are provided", async ({ page }) => {
        await page.getByLabel("Enter your hero name").fill("Mia");
        const heroButton = page.getByRole("button", { name: "Mia" }).first();
        const goldenRetrieverButton = page.getByRole("button", { name: "Golden Retriever" }).first();
        const startAdventureButton = page.getByRole("button", { name: "Start Adventure" }).first();

        await heroButton.click();
        await expect(heroButton).toHaveAttribute("aria-pressed", "true");
        await goldenRetrieverButton.click();
        await expect(goldenRetrieverButton).toHaveAttribute("aria-pressed", "true");
        await startAdventureButton.click();

        await expect(page).toHaveURL(/\/world-map$/);
    });

    test("persists and restores player profile across refresh", async ({ page }) => {
        await page.getByLabel("Enter your hero name").fill("Nia");
        const heroButton = page.getByRole("button", { name: "Zuri" }).first();
        const calicoCatButton = page.getByRole("button", { name: "Calico Cat" }).first();
        const startAdventureButton = page.getByRole("button", { name: "Start Adventure" }).first();

        await heroButton.click();
        await expect(heroButton).toHaveAttribute("aria-pressed", "true");
        await calicoCatButton.click();
        await expect(calicoCatButton).toHaveAttribute("aria-pressed", "true");
        await startAdventureButton.click();

        await expect(page).toHaveURL(/\/world-map$/);

        const persistedProfile = await page.evaluate(() => {
            const raw = window.localStorage.getItem("gpa_player_profile_v1");
            return raw ? JSON.parse(raw) : null;
        });

        expect(persistedProfile).toMatchObject({
            version: 1,
            name: "Nia",
            heroName: "Zuri",
            heroModelType: "3d",
            petName: "Calico Cat",
        });

        await page.goto("/");
        await expect(page.getByLabel("Enter your hero name")).toHaveValue("Nia");
        await expect(page.getByRole("button", { name: "Zuri" })).toHaveAttribute("aria-pressed", "true");
        await expect(page.getByRole("button", { name: "Calico Cat" })).toHaveAttribute("aria-pressed", "true");
    });
});
