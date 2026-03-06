import { expect, test } from "@playwright/test";

test.describe("Story 2.3 acceptance", () => {
    test("supports guided retry and coached retry without auto-resolution on second wrong", async ({ page }) => {
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
            throw new Error("Could not find first wrong option");
        }

        await optionButtons.nth(firstWrongIndex).click();

        const primaryAction = page.getByTestId("challenge-primary-action");
        await expect(primaryAction).toContainText("Continue");
        await expect(primaryAction).toBeDisabled();

        await expect(optionButtons.nth(firstWrongIndex)).toBeDisabled();

        const findEnabledWrongIndex = async () => {
            for (let index = 0; index < optionCount; index += 1) {
                const option = optionButtons.nth(index);
                const isDisabled = await option.isDisabled();
                const optionText = ((await option.textContent()) || "").trim().toLowerCase();
                if (!isDisabled && optionText !== correctAnswer) {
                    return index;
                }
            }
            return -1;
        };

        await expect.poll(findEnabledWrongIndex).not.toBe(-1);
        const secondWrongIndex = await findEnabledWrongIndex();

        if (secondWrongIndex < 0) {
            throw new Error("Could not find second wrong option");
        }

        await optionButtons.nth(secondWrongIndex).click();

        await expect(primaryAction).toContainText("I understand");
        await expect(primaryAction).toBeDisabled();
        await expect(page.getByTestId("challenge-xp-message")).toHaveCount(0);

        await expect.poll(findEnabledWrongIndex).not.toBe(-1);
        const thirdWrongIndex = await findEnabledWrongIndex();
        await optionButtons.nth(thirdWrongIndex).click();

        await expect(page.getByTestId("challenge-progress-text")).toHaveText("2/9");
    });
});
