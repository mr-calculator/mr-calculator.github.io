import 'dotenv/config';
import fs from "fs";
import path from "path";
import * as p from "@clack/prompts";
import sharp from "sharp";
import { HERO_LIST } from '../../app/assets/data/heroes';

export const BASE = `./scripts/parse-nameplates`;
export const NAMEPLATES_FILE =          './app/assets/data/cosmetics/nameplates/nameplates.json';
export const NAMEPLATES_FILE_BACKUP =   './app/assets/data/cosmetics/nameplates/nameplates_%DATE%.backup.json';
export const NAMEPLATE_THEMES_DIR = './public/img/cosmetics/themes';

// Note: Nameplate Will of Galacta [Invisible Woman] (31052210) has the wrong id, it should be: 31050210
// I ain't writing an exception for that

/**
 * With FModel: `Path/to/FModel/Output/Exports/Marvel/Content/Marvel/UI/Textures`
 * 
 * PAK path: `Marvel/Content/Marvel/UI/Textures`
 */
const GAME_FILES_DIRECTORY = process.env.GAME_FILES_DIRECTORY!;
/**
 * When using FModel, only extract the `Marvel/Content/Marvel/UI/Textures/Show/Playerhead` path
 * 
 * Extract from pak: `pakchunkHQ-Windows.utoc` and `Patch_-Windows_X.X.XXXXXXXX_P.utoc`
 * 
 * Make sure you have the most up to date mapping file (especially for `Patch` paks).
 * 
 * *Note: If a nameplate is not found, it may appear in the `Mall` path.*
 */
const NAMEPLATE_IMAGES_PATH = 'Show/Nameplate/img_nameplate_%NAMEPLATE_ID%';
const NAMEPLATE_ICONS_PATH = 'Show/Playerhead/img_playerhead_%NAMEPLATE_ID%';

/**
 * In case a nameplate is not found in the common path for nameplates, add it's special path here
 */
const NAMEPLATE_SPECIFIC_PATHS: Record<string, [image: string, icon: string]> = {
    "31054206": [
        'Mall/1030302And1054501/img_nameplate_31054206',
        'Mall/1030302And1054501/img_playerhead_31054206',
    ],
    "31030207": [
        'Mall/1030302And1054501/img_nameplate_31030207',
        'Mall/1030302And1054501/img_playerhead_31030207'
    ]
}

export function toKebabCase(string: string) {
	return string.replace(/\s+/g, '-')
				.replace(/[^a-zA-Z0-9-_]/g, '')
				.replace(/-+/g, '-')
				.replace(/^-+|-+$/g, '')
				.toLowerCase();
}

export function fileNameFriendlyDate(date: Date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const millis = date.getUTCMilliseconds();
    return `${year}-${month}-${day}.${hours}-${minutes}-${seconds}-${millis}`;
}

export type NameplateRarity = 'legendary'|'epic'|'rare'|'common';
export type Nameplate = {
    type: 'normal'|'animated',

    id: string,
    name: string,
    rarity: NameplateRarity,

    sourceFull: string,

    category?: string,
    source?: string,
    sourceLink?: string,

    theme?: string,

    releaseDate?: string,
}
export type NameplateWithImageLink = Nameplate & { imageLink: string };

export function innerText(el: Element|undefined|null): string|undefined {
    if (!el)
        return undefined;

    el.querySelectorAll('br').forEach(br => br.replaceWith(' '));
    return el.textContent?.replace(/\s+/g, ' ')?.trim();
}

export function filterHeroName(nameplateName: string): string {
    let filtered = nameplateName;
    for (const hero of HERO_LIST) {
        const escaped = hero.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filtered = filtered.replace(new RegExp(`[\\[(]\\s*${escaped}\\s*[\\])]]*\\s*`, 'gi'), '').trim();
    }

    if (!filtered)
        return nameplateName;

    return filtered;
}
export function filterSeasonSpecifier(text: string) {
    return text.replace(/\(\s*S.*\)\s*/gi, '').trim();
}

export function forEachTable(callback: (table: string) => void) {
    const tablesPath = path.join(BASE, 'tables');
    const tables = fs.readdirSync(tablesPath);

    tables.forEach(t => {
        const tablePath = path.join(tablesPath, t);
        if (!fs.existsSync(tablePath))
            return;

        const table = fs.readFileSync(tablePath, { encoding: 'utf-8' });
        callback(`<table><tbody>${table}</tbody></table>`);
    });
}

type SecondaryId = {
    field: keyof NameplateWithImageLink;
    value: string;
}
type RemoveAction = {
    secondaryId: SecondaryId,
    action: 'remove'
}
type ReassignIdAction = {
    secondaryId?: SecondaryId,
    action: 'reassign-id',
    newId: string
}
type MistakeAction = RemoveAction | ReassignIdAction;
const KNOWN_MISTAKES: Record<string, MistakeAction> = {
    "31058001": {
        secondaryId: {
            field: 'name',
            value: "Thieves Guildmaster"
        },
        action: 'reassign-id',
        newId: '31058201'
    },
    "31058203": {
        secondaryId: {
            field: 'name',
            value: "Bloody Butler"
        },
        action: 'reassign-id',
        newId: '31059202'
    },
    "31060003": {
        secondaryId: {
            field: 'name',
            value: "Amazing White Fox"
        },
        action: 'reassign-id',
        newId: '31060004'
    },

    // invisible woman galacta twitch drop
    "31052210": {
        action: 'reassign-id',
        newId: "31050210"
    }
}

export function fixMistakes(nameplates: NameplateWithImageLink[]) {
    return nameplates.filter((np, i) => {
        const wrong = KNOWN_MISTAKES[np.id];
        if (!wrong)
            return true;

        // if its the correct one
        if (
            wrong.secondaryId
         && np[wrong.secondaryId.field] !== wrong.secondaryId.value
        )
            return true;

        // it's not the correct one or has no secondary id, which means we
        // are not working with a duplicate, but a single erroneous nameplates

        // if we need to remove it
        if (wrong.action === 'remove')
            return false;

        // if we need to change its id
        if (wrong.action == 'reassign-id')
            np.id = wrong.newId;
        
        return true;
    })
}

export async function fetchThemeIcon(src: string, id: string) {
    const iconPath = path.join(NAMEPLATE_THEMES_DIR, id + '.webp');
    if (fs.existsSync(iconPath))
        return;

    if (src.startsWith('data:'))
        p.log.error(`Theme [${id}] has a malformed icon image src attribute!`);
    else {
        try {
            const res = await fetch(src);
            const buffer = await res.arrayBuffer();
            fs.writeFileSync(iconPath, Buffer.from(buffer));
        }
        catch (e) {
            p.log.error(`Failed to fetch theme [${id}] from [${src}]`);
            p.log.error(`${e}`);
        }
    }
}

export async function fetchNameplate(id: string, link: string) {
    const nameplatesDir = `./public/img/cosmetics/items/nameplates`;
    const nameplatePath = path.join(nameplatesDir, id + '_animated.webp');

    if (fs.existsSync(nameplatePath)) {
        p.log.info(`Nameplate [${id}] (animated) already has gif image, skipping`);
        return;
    }

    if (link.startsWith('data:'))
        p.log.error(`Nameplate [${id}] has a malformed icon image src attribute!`);
    else {
        try {
            const res = await fetch(link);
            const buffer = await res.arrayBuffer();

            await sharp(buffer, { animated: true })
                .resize(500)
                .webp({ quality: 85 })
                .toFile(nameplatePath)

            // fs.writeFileSync(nameplatePath, Buffer.from(buffer));
        }
        catch (e) {
            p.log.error(`Failed to fetch nameplate [${id}] from [${link}]`);
            p.log.error(`${e}`);
        }
    }
}

export function createDiff(newNameplates: NameplateWithImageLink[], oldNameplates: Nameplate[]) {
    const diffNameplates: NameplateWithImageLink[] = newNameplates.filter(nc => !oldNameplates.find(oc => oc.id === nc.id));
    return diffNameplates;
}

export async function copyNameplateImages(nameplates: Nameplate[]) {
    await Promise.all(nameplates.map(async (nameplate) => {
        const nameplatesIconsDir = `./public/img/cosmetics/items/nameplates`;
        
        const resourcePath = NAMEPLATE_SPECIFIC_PATHS[nameplate.id]?.[0]
                        ?? NAMEPLATE_IMAGES_PATH.replaceAll('%NAMEPLATE_ID%', nameplate.id);
        const resourceFullPath = path.join(GAME_FILES_DIRECTORY, resourcePath) + '.png';

        if (!fs.existsSync(resourceFullPath)) {
            p.log.error(`Couldn\'t find nameplate image [${nameplate.name} (${nameplate.id})], skipping.`);
            return;
        }

        if (!fs.existsSync(nameplatesIconsDir))
            fs.mkdirSync(nameplatesIconsDir, { recursive: true });

        
        await sharp(resourceFullPath)
            .webp({ quality: 85 })
            .toFile(path.join(nameplatesIconsDir, nameplate.id) + '.webp')
    }));

    await Promise.all(nameplates.map(async (nameplate) => {
        const nameplatesIconsDir = `./public/img/cosmetics/items/icons`;
        
        const resourcePath = NAMEPLATE_SPECIFIC_PATHS[nameplate.id]?.[1]
                        ?? NAMEPLATE_ICONS_PATH.replaceAll('%NAMEPLATE_ID%', nameplate.id);
        const resourceFullPath = path.join(GAME_FILES_DIRECTORY, resourcePath) + '.png';

        if (!fs.existsSync(resourceFullPath)) {
            p.log.error(`Couldn\'t find nameplate icon [${nameplate.name} (${nameplate.id})], skipping.`);
            return;
        }

        if (!fs.existsSync(nameplatesIconsDir))
            fs.mkdirSync(nameplatesIconsDir, { recursive: true });

        await sharp(resourceFullPath)
            .webp({ quality: 85 })
            .toFile(path.join(nameplatesIconsDir, nameplate.id) + '.webp')
    }));
}