import fs from 'fs';
import * as p from '@clack/prompts';

const HERO_ID_CONV_PATH = './scripts/add-hero/cache/hero-id-conversion.json';
export function inferInternalId(heroId: string): string|undefined {
    const ids = JSON.parse(fs.readFileSync(HERO_ID_CONV_PATH, { encoding: 'utf-8' }));

    return ids[heroId];
}
export function addInternalIdPair(heroId: string, internalId: string) {
    const ids = JSON.parse(fs.readFileSync(HERO_ID_CONV_PATH, { encoding: 'utf-8' }));

    if (ids[heroId])
        return false;

    ids[heroId] = internalId;

    fs.writeFileSync(HERO_ID_CONV_PATH, JSON.stringify(ids, undefined, 4));

    return true;
}

export function inferHeroId(heroName: string) {
    return heroName
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

export function checkCancel(input: unknown|symbol, callback?: () => void) {
    if (typeof input == 'symbol') {
        callback?.();
        p.cancel('Cancelled');
        process.exit(0);
    }
}