import { expect, test } from "@playwright/test";

test.describe("Story 1.1 acceptance", () => {
    test("blocks Start Adventure when fields are missing", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Start Adventure" }).click();

        await expect(page.locator("#nameValidationMessage")).toContainText("Please enter your name so your pet can cheer for you!");
        await expect(page.locator("#heroValidationMessage")).toContainText("Please choose one 3D hero before you start.");
        await expect(page.locator("#petValidationMessage")).toContainText("Please choose one companion before you start.");
    });
});
