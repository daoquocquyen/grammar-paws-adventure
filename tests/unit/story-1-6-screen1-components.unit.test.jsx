import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HeaderBlock from "../../src/components/HeaderBlock";
import PetOptionCard from "../../src/components/PetOptionCard";
import PrimaryButton from "../../src/components/PrimaryButton";

describe("Story 1.6 unit", () => {
    it("renders HeaderBlock defaults", () => {
        render(<HeaderBlock />);

        expect(screen.getByRole("heading", { name: "Grammar Paws Adventure" })).toBeInTheDocument();
        expect(screen.getByText("Learn grammar, unlock pet powers!")).toBeInTheDocument();
    });

    it("preserves button and card interaction contracts", () => {
        const onSelect = vi.fn();
        const onClick = vi.fn();

        render(
            <>
                <PetOptionCard pet={{ name: "Golden Retriever", image: "/companions/golden-retriever.png" }} isSelected={false} onSelect={onSelect} showLabel />
                <PrimaryButton onClick={onClick}>Start Adventure</PrimaryButton>
            </>
        );

        fireEvent.click(screen.getByRole("button", { name: "Golden Retriever" }));
        fireEvent.click(screen.getByRole("button", { name: "Start Adventure" }));

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
