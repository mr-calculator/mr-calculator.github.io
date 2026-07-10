import COSTUMES_DATA from "./costumes.json";
import OCEANHILLMAN_CONVERSION_MAP from '../../ohm-costume-conversion-map.json';
import z from "zod";
import { type HeroData } from "../../common";

export const CostumeRaritySchema = z.enum(['legendary', 'epic', 'rare', 'common']);
export type CostumeRarity = z.infer<typeof CostumeRaritySchema>;
export const RARITY_ORDER: CostumeRarity[] = [
    'legendary',
    'epic',
    'rare',
    'common',
];

export const DataUrlSchema = z.string().regex(/^data:[a-z]+\/[a-z0-9+.-]+;base64,[A-Za-z0-9+/=]+$/);
export const CostumeSchema = z.object({
    heroId: z.string(),

    id: z.string(),
    wikiLink: z.string().optional(),
    name: z.string(),
    rarity: CostumeRaritySchema,
    customizable: z.boolean(),

    category: z.string(),
    source: z.string().optional(),
    sourceLink: z.string().optional(),
    theme: z.string().optional(),

    custom: z.boolean().optional(),
    customImage: DataUrlSchema.optional(),

    releaseDate: z.string().optional(),
})
export type Costume = z.infer<typeof CostumeSchema>;

export const COSTUMES = () => COSTUMES_DATA as Record<string, Costume[]>;

export function getHeroCostumes(heroId: string) {
    if (heroId.startsWith('__unknown_')) {
        const unknownHeroes = useLocalStorage<HeroData[]>('unknown_heroes', []);

        const heroData = unknownHeroes.value.find(h => h.id == heroId);
        if (!heroData)
            return [];

        return heroData.customCostumes ?? [];
    }

    return COSTUMES()[heroId] ?? [];
}
export function getCostumesAsList() {
    const allCostumes: Costume[] = [];
    Object.values(COSTUMES()).forEach(c => allCostumes.push(...c));
    
    return allCostumes;
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

    return `/img/cosmetics/categories/${icon}`;
}

export const COSTUME_CATEGORY_ORDER: string[] = [
    'Permanent',
    'Limited Time',
    'Lucky Draw',
    'Achievements',
    'Code Redeemable',
    'Limited Time',
    'Free Event Reward',
    'Premium Event Reward',
    'Free Battle Pass',
    'Luxury Battle Pass',
    'Closed Alpha Test',
    'Closed Beta Test',
    'Twitch Drop',
    'PlayStation Exclusive',
    'Ranked Reward',
    'Pick-Up Bundle Exclusive',
    'Disney+ Exclusive',
    'Esports'
];

export function getAllCategories(heroId?: string) {
    const source = heroId ? getHeroCostumes(heroId) : Object.values(COSTUMES()).flatMap(o => o);

    const categories = new Set<string>(source.map(c => c.category));

    const array = Array.from(categories);
    array.sort((a, b) => {
        let indexA = COSTUME_CATEGORY_ORDER.indexOf(a);
        let indexB = COSTUME_CATEGORY_ORDER.indexOf(b);
        if (indexA == -1 && indexB != -1)
            return 1;
        if (indexB == -1 && indexA != -1)
            return -1;
        if (indexA == -1 && indexB == -1)
            return 0;

        return indexA - indexB;
    });

    return array;
}

export function getAllSources(heroId?: string) {
    const source = heroId ? getHeroCostumes(heroId) : Object.values(COSTUMES()).flatMap(o => o);
    
    const sources = new Set<string>(source.filter(c => !!c.source).map(c => c.source!));

    return Array.from(sources);
}

export function getAllThemes(heroId?: string) {
    const source = heroId ? getHeroCostumes(heroId) : Object.values(COSTUMES()).flatMap(o => o);

    const themes = new Set<string>(source.filter(c => !!c.theme).map(c => c.theme!));

    return Array.from(themes);
}

export function getAllPropertyValuesFromList(
    list: string[],
    property: 'heroId'|'category'|'source'|'theme'
) {
    const costumesByIds = Object.fromEntries(
        getCostumesAsList().filter(c => list.includes(c.id))
                           .map(c => [c.id, c])
    );

    const allPropertyValues = new Set<string>();
    Object.entries(costumesByIds).forEach(([id, c]) =>
        c[property] ? allPropertyValues.add(c[property]) : null
    );

    return Array.from(allPropertyValues);
}

export function convertCostumeId(oldId: string) {
    return (OCEANHILLMAN_CONVERSION_MAP as Record<string, string>)[oldId];
}

export const CostumeCollectionSchema = z.object({
    id: z.uuidv4().optional(),
    owner: z.string().optional(),
    title: z.string(),
    items: z.array(z.string())
});
export type CostumeCollection = z.infer<typeof CostumeCollectionSchema>;

export const CostumeCollectionStoreSchema = z.array(CostumeCollectionSchema);

export const OFFICIAL_COLLECTIONS: () => Record<string, CostumeCollection> = () => ({
    '616-vault-2026': {
        title: '616 VAULT (2026)',
        items: [
            "1025302","1035301","1024303","1048502","1050502","1020302","1031303","1051301",
            "1051300","1039300","1017502","1014502","1041301","1052502","1018301","1033502",
            "1051502"
        ]
    },
    'summer-2026': {
        title: 'SUMMER (2026)',
        items: ["1022303","1016504","1060501","1033504","1055300","1053302","1040303","1025305","1018305","1036301"]
    },
    'summer': {
        title: 'SUMMER',
        items: [
            "1033504","1055300","1053302","1040303","1025305","1018305","1036301","1020302",
            "1031303","1051300","1051301","1017502","1039300","1048502","1016301","1014502",
            "1050502","1022303","1016504","1060501"
        ]
    }
})