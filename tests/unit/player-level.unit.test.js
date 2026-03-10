import { describe, expect, it } from "vitest";
import { getPlayerLevelInfo } from "../../src/lib/playerLevel";

describe("player level mapping", () => {
    it("keeps level aligned with completed-topic progression", () => {
        const progressState = {
            version: 1,
            completedTopics: ["nouns", "pronouns", "verbs", "articles"],
            topicProgress: {
                adjectives: 45,
            },
        };

        const { level, title } = getPlayerLevelInfo(progressState);

        expect(level).toBe(5);
        expect(title).toBe("Pathfinder");
    });

    it("counts topics at 100% progress as completed fallback", () => {
        const progressState = {
            version: 1,
            completedTopics: ["nouns", "pronouns"],
            topicProgress: {
                verbs: 100,
            },
        };

        const { level } = getPlayerLevelInfo(progressState);
        expect(level).toBe(4);
    });

    it("counts topics at 100% when derived from XP snapshot values", () => {
        const progressState = {
            version: 1,
            completedTopics: ["nouns"],
            topicProgress: {
                pronouns: { earnedBaseXp: 90, maxBaseXp: 90 },
                verbs: { earnedBaseXp: 72, maxBaseXp: 90 },
            },
        };

        const { level } = getPlayerLevelInfo(progressState);
        expect(level).toBe(3);
    });

    it("returns level 1 when progress state is missing", () => {
        const { level, title } = getPlayerLevelInfo(null);

        expect(level).toBe(1);
        expect(title).toBe("Explorer");
    });
});
