import { expect, test } from "@playwright/test";
import { dragOptionToBlank } from "./challengeDragHelpers";

const findCurrentAnswerIndex = async (page, { shouldBeCorrect, mustBeEnabled = false }) => {
    const metadata = page.getByTestId("challenge-selection-metadata");
    const targetAnswer = ((await metadata.getAttribute("data-current-correct-answer")) || "").trim().toLowerCase();
    const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");
    const optionCount = await optionButtons.count();

    for (let index = 0; index < optionCount; index += 1) {
        const option = optionButtons.nth(index);
        const optionText = ((await option.textContent()) || "").trim().toLowerCase();
        const isCorrect = optionText === targetAnswer;
        const isEnabled = !(await option.isDisabled());
        if ((shouldBeCorrect && isCorrect) || (!shouldBeCorrect && !isCorrect)) {
            if (!mustBeEnabled || isEnabled) {
                return index;
            }
        }
    }

    return -1;
};

const dragCurrentAnswerByMatch = async (page, { shouldBeCorrect, mustBeEnabled = false }) => {
    const targetIndex = await findCurrentAnswerIndex(page, { shouldBeCorrect, mustBeEnabled });
    if (targetIndex < 0) {
        throw new Error(`Could not find ${mustBeEnabled ? "enabled " : ""}${shouldBeCorrect ? "correct" : "wrong"} answer option`);
    }

    const optionButtons = page.getByTestId("challenge-answer-options").getByRole("button");
    await dragOptionToBlank(page, optionButtons.nth(targetIndex));
};

test.describe("Story 3.5 acceptance", () => {
    test("reads hero then question for each question start, and hero-only for same-question updates", async ({ page }) => {
        await page.addInitScript(() => {
            window.__challengeSpeechLog = [];

            window.SpeechSynthesisUtterance = function MockSpeechSynthesisUtterance(text) {
                this.text = text;
                this.rate = 1;
                this.pitch = 1;
                this.onend = null;
                this.onerror = null;
            };

            Object.defineProperty(window, "speechSynthesis", {
                configurable: true,
                writable: true,
                value: {
                    cancel() {},
                    speak(utterance) {
                        window.__challengeSpeechLog.push(String(utterance?.text || ""));
                        if (typeof utterance?.onend === "function") {
                            setTimeout(() => {
                                utterance.onend();
                            }, 0);
                        }
                    },
                },
            });
        });

        await page.goto("/");
        await page.evaluate(() => {
            window.localStorage.setItem("gpa_selected_topic_v1", "nouns");
            window.localStorage.setItem("gpa_voice_settings_v1", JSON.stringify({ muted: false }));
        });

        await page.goto("/challenge");

        await expect.poll(async () => page.evaluate(() => window.__challengeSpeechLog.length)).toBe(2);

        const initialSpeech = await page.evaluate(() => window.__challengeSpeechLog.slice());
        expect(String(initialSpeech[0] || "").toLowerCase()).toContain("hint");
        expect(String(initialSpeech[1] || "").toLowerCase()).toContain("blank");

        await dragCurrentAnswerByMatch(page, { shouldBeCorrect: false });

        await expect.poll(async () => page.evaluate(() => window.__challengeSpeechLog.length)).toBe(3);

        const allSpeech = await page.evaluate(() => window.__challengeSpeechLog.slice());
        const thirdSpeech = String(allSpeech[2] || "").toLowerCase();
        expect(thirdSpeech).toContain("this sentence needs");
        expect(thirdSpeech).not.toContain("blank");

        await expect.poll(() => findCurrentAnswerIndex(page, { shouldBeCorrect: true, mustBeEnabled: true })).not.toBe(-1);
        await dragCurrentAnswerByMatch(page, { shouldBeCorrect: true, mustBeEnabled: true });
        const primaryAction = page.getByTestId("challenge-primary-action");
        await expect(primaryAction).toBeEnabled();
        await primaryAction.click();

        await expect.poll(async () => {
            const speechLog = await page.evaluate(() => window.__challengeSpeechLog.slice());
            return speechLog.filter((entry) => String(entry).toLowerCase().includes("blank")).length;
        }).toBe(2);
    });
});
