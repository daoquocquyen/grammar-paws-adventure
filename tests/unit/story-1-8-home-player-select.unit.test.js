import { beforeEach, describe, expect, it } from "vitest";
import {
    PLAYER_PROFILES_STORAGE_KEY,
    PROFILE_STORAGE_KEY,
    bootstrapPlayerProfileDirectoryFromActiveProfile,
    readPlayerProfileDirectory,
    upsertPlayerProfileDirectory,
} from "../../src/lib/playerStorage";

describe("Story 1.8 unit", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("upserts profile directory records by playerId", () => {
        upsertPlayerProfileDirectory({
            version: 1,
            playerId: "mia",
            name: "Mia",
            heroName: "Mia",
            petName: "Golden Retriever",
        }, window.localStorage, "2026-03-12T10:00:00.000Z");
        upsertPlayerProfileDirectory({
            version: 1,
            playerId: "mia",
            name: "Mia",
            heroName: "Mia",
            petName: "Calico Cat",
        }, window.localStorage, "2026-03-12T11:00:00.000Z");

        const directoryPayload = JSON.parse(window.localStorage.getItem(PLAYER_PROFILES_STORAGE_KEY));
        expect(directoryPayload.profiles).toHaveLength(1);
        expect(directoryPayload.profiles[0]).toEqual(
            expect.objectContaining({
                playerId: "mia",
                petName: "Calico Cat",
                lastPlayedAt: "2026-03-12T11:00:00.000Z",
            })
        );
    });

    it("bootstraps profile directory from active profile when needed", () => {
        window.localStorage.setItem(
            PROFILE_STORAGE_KEY,
            JSON.stringify({
                version: 1,
                playerId: "nova",
                name: "Nova",
                heroName: "Zuri",
                petName: "Calico Cat",
            })
        );

        const profiles = bootstrapPlayerProfileDirectoryFromActiveProfile(window.localStorage);
        expect(profiles).toHaveLength(1);
        expect(readPlayerProfileDirectory(window.localStorage)[0]).toEqual(
            expect.objectContaining({ playerId: "nova", name: "Nova" })
        );
    });
});
