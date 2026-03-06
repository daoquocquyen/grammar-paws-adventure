import { expect, test } from "@playwright/test";
import { dragOptionToBlank } from "./challengeDragHelpers";

const dragCurrentCorrectAnswer = async (page) => {
    const metadata = page.getByTestId("challenge-selection-metadata");
    const correctAnswer = ((await metadata.getAttribute("data-current-correct-answer")) || "").trim();
    const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");
    const optionCount = await optionButtons.count();

    for (let index = 0; index < optionCount; index += 1) {
        const option = optionButtons.nth(index);
        const optionText = ((await option.textContent()) || "").trim();
        if (optionText.toLowerCase() === correctAnswer.toLowerCase()) {
            await dragOptionToBlank(page, option);
            return;
        }
    }

    throw new Error(`Could not find correct answer option: ${correctAnswer}`);
};

test.describe("Story 3.4 acceptance", () => {
    test("shows streak and end-of-level bonuses in summary", async ({ page }) => {
        await page.goto("/");

        await page.evaluate(() => {
            window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
        });

        await page.goto("/challenge");
        await expect(page.getByTestId("challenge-selection-metadata")).toHaveAttribute("data-selected-question-ids", /nouns::/);

        const primaryAction = page.getByTestId("challenge-primary-action");

        for (let index = 0; index < 9; index += 1) {
            await dragCurrentCorrectAnswer(page);
            await expect(primaryAction).toBeEnabled();
            await primaryAction.click();
        }

        await expect(page.getByTestId("challenge-summary")).toBeVisible();
        await expect(page.getByTestId("challenge-summary-total-xp")).toHaveText("125");
        await expect(page.getByTestId("challenge-summary-bonus-xp")).toHaveText("35");

        await expect(page.getByTestId("challenge-summary-bonus-list")).toContainText("First-try streak bonus");
        await expect(page.getByTestId("challenge-summary-bonus-list")).toContainText("First-try accuracy bonus");
        await expect(page.getByTestId("challenge-summary-bonus-list")).toContainText("Persistence bonus");
    });
});
