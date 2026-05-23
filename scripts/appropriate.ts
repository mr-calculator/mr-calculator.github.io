import * as p from "@clack/prompts";
import { copyImages, FILES, ResourceId } from "./add-hero/appropriate-images";
import { fileNameFriendlyDate } from "./add-hero/scrape-stats";
import fs from "fs";
import path from "path";

const HEROES_DIR = `./public/img/heroes/`;
const HEROES_DATA_DIR = `./public/img/heroes/data/`;

const HERO_ID_CONV_PATH = './scripts/add-hero/hero-id-conversion.json';
function getHeroesFile(): Record<string, string> {
    return JSON.parse(fs.readFileSync(HERO_ID_CONV_PATH, { encoding: 'utf-8' }));
}

async function main() {
    p.intro('Appropriate is going to copy and convert all hero resources specified (images) from the specified game files directory.');

    const selection = await p.multiselect({
        message: 'Select which resources to copy',
        options: Object.keys(FILES).map(key => ({
            label: key,
            value: key
        }))
    });

    if (typeof selection === 'symbol') {
        p.cancel('Canceled');
        process.exit(0);
    }

    p.log.info('Making a backup of the heroes data folder...');
    const backupDest = path.join(HEROES_DIR, `data-backup_${fileNameFriendlyDate(new Date())}`);
    fs.cpSync(
        HEROES_DATA_DIR,
        backupDest,
        {
            recursive: true,
        }
    );
    p.log.info(`Backup made at ${backupDest}`);


    p.log.info('Copying all images for all heroes...');

    const heroes = getHeroesFile();
    p.log.info('Using `./add-hero/hero-id-conversion.json`');

    for (const [ id, internalId ] of Object.entries(heroes))
        await copyImages(internalId, id, p.log, selection as ResourceId[]);

    p.outro('Copied all images.');
}

try {
    await main()
}
catch(err) {
    p.log.error(err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack)
        p.log.error(err.stack);

    process.exit(1);
}