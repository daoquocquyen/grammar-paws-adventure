import { expect, test } from "@playwright/test";

test.describe("Story 1.7 acceptance", () => {
    test("requires hero selection and shows 8 hero options", async ({ page }) => {
        await page.goto("/onboarding");

        for (const heroName of ["Mia", "Leo", "Zuri", "Kenji", "Lyly", "Toby", "Sofia", "Matheus"]) {
            await expect(page.getByRole("button", { name: heroName }).first()).toBeVisible();
        }

        await page.getByLabel("Enter your hero name").fill("Mia");
        await page.getByRole("button", { name: "Golden Retriever" }).first().click();
        await page.getByRole("button", { name: "Start Adventure" }).first().click();

        await expect(page.locator("#heroValidationMessage")).toContainText("Please choose one 3D hero before you start.");
        await expect(page).toHaveURL(/\/onboarding$/);
    });
});
