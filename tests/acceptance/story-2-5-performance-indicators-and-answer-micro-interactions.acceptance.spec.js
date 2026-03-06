import { expect, test } from "@playwright/test";

test.describe("Story 2.5 acceptance", () => {
    test("shows indicator mapping and non-punitive micro-interaction states", async ({ page }) => {
        await page.goto("/");

        await page.evaluate(() => {
            window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
        });

        await page.goto("/challenge");
        const metadata = page.getByTestId("challenge-selection-metadata");
        await expect(metadata).toHaveAttribute("data-selected-question-ids", /nouns::/);

        const correctAnswer = ((await metadata.getAttribute("data-current-correct-answer")) || "").trim().toLowerCase();
        const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");
        const optionCount = await optionButtons.count();

        let firstWrongIndex = -1;
        for (let index = 0; index < optionCount; index += 1) {
            const optionText = ((await optionButtons.nth(index).textContent()) || "").trim().toLowerCase();
            if (optionText !== correctAnswer) {
                firstWrongIndex = index;
                break;
            }
        }

        if (firstWrongIndex < 0) {
            throw new Error("Could not find wrong option");
        }

        await optionButtons.nth(firstWrongIndex).click();

        const primaryAction = page.getByTestId("challenge-primary-action");
        await expect(primaryAction).toContainText("Continue");
        await expect(primaryAction).toBeDisabled();

        await expect(optionButtons.nth(firstWrongIndex)).toHaveAttribute("data-option-state", "wrong");

        await expect(optionButtons.nth(firstWrongIndex)).toBeDisabled();

        let correctIndex = -1;
        for (let index = 0; index < optionCount; index += 1) {
            const option = optionButtons.nth(index);
            const isDisabled = await option.isDisabled();
            const optionText = ((await option.textContent()) || "").trim().toLowerCase();
            if (!isDisabled && optionText === correctAnswer) {
                correctIndex = index;
                break;
            }
        }

        if (correctIndex < 0) {
            throw new Error("Could not find enabled correct option");
        }

        await optionButtons.nth(correctIndex).click();
        await expect(primaryAction).toContainText("Continue");
        await expect(primaryAction).toBeEnabled();

        await expect(page.getByTestId("challenge-indicator-0")).toHaveAttribute("data-indicator-type", "HOLLOW_STAR");
        await expect(page.getByText("Wrong", { exact: false })).toHaveCount(0);
    });
});
