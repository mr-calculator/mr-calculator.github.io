import 'dotenv/config';
import fs from "fs";
import path from "path";
import * as p from "@clack/prompts";
import sharp from "sharp";

export const BASE = `./scripts/parse-costumes`;
export const COSTUMES_FILE = './app/assets/data/costumes.json';
export const COSTUMES_FILE_BACKUP = './app/assets/data/costumes_%DATE%.backup.json';
export const COSTUME_THEMES_DIR = './public/img/heroes/costume-themes';

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
    name: string,
    rarity: CostumeRarity,
    customizable: boolean,

    category: string,
    source?: string,
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
    for (const costume of costumes) {
        const heroCostumesDir = `./public/img/heroes/data/${costume.heroId}/costumes/`;
        const resourcePath = COSTUME_IMAGES_PATH.replaceAll('%COSTUME_ID%', costume.id);
        const resourceFullPath = path.join(GAME_FILES_DIRECTORY, resourcePath) + '.png'

        if (!fs.existsSync(resourceFullPath)) {
            p.log.error(`Couldn\'t find costume [${costume.name} (${costume.id})] for [${costume.heroId}], skipping.`);
            continue;
        }

        if (!fs.existsSync(heroCostumesDir))
            fs.mkdirSync(heroCostumesDir);

        if (costume.heroId === 'jeff-the-land-shark') {
            await sharp(resourceFullPath)
                .extract({ left: 105, top: 0, width: 560, height: 380 })
                .webp({ quality: 85 })
                .toFile(path.join(heroCostumesDir, costume.id) + '.webp');

            continue;
        }

        if (costume.heroId === 'devil-dinosaur') {
            await sharp(resourceFullPath)
                .extract({ left: 0, top: 0, width: 530, height: 484 })
                .webp({ quality: 85 })
                .toFile(path.join(heroCostumesDir, costume.id) + '.webp');

            continue;
        }

        await sharp(resourceFullPath)
            .webp({ quality: 85 })
            .toFile(path.join(heroCostumesDir, costume.id) + '.webp');
    }
}