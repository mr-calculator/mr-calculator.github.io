import * as p from '@clack/prompts';
import fs from 'fs';
import { AVG_FINAL_HITS_FILE, AVG_FINAL_HITS_FILE_BACKUP, ENDPOINT, fileNameFriendlyDate, HeroData, MATCHES_FILE, MATCHES_FILE_BACKUP, scrapeData, STATS_FILE, STATS_FILE_BACKUP } from './scrape-stats';
import clipboard from 'clipboardy';
import { HERO_LIST } from '../../app/assets/data/heroes';
import { checkCancel, inferInternalId } from './util';
import { withIndices } from '../../app/utils/util';

const INCOMPLETE_FINAL_HITS_DIR = './scripts/add-hero/cache/incomplete-final-hits';
type IncompleteFinalHitsSave = {
    id: string,
    savedAt: Date,
    heroes: ([string, number])[],
    data: Record<string, number[]>
}

function getIncompleteFinalHits(): IncompleteFinalHitsSave[] {
    const savesList = fs.readdirSync(INCOMPLETE_FINAL_HITS_DIR);

    const saves: IncompleteFinalHitsSave[] = []
    for (const save of savesList) {
        const saveFullPath = `${INCOMPLETE_FINAL_HITS_DIR}/${save}`;
        const data: Record<string, number[]> = JSON.parse(fs.readFileSync(saveFullPath, { encoding: 'utf-8' }));

        saves.push({
            id: save.slice(0, save.length - '.json'.length),
            savedAt: fs.statSync(saveFullPath).birthtime,
            heroes: Object.entries(data).map(([heroId, finals]) => [heroId, finals.length]),
            data
        });
    }

    return saves;
}

function balancedSample(players: HeroData['players'], count: number, bins = 5) {
    const binSize = Math.ceil(players.length / bins);
    const groups: HeroData['players'][] = Array.from({ length: bins }, (_, i) =>
        players.slice(i * binSize, (i + 1) * binSize)
    );

    const perBin = Math.ceil(count / bins);
    const result: HeroData['players'] = [];
    for (const g of groups) {
        if (!g.length) continue;
        // deterministic: sort by player_uid for stable ordering, then take evenly spaced picks
        const stableSorted = [...g].sort((a, b) => a.player_uid - b.player_uid);
        const step = Math.max(1, Math.floor(stableSorted.length / perBin));
        for (let i = 0; i < stableSorted.length && result.length < count; i += step) {
            result.push(stableSorted[i]);
            if (result.filter(p => g.includes(p)).length >= perBin) break;
        }
    }

    // deterministic fallback: just walk the full original list for any remaining slots
    let fallbackIdx = 0;
    while (result.length < count && fallbackIdx < players.length) {
        if (!result.includes(players[fallbackIdx]))
            result.push(players[fallbackIdx]);
        fallbackIdx++;
    }

    return result.slice(0, count);
}

async function getHeroData(heroInternalId: string, season: string) {
    // request RivalsMeta API
    let data: HeroData|null = null;
    try {
        const res = await fetch(ENDPOINT.replace('%CHARACTER_ID%', heroInternalId) + season);
        data = await res.json();
    }
    catch (err) {
        p.log.error(err instanceof Error ? err.message : String(err));
        if (err instanceof Error && err.stack)
            p.log.error(err.stack);
    }

    if (!data) {
        p.log.error(`Data for ${heroInternalId} could not be processed`);
        return;
    }
    if (!data.players?.length) {
        p.log.error(`Data for ${heroInternalId} did not include any players`);
        return;
    }

    return data;
}

async function askForPrevious(): Promise<{ id?: string, data: Record<string, number[]>}|null> {
    const saved = getIncompleteFinalHits();

    if (saved.length == 0) {
        const inputPreviousFinals = await p.select({
            message: 'Input a previous (or possibly incomplete) hero final hits map?',
            options: [
                {
                    label: 'Yes',
                    value: true,
                },
                {
                    label: 'No',
                    value: false
                }
            ]
        });
        checkCancel(inputPreviousFinals);

        if (inputPreviousFinals) {
            const previousFinals = await p.text({
                message: 'Pase the JSON:',
                validate: v => {
                    if (!v)
                        return 'Nothing was pasted!';

                    try {
                        const parsed = JSON.parse(v);
                        if (typeof parsed !== 'object' || Array.isArray(parsed))
                            throw new Error('JSON is not an object!');
                    }
                    catch(e) { return 'JSON is invalid! ' + e }

                    return undefined;
                }
            });
            checkCancel(previousFinals);

            return { data: JSON.parse(previousFinals as string) };
        }

        return null;
    }

    function displaySaveAtAGlance(save: IncompleteFinalHitsSave) {
        const date = new Date(save.savedAt).toLocaleString();
        const list = save.heroes.map(([h, finals]) => `${h}: ${finals}`).join(', ');
        return `[${save.id}] (${date}): ${list}`
    }

    if (saved.length == 1) {
        p.log.info(`One saved heroes final hits file has been found.`);
        p.log.info(displaySaveAtAGlance(saved[0]));
        const loadSave = await p.select<boolean|'clear'>({
            message: 'Would you like to load it?',
            options: [
                {
                    label: 'Yes',
                    value: true,
                },
                {
                    label: 'No',
                    value: false
                },
                {
                    label: 'Clear save',
                    value: 'clear'
                }
            ]
        });
        checkCancel(loadSave);

        if (loadSave == 'clear') {
            fs.unlinkSync(`${INCOMPLETE_FINAL_HITS_DIR}/${saved[0].id}.json`);
            p.log.success(`Save ${saved[0].id} has been removed. In case this was an accident, here's the data it contained:`);
            p.log.message(JSON.stringify(saved[0].data));

            return null;
        }

        if (loadSave)
            return { id: saved[0].id, data: saved[0].data };

        return null;
    }

    const selectedSave = await p.select<false|'clear'|IncompleteFinalHitsSave>({
        message: 'Saves have been found, what would you like to do?',
        options: [
            {
                label: 'Ignore',
                value: false
            },
            ...saved.map(save => ({
                label: displaySaveAtAGlance(save),
                value: save
            })),
            {
                label: 'Clear saves',
                value: 'clear'
            }
        ]
    });
    checkCancel(selectedSave);

    if (selectedSave == 'clear') {
        for (const save of saved) {
            fs.unlinkSync(`${INCOMPLETE_FINAL_HITS_DIR}/${save.id}.json`);
            p.log.success(`Save ${save.id} has been removed. In case this was an accident, here's the data it contained:`);
            p.log.message(JSON.stringify(save.data));
        }

        return null;
    }

    if (selectedSave === false)
        return null;

    return { id: (selectedSave as IncompleteFinalHitsSave).id, data: (selectedSave as IncompleteFinalHitsSave).data }
}

async function create(season: string, heroesOut: Record<string, HeroData>, specificHeroIds: string[]|null = null) {
    const saved = await askForPrevious();
    if (saved)
        p.log.success(`Registered ${Object.keys(saved.data).length} heroes.`);

    function saveProgress(
        message: (uuid: string) => string = 
            uuid => `Operation was forcefully cancelled. Final Hits JSON has been saved (${uuid}).`
    ) {
        // save to file
        const uuid = saved?.id ?? crypto.randomUUID();
        fs.writeFileSync(`${INCOMPLETE_FINAL_HITS_DIR}/${uuid}.json`, JSON.stringify(heroesFinalHits, undefined, 4));

        p.log.warn(message(uuid));
    }

    const heroesFinalHits: Record<string, number[]> = saved?.data ?? {};

    try {
        const heroes = specificHeroIds
            ? HERO_LIST.filter(h => specificHeroIds.includes(h.id))
            : HERO_LIST.filter(h =>
                (typeof h.roles === 'string' && h.roles == 'duelist')
             || (h.roles.length == 1 && h.roles.includes('duelist'))
            );

        for (const [h, hIdx] of withIndices(heroes)) {
            if (!heroesFinalHits[h.id])
                heroesFinalHits[h.id] = [];

            p.log.info(`========= HERO [${h.name}] (${hIdx + 1}/${heroes.length}) =========`);

            // check pasted data
            if (heroesFinalHits[h.id]?.length) {
                p.log.step(`Hero has previous data: ${heroesFinalHits[h.id].length} average final hits values have been registered. Skipping ${heroesFinalHits[h.id].length} players.`);
                if (heroesFinalHits[h.id].length >= 15) {
                    p.log.step(`Hero's average final hits has enough values, skipping.`);
                    continue;
                }
            }

            const internalId = h.internalId ?? inferInternalId(h.id);
            if (!internalId) {
                p.log.error(`Hero ${h.name} did not have an internal ID and one could not be inferred! Skipping`);
                continue;
            }

            const heroData = await getHeroData(internalId, season);
            if (!heroData || !heroData.players.length) {
                p.log.error(`Failed to fetch hero data for ${h.name}`);
                continue;
            }

            // output the hero data to have for later
            heroesOut[h.id] = heroData;

            // sample players evenly across ranks
            const sampledPlayers = balancedSample(heroData.players, 40);

            let count = heroesFinalHits[h.id]?.length ?? 0;
            for (let idx = count; idx < sampledPlayers.length; idx++) {
                const player = sampledPlayers[idx];
                await clipboard.write(`${player.player_uid}`);
                p.log.info(`Player [${player.info.name}] :: ${player.player_uid} (ID copied to clipboard)`);

                const finals = await p.text({
                    message: `[${count}/15][${idx}] Input ${player.info.name}'s average final hits per 10 minutes (leave empty to skip)`,
                    validate: v => {
                        if (!v)
                            return undefined;

                        if (count == 0 && (v == '^' || v == '^^'))
                            return 'No previous value to edit for this hero.';
                        else if (count > 0 && (v == '^' || v == '^^'))
                            return undefined;
                        
                        const parsed = parseFloat(v);
                        if (typeof parsed === 'number' && isFinite(parsed) && !isNaN(parsed))
                            return undefined;

                        return 'Must be a number!';
                    }
                });
                checkCancel(finals, saveProgress);
                
                if (!finals) {
                    p.log.info(`Player skipped.`);
                    continue;
                }

                async function editPrevValue(index: number) {
                    const modified = await p.text({
                        message: `Edit previous value [${index}] (${heroesFinalHits[h.id][index]})`,
                        initialValue: `${heroesFinalHits[h.id][index]}`,
                        placeholder: `${heroesFinalHits[h.id][index]}`,
                        validate: v => {               
                            const parsed = parseFloat(v ?? '');
                            if (typeof parsed === 'number' && isFinite(parsed) && !isNaN(parsed))
                                return undefined;

                            return 'Must be a number!';
                        }
                    });
                    checkCancel(modified, saveProgress);

                    return modified;
                }

                if (finals == '^') {
                    const prevCount = count - 1;
                    const modified = await editPrevValue(prevCount);

                    heroesFinalHits[h.id][prevCount] = parseFloat(modified as string);
                    idx--;
                    continue;
                }
                else if (finals == '^^') {
                    const chosenIdx = await p.select({
                        message: `Which previous value to edit?`,
                        options: heroesFinalHits[h.id].map((v, i) => ({
                            label: `(${i}) ${v}`,
                            value: i
                        }))
                    })
                    checkCancel(chosenIdx, saveProgress);

                    const modified = await editPrevValue(chosenIdx as number);

                    heroesFinalHits[h.id][chosenIdx as number] = parseFloat(modified as string);
                    idx--;
                    continue;
                }

                const finalsFloat = parseFloat(finals as string);
                if (finalsFloat < 3.5 || finalsFloat > 30)
                    p.log.warn(`Anomaly detected, number may be incorrect (edit with ^ or ^^)`);

                heroesFinalHits[h.id].push(finalsFloat);
                if (count++ == 14) {
                    p.log.info('15 averages have been collected, going to the next hero');
                    break;
                }
            }

            if (count < 15)
                p.log.warn(`Only collected ${count}/15 final hits for ${h.name} — ran out of sampled players.`);
        }
    }
    catch(err) {
        saveProgress(uuid => `Operation was terminated due to an error. Final Hits JSON has been saved (${uuid}).`);

        p.log.error(err instanceof Error ? err.message : String(err));
        if (err instanceof Error && err.stack)
            p.log.error(err.stack);
    }

    return heroesFinalHits;
}

async function scrape(season: string, heroesData: Record<string, HeroData>) {
    p.log.step('Beginning scrape...')
    p.log.info(`Making backups of the average stats and matches files...`);
    fs.copyFileSync(STATS_FILE, STATS_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));
    fs.copyFileSync(MATCHES_FILE, MATCHES_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));

    for (const hero of HERO_LIST) {
        const internalId = hero.internalId ?? inferInternalId(hero.id);
        if (!internalId) {
            p.log.error(`Hero ${hero.name} did not have an internal ID and one could not be inferred! Skipping`);
            continue;
        }

        p.log.info(`Scraping hero [${hero.name}]...`);
        if (Array.isArray(hero.roles) && hero.roles.length > 1) {
            p.log.info(`Hero [${hero.name}] has multiple roles, scraping all...`);
            await Promise.all(hero.roles.map(async (role, idx) => {
                    const internalIdRole = inferInternalId(`${hero.id}_${role}`) ?? `${internalId}${idx + 1}`;
                    await scrapeData(
                        internalIdRole,
                        hero.id,
                        'multi',
                        p.log,
                        season,
                        true,
                        heroesData[hero.id] ?? null
                    );
                })
            );
        }
        else
            await scrapeData(
                internalId,
                hero.id,
                Array.isArray(hero.roles) ? hero.roles[0] : hero.roles,
                p.log,
                season,
                true,
                heroesData[hero.id] ?? null
            );
    }
}

async function main() {
    p.intro('This tool scrapes generic average stats for all heroes.');

    let season = await p.text({
        message: 'Type season id (S8.0 = 16, S8.5 = 17, S9.0 = 18) for data scraping (Leave blank for last)',
        placeholder: 'e.g.: 14'
    }) as string;
    checkCancel(season);

    if (!season)
        season = 'last';

    const action = await p.select({
        message: 'Select one:',
        options: [
            {
                label: 'Update Final Hits data file (specific heroes)',
                value: 'update_finals'
            },
            {
                label: 'Create Final Hits data file',
                value: 'create_finals'
            },
            {
                label: 'Create Final Hits data file, then scrape',
                value: 'create_finals_scrape'
            },
            {
                label: 'Scrape stats (use existing Final Hits data file)',
                value: 'scrape'
            }
        ]
    });
    checkCancel(action);

    const heroesData: Record<string, HeroData> = {};

    if (action == 'update_finals') {
        const heroIds = await p.multiselect({
            message: 'Select the heroes to modify',
            options: HERO_LIST.filter(h => (typeof h.roles === 'string' && h.roles == 'duelist')
                                        || (h.roles.length == 1 && h.roles.includes('duelist')))
                .map(h => ({
                    label: h.name,
                    value: h.id,
                }))
        });
        checkCancel(heroIds);

        const pickedAvgFinalHits = await create(season, heroesData, heroIds as string[]);
        const existingAvgFinalHits = JSON.parse(fs.readFileSync(AVG_FINAL_HITS_FILE, { encoding: 'utf-8' }));

        // replace newly added final hits
        (heroIds as string[]).forEach(id => existingAvgFinalHits[id] = pickedAvgFinalHits[id]);

        p.log.success(`All final hits have been collected. Making backup and writing new file.`);
        fs.copyFileSync(AVG_FINAL_HITS_FILE, AVG_FINAL_HITS_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));
        fs.writeFileSync(AVG_FINAL_HITS_FILE, JSON.stringify(existingAvgFinalHits, undefined, 4));
    }
    else if (action == 'create_finals') {
        const avgFinalHits = await create(season, heroesData);
        p.log.success(`All final hits have been collected. Making backup and writing new file.`);
        fs.copyFileSync(AVG_FINAL_HITS_FILE, AVG_FINAL_HITS_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));
        fs.writeFileSync(AVG_FINAL_HITS_FILE, JSON.stringify(avgFinalHits, undefined, 4));
    }
    else if (action == 'create_finals_scrape') {
        const avgFinalHits = await create(season, heroesData);
        p.log.success(`All final hits have been collected. Making backup and writing new file.`);
        fs.copyFileSync(AVG_FINAL_HITS_FILE, AVG_FINAL_HITS_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));
        fs.writeFileSync(AVG_FINAL_HITS_FILE, JSON.stringify(avgFinalHits, undefined, 4));

        await scrape(season, heroesData);
    }
    else if (action == 'scrape') {
        await scrape(season, heroesData); // since heroesData[<any hero>] is undefined, the scrape func will automatically fetch it
    }
    else {
        p.log.warn('Operation unknown, exiting.')
    }
    
    p.outro('Operations completed.');
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