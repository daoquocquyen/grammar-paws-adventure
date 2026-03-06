"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_FLASH_RGB = "56 189 248";
const FLASH_DURATION_MS = 5000;

const toRgbChannels = (colorValue) => {
    if (typeof colorValue !== "string") {
        return DEFAULT_FLASH_RGB;
    }

    const trimmedColor = colorValue.trim();
    const hexMatch = trimmedColor.match(/^#([a-f\d]{3}|[a-f\d]{6})$/i);
    if (hexMatch) {
        const rawHex = hexMatch[1];
        const normalizedHex = rawHex.length === 3
            ? rawHex.split("").map((char) => `${char}${char}`).join("")
            : rawHex;
        const parsedValue = Number.parseInt(normalizedHex, 16);
        if (Number.isFinite(parsedValue)) {
            const red = (parsedValue >> 16) & 255;
            const green = (parsedValue >> 8) & 255;
            const blue = parsedValue & 255;
            return `${red} ${green} ${blue}`;
        }
    }

    const rgbMatch = trimmedColor.match(
        /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+\s*)?\)$/i
    );
    if (rgbMatch) {
        return `${rgbMatch[1]} ${rgbMatch[2]} ${rgbMatch[3]}`;
    }

    return DEFAULT_FLASH_RGB;
};

export default function CharacterSpeechBubble({
    message = "",
    tailSide = "left",
    borderColor = "#e2e8f0",
    className = "",
    textClassName = "",
    flashOnChange = false,
    testId,
}) {
    const [isFlashActive, setIsFlashActive] = useState(false);
    const hasMountedRef = useRef(false);

    useEffect(() => {
        if (!flashOnChange) {
            return;
        }

        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        setIsFlashActive(true);
        const flashTimer = setTimeout(() => {
            setIsFlashActive(false);
        }, FLASH_DURATION_MS);

        return () => {
            clearTimeout(flashTimer);
        };
    }, [message, flashOnChange]);

    const isTailLeft = tailSide === "left";
    const flashRgbChannels = toRgbChannels(borderColor);

    return (
        <div
            className={`relative rounded-2xl border-2 bg-transparent px-6 py-5 text-left shadow-md transition ${
                isFlashActive ? "gpa-dialog-flash" : ""
            } ${className}`}
            style={{ borderColor, "--gpa-dialog-flash-rgb": flashRgbChannels }}
            data-testid={testId}
        >
            <span
                aria-hidden="true"
                className={`absolute top-1/2 size-6 -translate-y-1/2 rounded-full border-2 bg-transparent shadow-sm ${
                    isTailLeft ? "-left-3" : "-right-3"
                }`}
                style={{ borderColor }}
            />
            <span
                aria-hidden="true"
                className={`absolute top-[58%] size-3 -translate-y-1/2 rounded-full border-2 bg-transparent shadow-sm ${
                    isTailLeft ? "-left-5" : "-right-5"
                }`}
                style={{ borderColor }}
            />
            <p className={`text-lg font-bold leading-relaxed text-slate-800 ${textClassName}`}>{message}</p>
        </div>
    );
}
