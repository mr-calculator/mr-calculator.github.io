import COSTUMES_DATA from "./costumes.json";
import OCEANHILLMAN_CONVERSION_MAP from './ohm-costume-conversion-map.json';

export type CostumeRarity = 'legendary'|'epic'|'rare'|'common';
export type Costume = {
    heroId: string,

    id: string,
    name: string,
    rarity: CostumeRarity,
    customizable: boolean,

    category: string,
    source?: string,
    theme?: string,

    releaseDate?: string,
}

export const COSTUMES = () => COSTUMES_DATA as Record<string, Costume[]>;

export function getHeroCostumes(heroId: string) {
    return COSTUMES()[heroId] ?? [];
}

export function getAllCategories(heroId?: string) {
    const categories = new Set<string>();
    Object.entries(COSTUMES()).filter(([hId]) => heroId ? hId == heroId : true).forEach(([_, costumes]) =>
        costumes.forEach(c => categories.add(c.category))
    );

    return Array.from(categories);
}

export function getAllSources(heroId?: string) {
    const sources = new Set<string>();
    Object.entries(COSTUMES()).filter(([hId]) => heroId ? hId == heroId : true).forEach(([_, costumes]) =>
        costumes.forEach(c => c.source ? sources.add(c.source) : null)
    );

    return Array.from(sources);
}

export function getAllThemes(heroId?: string) {
    const themes = new Set<string>();
    Object.entries(COSTUMES()).filter(([hId]) => heroId ? hId == heroId : true).forEach(([_, costumes]) =>
        costumes.forEach(c => c.theme ? themes.add(c.theme) : null)
    );

    return Array.from(themes);
}

export function convertCostumeId(oldId: string) {
    return (OCEANHILLMAN_CONVERSION_MAP as Record<string, string>)[oldId];
}