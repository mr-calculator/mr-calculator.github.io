import type { HeroData, Rarity } from "../../common";
import NAMEPLATES_DATA from "./nameplates.json";

export type Nameplate = {
    type: 'normal'|'animated',

    id: string,
    name: string,
    rarity: Rarity,

    sourceFull: string,

    category?: string,
    source?: string,
    sourceLink?: string,

    theme?: string,

    releaseDate?: string,
}

export const DEFAULT_NAMEPLATE_ID = '30000001';

const mantisEasterEgg: Nameplate = {
    type: 'normal',

    id: '31020211_easter-egg',
    name: 'Mandy Celestine: The Greeter',
    rarity: 'rare',

    sourceFull: 'Store: Mandy Celestine: The Greeter Bundle',

    category: 'Store',
    source: 'NexusMods',
    sourceLink: 'https://www.nexusmods.com/marvelrivals/mods/9461',

    theme: 'ESU College Life',

    releaseDate: '2026-06-04',
}

export const NAMEPLATES = () => [...NAMEPLATES_DATA as Nameplate[], mantisEasterEgg];

export function getNameplatesByHero(hero: HeroData) {
    if (!hero.internalId)
        return [];

    return NAMEPLATES().filter(n =>
        n.id.slice(1, 5) == hero.internalId
    );
}

export function getAllPropertyValues(property: keyof Nameplate) {
    const values = new Set<string>();
    NAMEPLATES().forEach(nameplate =>
        nameplate?.[property] ? values.add(nameplate[property]) : null
    );

    return Array.from(values);
}

export const KNOWN_NAMEPLATE_CATEGORY_ICONS: Record<string, string> = {
    "Store": 'permanent.webp',
    "BattlePass": 'luxury-battlepass.webp',
    "Achievement Reward": 'achievements.webp',
    "Event (Beta)": 'beta.webp',
    "Event": 'free-event-reward.webp',
    "Marvel Rivals Championship": 'esports.webp',
    "Event (Alpha)": 'alpha.webp',
    "Dawn of Legends Tournament (Alpha)": 'alpha.webp',
    "War of the Realms Tournament (Beta)": 'beta.webp',
    "Combat Chest": 'free-event-reward.webp',
    "Event Pass": 'premium-event-reward.webp',
    "Lucky Draw Event": 'lucky-draw.webp',
    "Proficiency Reward": 'proficiency-reward.webp',
    "Monster Kingdom Championship Reward": 'esports.webp',

    "_default": 'other.webp'
}
export function getCategoryIcon(category: string) {
    let icon = KNOWN_NAMEPLATE_CATEGORY_ICONS[category];
    if (!icon)
        icon = KNOWN_NAMEPLATE_CATEGORY_ICONS._default!;

    return `/img/cosmetics/categories/${icon}`;
}