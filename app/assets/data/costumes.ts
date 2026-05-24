import COSTUMES_DATA from "./costumes.json";
import OCEANHILLMAN_CONVERSION_MAP from './ohm-costume-conversion-map.json';

export type CostumeRarity = 'legendary'|'epic'|'rare'|'common';
export type Costume = {
    heroId: string,

    id: string,
    wikiLink?: string,
    name: string,
    rarity: CostumeRarity,
    customizable: boolean,

    category: string,
    source?: string,
    sourceLink?: string,
    theme?: string,

    releaseDate?: string,
}

export const COSTUMES = () => COSTUMES_DATA as Record<string, Costume[]>;

export function getHeroCostumes(heroId: string) {
    return COSTUMES()[heroId] ?? [];
}

export const KNOWN_COSTUME_CATEGORY_ICONS: Record<string, string> = {
    'Limited Time': 'limited-time.webp',
    'Permanent': 'permanent.webp',
    'Closed Beta Test': 'beta.webp',
    'Premium Event Reward': 'premium-event-reward.webp',
    'Pick-Up Bundle Exclusive': 'pick-up-bundle.webp',
    'Luxury Battle Pass': 'luxury-battlepass.webp',
    'Twitch Drop': 'twitch-drop.webp',
    'Free Battle Pass': 'free-battlepass.webp',
    'Free Event Reward': 'free-event-reward.webp',
    'Achievements': 'achievements.webp',
    'PlayStation Exclusive': 'playstation.webp',
    'Code Redeemable': 'code-redeemable.webp',
    'Closed Alpha Test': 'alpha.webp',
    'Lucky Draw': 'lucky-draw.webp',
    'Ranked Reward': 'ranked-reward.webp',
    'Disney+ Exclusive': 'disney-plus.webp',
    'Esports': 'esports.webp',

    "_default": 'other.webp'
}
export function getCategoryIcon(category: string) {
    let icon = KNOWN_COSTUME_CATEGORY_ICONS[category];
    if (!icon)
        icon = KNOWN_COSTUME_CATEGORY_ICONS._default!;

    return `/img/heroes/costume-categories/${icon}`;
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