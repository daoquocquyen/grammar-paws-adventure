export const dragOptionToBlank = async (page, option) => {
    const blank = page.getByTestId("challenge-blank");
    await option.scrollIntoViewIfNeeded();
    await blank.scrollIntoViewIfNeeded();

    const optionBox = await option.boundingBox();
    const blankBox = await blank.boundingBox();

    if (!optionBox || !blankBox) {
        throw new Error("Could not calculate drag positions for challenge option");
    }

    const startX = optionBox.x + (optionBox.width / 2);
    const startY = optionBox.y + (optionBox.height / 2);
    const endX = blankBox.x + (blankBox.width / 2);
    const endY = blankBox.y + (blankBox.height / 2);

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 18, startY + 10, { steps: 2 });
    await page.mouse.move(endX, endY, { steps: 8 });
    await page.mouse.up();
};
