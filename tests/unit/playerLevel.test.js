import { describe, expect, it } from "vitest";
import { getLevelTitle, getPlayerLevelInfo } from "../../src/lib/playerLevel";

describe("getLevelTitle", () => {
    it("returns Explorer for levels 1 through 3", () => {
        expect(getLevelTitle(1)).toBe("Explorer");
        expect(getLevelTitle(2)).toBe("Explorer");
        expect(getLevelTitle(3)).toBe("Explorer");
    });

    it("returns Guardian for levels 10 through 12", () => {
        expect(getLevelTitle(10)).toBe("Guardian");
        expect(getLevelTitle(12)).toBe("Guardian");
    });
});

describe("getPlayerLevelInfo", () => {
    it("defaults to level 1 Explorer when progress payload is missing", () => {
        expect(getPlayerLevelInfo(null)).toEqual({ level: 1, title: "Explorer" });
    });

    it("computes level from completed topics and in-progress percentages", () => {
        const result = getPlayerLevelInfo({
            completedTopics: ["nouns"],
            topicProgress: {
                verbs: 45,
                pronouns: { percent: 20 },
            },
        });

        expect(result).toEqual({ level: 4, title: "Pathfinder" });
    });

    it("treats completed topics as 100% even when topicProgress is lower", () => {
        const result = getPlayerLevelInfo({
            completedTopics: ["verbs"],
            topicProgress: {
                verbs: 30,
            },
        });

        expect(result).toEqual({ level: 3, title: "Explorer" });
    });
});
