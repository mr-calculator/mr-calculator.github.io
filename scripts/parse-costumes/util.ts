import 'dotenv/config';
import fs from "fs";
import path from "path";
import * as p from "@clack/prompts";
import sharp from "sharp";

export const BASE = `./scripts/parse-costumes`;
export const COSTUMES_FILE =        './app/assets/data/cosmetics/costumes/costumes.json';
export const COSTUMES_FILE_BACKUP = './app/assets/data/cosmetics/costumes/costumes_%DATE%.backup.json';
export const COSTUME_THEMES_DIR = './public/img/cosmetics/themes';

/**
 * With FModel: `Path/to/FModel/Output/Exports/Marvel/Content/Marvel/UI/Textures`
 * 
 * PAK path: `Marvel/Content/Marvel/UI/Textures`
 */
const GAME_FILES_DIRECTORY = process.env.GAME_FILES_DIRECTORY!;
/**
 * When using FModel, only extract the `Marvel/Content/Marvel/UI/Textures/Show/Skin` path
 * 
 * Extract from pak: `pakchunkHQ-Windows.utoc` and `Patch_-Windows_X.X.XXXXXXXX_P.utoc`
 * 
 * Make sure you have the most up to date mapping file (especially for `Patch` paks).
 * 
 * *Note: If a skin is not found, it may appear in the `Mall` path.*
 */
const COSTUME_IMAGES_PATH = 'Show/Skin/img_skin_%COSTUME_ID%';

/**
 * In case a skin is not found in the common path for skins, add it's special path here
 */
const COSTUME_SPECIFIC_PATHS: Record<string, string> = {
    "1030302": "Mall/1030302And1054501/img_skin_1030302",
    "1054501": "Mall/1030302And1054501/img_skin_1054501",
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

export function innerText(el: Element|undefined|null): string|undefined {
    if (!el)
        return undefined;

    el.querySelectorAll('br').forEach(br => br.replaceWith(' '));
    return el.textContent?.replace(/\s+/g, ' ')?.trim();
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

export async function fetchThemeIcon(src: string, id: string) {
    const iconPath = path.join(COSTUME_THEMES_DIR, id + '.webp');
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

export function createDiff(newCostumes: Record<string, Costume[]>, oldCostumes: Record<string, Costume[]>) {
    // flatten both
    const flatNew: Costume[] = [];
    Object.entries(newCostumes).forEach(([_, costumes]) => {
        flatNew.push(...costumes);
    });

    const flatOld: Costume[] = [];
    Object.entries(oldCostumes).forEach(([_, costumes]) => {
        flatOld.push(...costumes);
    });

    const diffCostumes: Costume[] = flatNew.filter(nc => !flatOld.find(oc => oc.id === nc.id));
    return diffCostumes;
}

export async function copyCostumeImages(costumes: Costume[]) {
    function getSharpBase(resourceFullPath: string, heroId: string) {
        const extracts: Record<string, Parameters<sharp.Sharp['extract']>[0]> = {
            'jeff-the-land-shark': { left: 105, top: 0, width: 560, height: 380 },
            'devil-dinosaur': { left: 0, top: 0, width: 530, height: 484 },
        };

        const extract = extracts[heroId];
        const base = sharp(resourceFullPath);
        return extract ? base.extract(extract) : base;
    }

    await Promise.all(costumes.map(async (costume) => {
        const heroCostumesDir = `./public/img/heroes/data/${costume.heroId}/costumes/`;
        
        const resourcePath = COSTUME_SPECIFIC_PATHS[costume.id]
                        ?? COSTUME_IMAGES_PATH.replaceAll('%COSTUME_ID%', costume.id);
        const resourceFullPath = path.join(GAME_FILES_DIRECTORY, resourcePath) + '.png';

        if (!fs.existsSync(resourceFullPath)) {
            p.log.error(`Couldn\'t find costume [${costume.name} (${costume.id})] for [${costume.heroId}], skipping.`);
            return;
        }

        if (!fs.existsSync(heroCostumesDir))
            fs.mkdirSync(heroCostumesDir, { recursive: true });

        await Promise.all([
            getSharpBase(resourceFullPath, costume.heroId)
                .webp({ quality: 85 })
                .toFile(path.join(heroCostumesDir, costume.id) + '.webp'),

            getSharpBase(resourceFullPath, costume.heroId)
                .resize(200, 250, {
                    fit: 'cover',
                    position: 'centre'
                })
                .webp({ quality: 85 })
                .toFile(path.join(heroCostumesDir, costume.id) + '_200.webp'),
        ]);
    }));
}