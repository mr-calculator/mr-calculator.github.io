import fs from "fs";
import { JSDOM } from 'jsdom';
const { DOMParser } = new JSDOM().window;
import * as p from '@clack/prompts'
import { BASE, copyNameplateImages, Nameplate, NameplateRarity, NAMEPLATES_FILE, NAMEPLATES_FILE_BACKUP, createDiff, fetchThemeIcon, fileNameFriendlyDate, forEachTable, innerText, toKebabCase, fetchNameplate, NameplateWithImageLink, filterHeroName, filterSeasonSpecifier, fixMistakes } from './util';
import { NAMEPLATE_RARITIES } from './data';
import path from "path";

async function parseTable(nameplates: Nameplate[], table: string, themesIconSources: Record<string, string>) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(table, 'text/html');
    const rows = doc.querySelectorAll('tr');

    const extracted = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');

        if (!cells || cells.length != 9)
            return null;

        const theme = cells[1].querySelector('span[typeof="mw:File"] a')
                        ?.getAttribute('title')
                        ?.replaceAll('Theme: ', '') 
                        ?.replace(/(MARVEL RIVALS)\s*/gi, '')
                    ?? undefined;
        if (theme) {
            const themeId = toKebabCase(theme);
            const themeIconSrc = cells[1].querySelector('span[typeof="mw:File"] a img')?.getAttribute('src') ?? undefined;

            if (themeIconSrc)
                themesIconSources[themeId] = themeIconSrc;
        }

        const image = cells[3].querySelector('div span[typeof="mw:File"] a')?.getAttribute('href') ?? undefined;
        const type = image?.includes('.gif') ? 'animated' : 'normal';

        let name = innerText(cells[4].querySelector('font span'));
        if (name)
            name = filterHeroName(name);
        
        const rarity: NameplateRarity = NAMEPLATE_RARITIES[cells[5].getAttribute('data-sort-value') ?? '02 - Common'];
        const internalId = cells[6]?.textContent.trim();

        const sourceFull = innerText(cells[8].querySelector('span font'))

        let source = cells[8].querySelector('span font a')?.getAttribute('title') ?? undefined;
        if (source)
            source = filterHeroName(source);

        let category = innerText(cells[8].querySelector('span font u')) ?? undefined;
        if (category) {
            if (category?.endsWith(':'))
                category = category.slice(0, category.length - 1);

            category = filterHeroName(category);
            category = filterSeasonSpecifier(category);
        }

        const sourceLink = cells[8].querySelector('span font a')?.getAttribute('href') ?? undefined;

        const releaseDate = cells[7].querySelector('span font')?.textContent?.replace(/([^0-9-])/g, '');

        // not existing check
        if ([internalId, name, rarity, sourceFull, image, releaseDate].some(f => typeof f === 'undefined')) {
            p.log.error(`Nameplate [${name ?? internalId ?? 'unknown'}] doesn't have enough fields, skipping`);
            return null;
        }

        return {
            type: type as Nameplate['type'],
            id: internalId.trim(),
            name: name!.trim(),
            rarity: rarity,

            sourceFull: sourceFull!.trim(),

            category: category?.trim(),
            source: source?.trim(),
            sourceLink,

            theme: theme?.trim(),

            releaseDate: releaseDate?.trim(),

            imageLink: image!
        } satisfies NameplateWithImageLink;
        
    }).filter(Boolean);

    nameplates.push(
        ...(extracted as NameplateWithImageLink[])
    );
}

/**
 * Note: Make sure to load all images (scroll) in the table as they might have a data: in the src attribute of images that messes with the script.
 * 
 * Can also look (CTRL+F in dev tools) for this specific image: `data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAQAICTAEAOw%3D%3D`.
 */
async function main() {
    p.intro('Parse a table from MR Wiki/Nameplates to extract bulk data.')
    p.log.info(
        'This expects the tables to exist in `./scripts/parse-nameplates/tables/` (only <tr> elements of the <tbody>)'
    );

    let nameplatesWithLink: NameplateWithImageLink[] = [];
    const themesIconSources: Record<string, string> = {};
    forEachTable(t => parseTable(nameplatesWithLink, t, themesIconSources));
    nameplatesWithLink = fixMistakes(nameplatesWithLink);

    p.log.info(`Fetching theme icons from wiki...`);
    await Promise.all(Object.entries(themesIconSources).map(([id, src]) => fetchThemeIcon(src, id)));

    let previousNameplates: Nameplate[] = [];
    if (fs.existsSync(NAMEPLATES_FILE)) {
        previousNameplates = JSON.parse(fs.readFileSync(NAMEPLATES_FILE, { encoding: 'utf-8' }));
    }

    p.log.info(`Creating nameplates diff...`);
    const nameplatesDiff = createDiff(nameplatesWithLink, previousNameplates);


    if (nameplatesDiff.length) {
        if (fs.existsSync(NAMEPLATES_FILE)) {
            // make a backup in case things go south
            p.log.info(`Making a backup of the previous nameplates file...`);
            fs.copyFileSync(NAMEPLATES_FILE, NAMEPLATES_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));
        }

        // combine diff with previous
        const newNameplates: Nameplate[] = nameplatesDiff.map(({ imageLink, ...rest }) => rest);
        const combinedNameplates: Nameplate[] = [...previousNameplates, ...newNameplates];
        const json = JSON.stringify(combinedNameplates, undefined, 4);

        // write combined
        fs.writeFileSync(NAMEPLATES_FILE, json);
        fs.writeFileSync(path.join(BASE, 'output', 'nameplates.json'), json);
        p.log.info(`Wrote nameplate list to \`${NAMEPLATES_FILE}\``);

        p.log.info(`Fetching new animated nameplate images from wiki...`);
        await Promise.all(
            nameplatesDiff.filter(e => e!.type == 'animated').map(e => {
                return fetchNameplate(e!.id, e!.imageLink);
            })
        );

        p.log.info(`Copying new nameplate images from the game files`);
        await copyNameplateImages(nameplatesDiff);

        p.outro(`Added ${nameplatesDiff.length} nameplates.`);
    }
    else
        p.log.warn(`Didn't have any new additions. Nothing was modified.`);

    p.outro('Parse finished');
}

try {
    await main();
}
catch(err) {
    p.log.error(err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack)
        p.log.error(err.stack);

    process.exit(1);
}