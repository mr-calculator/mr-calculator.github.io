import * as p from '@clack/prompts'
import fs from 'fs';
import { makeHeroFile } from './make-hero-file'
import { copyImages } from './appropriate-images'
import { scrapeData } from './scrape-stats'
import { HeroData, HeroRole } from '~/assets/data/common';

export const HERO_FILE_PATH = `./app/assets/data/heroes/`;

interface HeroIdentity {
    name: string,
    id: string,
    internalId: string
}

/**
 * Adds a new hero to the calculator
 * Requests hero data (name, id, color, roles, missions) as input and filters and converts assets
 * into images from the game's extracted files, then fetches average statistics for the hero from
 * RivalsMeta, processes and averages them, adding them to the average-hero-stats.json file in
 * app/assets/data, also adding the match count to hero-matches.json in the same directory.
 * 
 * Due to the scraping nature of this script, please do not abuse the RivalsMeta API. Do not spam
 * requests to their endpoints. Their tool is awesome and does not deserve abuse!
 * 
 * This script automatically infers mission requirements and rewards. You only need to input one
 * requirement amount for every mission and the rest is done automatically. If a mission could not be
 * inferred it is filled with 0-values. Fill manually if that happens.
 * 
 * This script's asset "appropriation" functions require you to have already extracted the game files.
 * I am not responsible of any ToS/EULA violations that result from anyone's extractions. Be careful
 * to not get your accounts banned!
 * 
 * A hero's color can be found in the Proficiency Page of the hero or from the wiki:
 * https://marvelrivals.fandom.com/wiki/Heroes#Hero_Roster (inspect element -> the .herocard-wrapper
 * will have a style attribute looking like this: style="--herocard-bg:#e29058;--imgx:0px;--imgy:0px;").
 * 
 * After the script is completed, the hero needs to be added to the list manually at:
 * app/assets/data/heroes.ts in the HERO_LIST array. From here, the app will automatically register
 * the hero everywhere.
 */
async function main() {
    p.intro('Add a new hero');

    const heroIdentity: HeroIdentity = (await p.group({
        name: () => p.text({
            message: 'Hero name',
            placeholder: 'e.g.: Luna Snow',
            validate: v => !v ? 'Name is required' : undefined
        }),

        id: ({ results }) => p.text({
            message: 'String ID (leave empty to infer)',
            placeholder: results.name ? inferHeroId(results.name) : 'e.g.: luna-snow'
        }),
        internalId: ({ results }) => p.text({
            message: 'Internal ID (leave empty to infer)',
            placeholder: inferInternalId((results.id as string) || inferHeroId(results.name!)) ?? 'e.g.: 1031',
            validate: v => {
                if (!v && !inferInternalId((results.id as string) || inferHeroId(results.name!)))
                    return 'ID is required';
            }
        }),
    }, {
        onCancel: () => {
            p.cancel('Cancelled')
            process.exit(0)
        }
    })) as HeroIdentity;

    if (!heroIdentity.id)
        heroIdentity.id = inferHeroId(heroIdentity.name);
    if (!heroIdentity.internalId)
        // will have been validated and confirmed to exist by now
        heroIdentity.internalId = inferInternalId(heroIdentity.id as string) as string;
    else {
        // let's see if we can expand the file with the new internal id - hero id pair
        const added = addInternalIdPair(heroIdentity.id, heroIdentity.internalId);
        if (added)
            p.log.info(`Added [${heroIdentity.id}]: ${heroIdentity.internalId} to the local pair collection.`);
    }

    if (fs.existsSync(`${HERO_FILE_PATH}${heroIdentity.id}.ts`)) {
        const choice = await p.select({
            message: 'Hero file exists, what would you like to do?',
            options: [
                { value: 'overwrite', label: 'Overwrite hero (Full)' },
                { value: 'stats', label: 'Scrape stats' },
                { value: 'images', label: 'Copy images' },
                { value: 'cancel', label: 'Cancel' },
            ]
        });

        const heroNameConst = heroIdentity.name.replace(/\s+/g, "");
        const { [heroNameConst]: heroData } = await import(
            `../../${HERO_FILE_PATH}${heroIdentity.id}.ts`
        ) as { [key: string]: HeroData };

        switch (choice) {
            case 'overwrite':
                await createHeroFull(heroIdentity);

                break;

            case 'stats':
                const roles = Array.isArray(heroData.roles) ? heroData.roles : [heroData.roles];
                await scrapeStats(heroIdentity.internalId, heroIdentity.id, roles);

                p.outro('Hero modification successful.');

                break;

            case 'images':
                const spinner = p.spinner();
                spinner.start('Copying images...');
                await copyImages(heroIdentity.internalId, heroIdentity.id, p.log);
                spinner.stop('Images copied and converted');

                p.outro('Hero modification successful.');

                break;

            case 'cancel':
            default:
                p.cancel('Cancelled')
                process.exit(0)
        }
    }
    else
        await createHeroFull(heroIdentity);
}

function inferHeroId(heroName: string) {
    return heroName
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

const HERO_ID_CONV_PATH = './scripts/add-hero/hero-id-conversion.json';
function inferInternalId(heroId: string): string|undefined {
    const ids = JSON.parse(fs.readFileSync(HERO_ID_CONV_PATH, { encoding: 'utf-8' }));

    return ids[heroId];
}

function addInternalIdPair(heroId: string, internalId: string) {
    const ids = JSON.parse(fs.readFileSync(HERO_ID_CONV_PATH, { encoding: 'utf-8' }));

    if (ids[heroId])
        return false;

    ids[heroId] = internalId;

    fs.writeFileSync(HERO_ID_CONV_PATH, JSON.stringify(ids, undefined, 4));

    return true;
}

async function createHeroFull(heroIdentity: HeroIdentity) {
    const hero = await p.group(
        {
            color: () => p.text({
                message: 'Theme color (hex)',
                placeholder: 'e.g.: #00aaff',
                validate: v => !/^#[0-9a-fA-F]{6}$/.test(v ?? '') ? 'Must be a valid hex color' : undefined
            }),

            roles: () => p.multiselect({
                message: 'Role(s)',
                options: [
                    { value: 'duelist', label: 'Duelist' },
                    { value: 'strategist', label: 'Strategist' },
                    { value: 'vanguard', label: 'Vanguard' },
                ]
            }),

            mission1: () => p.select({
                message: 'Mission 1',
                options: [
                    { value: 'damage', label: 'Damage' },
                    { value: 'heal', label: 'Heal' },
                    { value: 'damage_heal', label: 'Damage and Healing' },
                    { value: 'take_damage', label: 'Damage Blocked' },
                    { value: 'finals', label: 'Final Hits' },
                    { value: 'kos', label: 'KOs' },
                    { value: 'kos_assists', label: 'KOs and Assists' },
                ]
            }),
            mission1Req: () => p.text({
                message: 'Mission 1 Requirement',
                placeholder: 'e.g.: 21000',
                validate: v => isNaN(parseFloat(v ?? 'NaN')) ? 'Must be a number' : undefined
            }),
            mission2: () => p.select({
                message: 'Mission 2',
                options: [
                    { value: 'damage', label: 'Damage' },
                    { value: 'heal', label: 'Heal' },
                    { value: 'damage_heal', label: 'Damage and Healing' },
                    { value: 'take_damage', label: 'Damage Blocked' },
                    { value: 'finals', label: 'Final Hits' },
                    { value: 'kos', label: 'KOs' },
                    { value: 'kos_assists', label: 'KOs and Assists' },
                ]
            }),
            mission2Req: () => p.text({
                message: 'Mission 2 Requirement',
                placeholder: 'e.g.: 21000',
                validate: v => isNaN(parseFloat(v ?? 'NaN')) ? 'Must be a number' : undefined
            }),

            scrape: () => p.confirm({
                message: 'Scrape hero data?'
            }),

            confirm: () => p.confirm({
                message: `Create hero "${heroIdentity.name}"?`
            })
        },
        {
            onCancel: () => {
                p.cancel('Cancelled')
                process.exit(0)
            }
        }
    )

    if (!hero.confirm) {
        p.cancel('Cancelled')
        process.exit(0)
    }

    const spinner = p.spinner();

    spinner.start('Writing hero file...');
    makeHeroFile({...(heroIdentity as any), ...(hero as any)}, p.log);
    spinner.stop('Wrote hero file.');

    spinner.start('Copying images...');
    await copyImages(heroIdentity.internalId, heroIdentity.id, p.log);
    spinner.stop('Images copied and converted');

    if (hero.scrape)
        await scrapeStats(heroIdentity.internalId, heroIdentity.id, hero.roles);

    p.outro('Hero added successfully!');
}

async function scrapeStats(internalId: string, processedId: string, roles: HeroRole[]) {
    const spinner = p.spinner()

    if (roles.length == 1) {
        spinner.start('Scraping hero stats...');
        await scrapeData(internalId, processedId, roles[0], p.log)
        spinner.stop('Scraped hero stats, modified files');
    }
    else
        p.log.info('Cannot scrape hero stats as roles are either none or more than 1');
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