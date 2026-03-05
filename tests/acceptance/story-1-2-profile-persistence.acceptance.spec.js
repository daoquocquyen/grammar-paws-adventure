import { expect, test } from "@playwright/test";

test.describe("Story 1.2 acceptance", () => {
    test("persists and restores profile after refresh", async ({ page }) => {
        await page.goto("/");

        await page.getByLabel("Enter your hero name").fill("Nia");
        await page.getByRole("button", { name: "Zuri" }).first().click();
        await page.getByRole("button", { name: "Calico Cat" }).first().click();
        await page.getByRole("button", { name: "Start Adventure" }).first().click();

        await expect(page).toHaveURL(/\/world-map$/, { timeout: 20_000 });

        await page.goto("/");
        await expect(page.getByLabel("Enter your hero name")).toHaveValue("Nia");
        await expect(page.getByRole("button", { name: "Zuri" })).toHaveAttribute("aria-pressed", "true");
        await expect(page.getByRole("button", { name: "Calico Cat" })).toHaveAttribute("aria-pressed", "true");
    });
});
