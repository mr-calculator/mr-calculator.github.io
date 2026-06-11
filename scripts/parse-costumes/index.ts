import fs from "fs";
import { JSDOM } from 'jsdom';
const { DOMParser } = new JSDOM().window;
import * as p from '@clack/prompts'
import { BASE, copyCostumeImages, Costume, CostumeRarity, COSTUMES_FILE, COSTUMES_FILE_BACKUP, createDiff, fetchThemeIcon, fileNameFriendlyDate, forEachTable, innerText, toKebabCase } from './util';
import { COSTUME_RARITIES, WIKI_HERO_ID_MAP, WIKI_TYPE_SORT_ID_TO_NAME } from './data';
import path from "path";

async function parseTable(costumes: Costume[], table: string, themesIconSources: Record<string, string>) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(table, 'text/html');
    const rows = doc.querySelectorAll('tr');

    const extracted = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');

        if (!cells || cells.length != 11)
            return null;

        const theme = cells[1].querySelector('span[typeof="mw:File"] span')
                            ?.getAttribute('title')
                            ?.replaceAll('Theme: ', '')
                            ?.replace(/(MARVEL RIVALS)\s*/gi, '')
                        ?? undefined;
        if (theme) {
            const themeId = toKebabCase(theme);
            const themeIconSrc = cells[1].querySelector('span[typeof="mw:File"] span img')?.getAttribute('src') ?? undefined;

            if (themeIconSrc)
                themesIconSources[themeId] = themeIconSrc;
        }

        const customizable = !!cells[3].querySelector('span[typeof="mw:File"] span img');
        const name = innerText(cells[5].querySelector('font span b a'));
        const link = cells[5].querySelector('font span b a')?.getAttribute('href');
        
        const rarity: CostumeRarity = COSTUME_RARITIES[cells[6].getAttribute('data-sort-value') ?? '02 - Common'];
        const internalId = cells[7].querySelector('span font')?.textContent;

        let categorySortValue = cells[8].getAttribute('data-sort-value')?.match(/^([^\s]+)/)?.[0];
        const category = WIKI_TYPE_SORT_ID_TO_NAME[categorySortValue ?? 'default'];

        const source = cells[8].querySelector('font span span a')?.getAttribute('title')?.replaceAll('Category:', '')
                                                                                         .replaceAll('Costumes/Limited-Time Costumes', 'Shop/Limited-Time Costumes')
                                                                                         .replaceAll('Permanent Costumes', 'Shop') ?? undefined;

        const sourceLink = cells[8].querySelector('font span span a')?.getAttribute('href');
        const heroId = WIKI_HERO_ID_MAP[cells[9].querySelector('div span[typeof="mw:File"] span')?.getAttribute('title') ?? 'unknown'];
        const releaseDate = cells[10].querySelector('span font')?.textContent?.replace(/([^0-9-])/g, '');

        // not existing check
        if ([customizable, name, rarity, internalId, category, heroId, releaseDate].some(f => typeof f === 'undefined')) {
            p.log.error(`Hero [${heroId}] doesn't have enough fields, skipping`);
            return null;
        }

        return {
            heroId,

            id: internalId!,
            wikiLink: link ?? undefined,
            name: name!,
            rarity: rarity,
            customizable: customizable,

            category,
            source,
            sourceLink: sourceLink ?? undefined,
            theme,

            releaseDate,
        } satisfies Costume;
        
    }).filter(Boolean);

    costumes.push(...(extracted as Costume[]));
}

/**
 * Note: Make sure to load all images (scroll) in the table as they might have a data: in the src attribute of images that messes with the script.
 * 
 * Can also look (CTRL+F in dev tools) for this specific image: `data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAQAICTAEAOw%3D%3D`.
 */
async function main() {
    p.intro('Parse a table from MR Wiki/Costumes/List_by_Release_Date to extract bulk data.')
    p.log.info(
        'This expects the tables to exist in `./scripts/parse-costumes/tables/` (only <tr> elements of the <tbody>)'
    );

    // parse from html
    const costumes: Costume[] = [];
    const themesIconSources: Record<string, string> = {};
    forEachTable(t => parseTable(costumes, t, themesIconSources));

    // get all theme icons from wiki
    p.log.info(`Fetching theme icons from wiki...`);
    for (const [id, src] of Object.entries(themesIconSources))
        await fetchThemeIcon(src, id);

    // map to heroes
    const costumesByHeroes: Record<string, Costume[]> = {};
    costumes.forEach(c => {
        if (!costumesByHeroes[c.heroId])
            costumesByHeroes[c.heroId] = [];

        costumesByHeroes[c.heroId].push(c);
    });

    // get previous costumes
    let previousCostumes: Record<string, Costume[]> = {};
    if (fs.existsSync(COSTUMES_FILE)) {
        previousCostumes = JSON.parse(fs.readFileSync(COSTUMES_FILE, { encoding: 'utf-8' }));
    }

    p.log.info(`Creating costumes diff...`);
    const costumesDiff = createDiff(costumesByHeroes, previousCostumes);

    if (costumesDiff.length) {
        if (fs.existsSync(COSTUMES_FILE)) {
            p.log.info(`Making a backup of the previous costumes file...`);
            // make a backup in case things go south
            fs.copyFileSync(COSTUMES_FILE, COSTUMES_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));
        }

        // merge new costumes with previous costumes
        const mergedCostumes: Record<string, Costume[]> = JSON.parse(JSON.stringify(previousCostumes));
        costumesDiff.forEach((costume) => {
            if (!mergedCostumes[costume.heroId])
                mergedCostumes[costume.heroId] = [];

            mergedCostumes[costume.heroId].push(costume);
        });

        const json = JSON.stringify(mergedCostumes, undefined, 4);

        fs.writeFileSync(COSTUMES_FILE, json);
        fs.writeFileSync(path.join(BASE, 'output', 'costumes.json'), json);
        p.log.info(`Wrote costume list to \`${COSTUMES_FILE}\``);

        p.log.info(`Copying new costume images from the game files`);
        await copyCostumeImages(costumesDiff);

        p.outro(`Added ${costumesDiff.length} costumes.`);
    }
    else
        p.log.warn(`Didn't have any new additions. Nothing was modified.`);

    p.outro('Parse finished.')
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