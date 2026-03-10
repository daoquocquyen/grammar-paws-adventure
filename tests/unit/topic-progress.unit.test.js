import { describe, expect, it } from "vitest";

import { extractTopicProgressMetrics, getMasteryLabelByPercent } from "../../src/lib/topicProgress";

describe("topic progress helpers", () => {
    it("computes percent from XP snapshots", () => {
        const metrics = extractTopicProgressMetrics({ earnedBaseXp: 72, maxBaseXp: 90, percent: 100 });

        expect(metrics.percent).toBe(80);
        expect(metrics.earnedBaseXp).toBe(72);
        expect(metrics.maxBaseXp).toBe(90);
    });

    it("falls back to percent fields when XP snapshot is missing", () => {
        const metrics = extractTopicProgressMetrics({ percent: 46 });

        expect(metrics.percent).toBe(46);
        expect(metrics.earnedBaseXp).toBeNull();
        expect(metrics.maxBaseXp).toBeNull();
    });

    it("maps mastery labels by percent ranges", () => {
        expect(getMasteryLabelByPercent(10)).toBe("IN PROGRESS");
        expect(getMasteryLabelByPercent(30)).toBe("BUILDING");
        expect(getMasteryLabelByPercent(60)).toBe("GROWING");
        expect(getMasteryLabelByPercent(85)).toBe("STRONG");
        expect(getMasteryLabelByPercent(100)).toBe("MASTERED");
    });
});
