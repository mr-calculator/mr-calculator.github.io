import * as p from '@clack/prompts'
import { makeHeroFile } from './make-hero-file'
import { copyImages } from './appropriate-images'
import { scrapeData } from './scrape-stats'

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
    p.intro('Add a new hero')

    const hero = await p.group(
        {
            name: () => p.text({
                message: 'Hero name',
                placeholder: 'Luna Snow',
                validate: v => !v ? 'Name is required' : undefined
            }),

            id: ({ results }) => p.text({
                message: 'String ID (leave empty to infer)',
                placeholder: results.name?.  replace(/\s+/g, "-")
                                            // Remove all characters except alphanumeric, dash, and underscore
                                            .replace(/[^a-zA-Z0-9-_]/g, "")
                                            // Replace multiple dashes with a single dash
                                            .replace(/-+/g, "-")
                                            // Trim leading and trailing dashes
                                            .replace(/^-+|-+$/g, "")
                                            .toLowerCase(),
            }),
            internalId: () => p.text({
                message: 'Internal ID',
                placeholder: '1070',
                validate: v => !v ? 'ID is required' : undefined
            }),

            color: () => p.text({
                message: 'Theme color (hex)',
                placeholder: '#00aaff',
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
                placeholder: '21000',
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
                placeholder: '21000',
                validate: v => isNaN(parseFloat(v ?? 'NaN')) ? 'Must be a number' : undefined
            }),

            confirm: ({ results }) => p.confirm({
                message: `Create hero "${results.name}"?`
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

    const id = (hero.id || hero.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()) as string

    const spinner = p.spinner()

    spinner.start('Writing hero file...');
    makeHeroFile({...(hero as any), id});
    spinner.stop('Wrote hero file.');


    spinner.start('Copying images...');
    await copyImages(hero.internalId, id);
    spinner.stop('Images copied and converted');

    if (hero.roles.length == 1) {
        spinner.start('Scraping hero stats...');
        await scrapeData(hero.internalId, id, hero.roles[0])
        spinner.stop('Scraped hero stats, modified files');
    }
    else
        p.log.info('Cannot scrape hero stats as roles are either none or more than 1');

    p.outro('Hero added successfully!');
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

/**
 * Example usage:
 *  makeHeroFile({
        id: 'white-fox',
        name: 'White Fox',
        roles: ['strategist'],
        color: '#64d5e3',
        mission1: 'heal',
        mission1Req: '5400',
        mission2: 'kos_assists',
        mission2Req: '15',
    });
 */