import { expect, test } from "@playwright/test";
import { dragOptionToBlank } from "./challengeDragHelpers";

const dragCurrentCorrectAnswer = async (page) => {
    const metadata = page.getByTestId("challenge-selection-metadata");
    const correctAnswer = ((await metadata.getAttribute("data-current-correct-answer")) || "").trim().toLowerCase();
    const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");
    const optionCount = await optionButtons.count();

    for (let index = 0; index < optionCount; index += 1) {
        const option = optionButtons.nth(index);
        const optionText = ((await option.textContent()) || "").trim().toLowerCase();
        if (optionText === correctAnswer) {
            await dragOptionToBlank(page, option);
            return;
        }
    }

    throw new Error(`Could not find correct option: ${correctAnswer}`);
};

const findEnabledWrongIndex = async (page, correctAnswer) => {
    const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");
    const optionCount = await optionButtons.count();

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

test.describe("Story 3.1 acceptance", () => {
    test("computes XP and pass summary from recorded outcomes", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => {
            window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
        });
        await page.goto("/challenge");

        const metadata = page.getByTestId("challenge-selection-metadata");
        await expect(metadata).toHaveAttribute("data-selected-question-ids", /nouns::/);
        const initialCorrectAnswer = ((await metadata.getAttribute("data-current-correct-answer")) || "").trim().toLowerCase();
        const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");

        const firstWrongIndex = await findEnabledWrongIndex(page, initialCorrectAnswer);
        if (firstWrongIndex < 0) {
            throw new Error("Could not find wrong option for first attempt");
        }

        await dragOptionToBlank(page, optionButtons.nth(firstWrongIndex));

        const primaryAction = page.getByTestId("challenge-primary-action");
        await expect(primaryAction).toContainText("Next");
        await expect(primaryAction).toBeDisabled();

        const findEnabledCorrectIndex = async () => {
            const count = await optionButtons.count();
            for (let index = 0; index < count; index += 1) {
                const option = optionButtons.nth(index);
                const isDisabled = await option.isDisabled();
                const optionText = ((await option.textContent()) || "").trim().toLowerCase();
                if (!isDisabled && optionText === initialCorrectAnswer) {
                    return index;
                }
            }
            return -1;
        };

        await expect.poll(findEnabledCorrectIndex).not.toBe(-1);
        await dragOptionToBlank(page, optionButtons.nth(await findEnabledCorrectIndex()));

        await expect(page.getByTestId("challenge-pet-message")).toContainText("+8 XP!");
        await expect(primaryAction).toContainText("Next");
        await expect(primaryAction).toBeEnabled();
        await primaryAction.click();

        await expect(page.getByTestId("challenge-progress-text")).toHaveText("2/9");
        await expect(page.getByTestId("challenge-xp-pass-progress-text")).toHaveText("XP 8/90 (72 to pass)");

        await dragCurrentCorrectAnswer(page);
        await expect(page.getByTestId("challenge-pet-message")).toContainText("+10 XP!");
        await expect(primaryAction).toBeEnabled();
        await primaryAction.click();
        await expect(page.getByTestId("challenge-xp-pass-progress-text")).toHaveText("XP 18/90 (72 to pass)");

        for (let index = 0; index < 7; index += 1) {
            await dragCurrentCorrectAnswer(page);
            await expect(primaryAction).toContainText("Next");
            await expect(primaryAction).toBeEnabled();
            await primaryAction.click();
        }

        await expect(page.getByTestId("challenge-summary")).toBeVisible();
        await expect(page.getByTestId("challenge-summary-pass-fail")).toContainText("Pass achieved");
        await expect(page.getByTestId("challenge-summary-score")).toContainText("XP Gate: 88/72");
        await expect(page.getByTestId("challenge-summary-total-xp")).toHaveText("123");
    });
});
