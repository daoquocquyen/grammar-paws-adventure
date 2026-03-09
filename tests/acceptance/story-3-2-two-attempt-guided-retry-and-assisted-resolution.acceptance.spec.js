import { expect, test } from "@playwright/test";
import { dragOptionToBlank } from "./challengeDragHelpers";

const findOptionIndexes = async (page, correctAnswer) => {
    const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");
    const optionCount = await optionButtons.count();

    const enabledWrongIndexes = [];
    let enabledCorrectIndex = -1;

    for (let index = 0; index < optionCount; index += 1) {
        const option = optionButtons.nth(index);
        const isDisabled = await option.isDisabled();
        const optionText = ((await option.textContent()) || "").trim().toLowerCase();
        if (isDisabled) {
            continue;
        }
        if (optionText === correctAnswer) {
            enabledCorrectIndex = index;
        } else {
            enabledWrongIndexes.push(index);
        }
    }

    return { enabledWrongIndexes, enabledCorrectIndex };
};

test.describe("Story 3.2 acceptance", () => {
    test("enforces guided retry and coached acknowledge flow", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => {
            window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
        });
        await page.goto("/challenge");

        const metadata = page.getByTestId("challenge-selection-metadata");
        await expect(metadata).toHaveAttribute("data-selected-question-ids", /nouns::/);
        const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");
        const primaryAction = page.getByTestId("challenge-primary-action");

        let correctAnswer = ((await metadata.getAttribute("data-current-correct-answer")) || "").trim().toLowerCase();
        let { enabledWrongIndexes: wrongIndexesBeforeRetry } = await findOptionIndexes(page, correctAnswer);
        for (let retry = 0; retry < 3 && wrongIndexesBeforeRetry.length < 2; retry += 1) {
            await page.reload();
            await expect(metadata).toHaveAttribute("data-selected-question-ids", /nouns::/);
            correctAnswer = ((await metadata.getAttribute("data-current-correct-answer")) || "").trim().toLowerCase();
            ({ enabledWrongIndexes: wrongIndexesBeforeRetry } = await findOptionIndexes(page, correctAnswer));
        }

        if (wrongIndexesBeforeRetry.length < 2) {
            throw new Error("Could not find at least two wrong options for guided retry validation");
        }

        await dragOptionToBlank(page, optionButtons.nth(wrongIndexesBeforeRetry[0]));

        await expect(primaryAction).toContainText("Next");
        await expect(primaryAction).toBeDisabled();
        await expect(optionButtons.nth(wrongIndexesBeforeRetry[0])).toBeDisabled();

        const findSecondWrongIndex = async () => {
            const { enabledWrongIndexes } = await findOptionIndexes(page, correctAnswer);
            return enabledWrongIndexes.length > 0 ? enabledWrongIndexes[0] : -1;
        };

        await expect.poll(findSecondWrongIndex).not.toBe(-1);
        await dragOptionToBlank(page, optionButtons.nth(await findSecondWrongIndex()));

        await expect(primaryAction).toContainText("Next");
        await expect(primaryAction).toBeDisabled();

        const allOptionsEnabled = async () => {
            const count = await optionButtons.count();
            for (let index = 0; index < count; index += 1) {
                if (await optionButtons.nth(index).isDisabled()) {
                    return false;
                }
            }
            return true;
        };
        await expect.poll(allOptionsEnabled).toBe(true);

        const findCorrectInCoachedMode = async () => {
            const { enabledCorrectIndex } = await findOptionIndexes(page, correctAnswer);
            return enabledCorrectIndex;
        };

        await expect.poll(findCorrectInCoachedMode).not.toBe(-1);
        await dragOptionToBlank(page, optionButtons.nth(await findCorrectInCoachedMode()));

        await expect(primaryAction).toContainText("Next");
        await expect(primaryAction).toBeEnabled();

        await primaryAction.click();
        await expect(page.getByTestId("challenge-progress-text")).toHaveText("2/9");
        await expect(primaryAction).toContainText("Next");
        await expect(primaryAction).toBeDisabled();
        await expect(page.getByTestId("challenge-indicator-0")).toHaveAttribute("data-indicator-type", "CHECK");
    });
});
