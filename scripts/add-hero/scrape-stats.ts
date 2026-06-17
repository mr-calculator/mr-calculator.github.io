import fs from "fs"
import { Challenge, HeroRole } from "../../app/assets/data/common";
import { log } from "@clack/prompts";

// RivalsMeta data structure for hero
export interface HeroData {
    _id: number,
    players: {
        info: {
            name: string,
            cur_head_icon_id: string,
            rank_season:{
               rank_game_id: number,
               level: number,
               rank_score: number,
               max_level: number,
               season_max_level: number,
               max_rank_score: number,
               update_time: number,
               win_count: number,
               protect_score: number,
               diff_score: number,
               battle_count: number,
               fixed_battle_count: number,
               fixed_finished: number,
            },
            login_os: string
        },

        player_uid: number,
        matches: number,
        wins: number,
        kills: number,
        deaths: number,
        assists: number,
        play_time: number,
        total_hero_damage: number,
        total_damage_taken: number,
        total_hero_heal: number,
        mvps: number,
        svps: number,
        score: number,
    }[],
    timestamp: number
}

// where to get and where to set
export const ENDPOINT = `https://rivalsmeta.com/api/hero-leaderboard/%CHARACTER_ID%?device=1&season=`
export const STATS_FILE = './app/assets/data/average-hero-stats.json';
export const STATS_FILE_BACKUP = './app/assets/data/average-hero-stats_%DATE%.backup.json';
export const MATCHES_FILE = './app/assets/data/hero-matches.json';
export const MATCHES_FILE_BACKUP = './app/assets/data/hero-matches_%DATE%.backup.json';
export const AVG_FINAL_HITS_FILE = './scripts/add-hero/cache/average-final-hits.json';
export const AVG_FINAL_HITS_FILE_BACKUP = './scripts/add-hero/cache/average-final-hits_%DATE%.backup.json';

// to automatically convert from RivalsMeta structure to our own structure
type MissionMap = Partial<Record<Challenge['type'], string[]|null>>;
const MISSION_TYPES_FOR_ROLE: Record<HeroRole|'multi', MissionMap> = {
    'vanguard': {
        take_damage: ['total_damage_taken'],
        kos: ['kills']
    },
    'duelist': {
        damage: ['total_hero_damage'],
        finals: null // unfortunately final hits (last kills) are not present in this endpoint
    },
    'strategist': {
        heal: ['total_hero_heal'],
        kos_assists: ['kills', 'assists']
    },
    'multi': {
        damage_heal: ['total_hero_damage', 'total_hero_heal'],
        kos_assists: ['kills', 'assists']
    }
}

// since we don't have final hits from the API, I manually went through a few hundred players' profiles
// and got their Avg Final Hits / 10 mins stat for every hero - yes it was painful
// this looks like: Record<string, number[]>
const FINAL_HITS_MANUAL = JSON.parse(fs.readFileSync(AVG_FINAL_HITS_FILE, { encoding: 'utf-8' }));
// A little info from what I've tried:
// while it is technically possible to scrape these final hits (at least from a few hundred players -
// 5 players per hero = 240) from tracker.gg or RivalsMeta matches, that would be an invasive/aggresive
// scrape that is not only unethical, but breaks ToS and will get rate limited if done from 1 IP address.

// marvelrivalsapi.com, the API that RivalsMeta uses does not expose a final hits property in any API responses.

// needless to say, packet intercepting is not possible without knowing the ins and outs of the rivals game client
// and specifically packet structure, network protocol etc., which is likely not possible without making a
// headless rivals client and using that to get info, but that is waaaay beyond the scope of this project.


// scrapes data for hero from every player available -> processes it
export async function scrapeData(
    internalId: string,
    heroId: string,
    role: HeroRole|'multi',
    logger: typeof log,
    season: string,
    noBackup = false,
    providedData: HeroData|null = null
) {
    // count how many matches were used in getting these stats
    let heroMatchCount: number = 0;
    
    let data: HeroData|null = providedData;
    // request RivalsMeta API if data was not provided
    if (!data) {
        try {
            const res = await fetch(ENDPOINT.replace('%CHARACTER_ID%', internalId) + season);
            data = await res.json();
        }
        catch (err) {
            logger.error(err instanceof Error ? err.message : String(err));
            if (err instanceof Error && err.stack)
                logger.error(err.stack);
        }
    }

    if (!data) {
        logger.error(`[${heroId} - ${internalId}] Data could not be processed, generic average stats are skipped.`);
        return;
    }
    if (!data.players?.length) {
        logger.error(`[${heroId} - ${internalId}] Data did not include any players, generic average stats are skipped.`);
        return;
    }

    const stats: Partial<Record<Challenge['type'], [string[], number[]]>> = {};
    // map current hero role to mission stats
    const missionTypes: MissionMap = MISSION_TYPES_FOR_ROLE[role];
    Object.entries(missionTypes)
        .filter(m => m[1])
        .forEach(([key, keys]) => stats[key as Challenge['type']] = [keys!, []]);

    // loop through all players of the hero
    const players = data.players;
    for (const player of players) {
        const playTimeInMins = player.play_time / 60;

        // only god knows what I did here
        // jk, we get the stats that are not finals that already exist for this hero
        // since we already mapped the mission type ids to the raw data (player obj) keys,
        // we can just get the keys for the player object, get the values assigned to them
        // and reduce them to make a sum, which we can then divide by the playtime min * 10 to
        // get an avg/10mins that we can add to the avgs for the mission
        Object.entries(stats).filter(([k]) => k != 'finals').forEach(([ , [ objKeys, avgs ] ]) => {
            const statValue = objKeys.map(key => player[key as keyof HeroData['players'][0]] as number)
                                        .reduce((p, c) => p + c, 0);
            const statValuePer10 = statValue / playTimeInMins * 10;

            avgs.push(statValuePer10)
        });

        // increase the match count with this player's aggregated match count
        heroMatchCount += player.matches;
    }

    // for the final hits, it's much easier, just get them from the array of heroes
    const finalHitArray = FINAL_HITS_MANUAL?.[heroId];
    if (role == 'duelist' && finalHitArray) {
        stats.finals = [[], finalHitArray];
    }

    // make an average from the averages (i know that's not how it works, but in this case the values are
    // technically not averages)
    const averagedStats: Partial<Record<Challenge['type'], number>> = {};
    Object.entries(stats).forEach(([ type, [ , avgs ] ]) =>
        averagedStats[type as Challenge['type']] = avgs.reduce((p, c) => p + c, 0) / avgs.length
    );

    // add the data to our current data
    setHeroStatsInFile(heroId, averagedStats, noBackup);
    setHeroMatchCountInFile(heroId, heroMatchCount, noBackup);
}

export function fileNameFriendlyDate(date: Date) {
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const seconds = date.getUTCSeconds()
    const millis = date.getUTCMilliseconds()
    return `${year}-${month}-${day}.${hours}-${minutes}-${seconds}-${millis}`;
}

function setHeroStatsInFile(heroId: string, newStats: Partial<Record<Challenge['type'], number>>, noBackup: boolean) {
    // make a backup in case things go south (more like historical relevance)
    if (!noBackup)
        fs.copyFileSync(STATS_FILE, STATS_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));

    const stats = JSON.parse(fs.readFileSync(STATS_FILE, { encoding: 'utf-8' }));

    stats[heroId] = newStats;

    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 4));
}

function setHeroMatchCountInFile(heroId: string, count: number, noBackup: boolean) {
    // make a backup in case things go south (more like historical relevance)
    if (!noBackup)
        fs.copyFileSync(MATCHES_FILE, MATCHES_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));

    const matches = JSON.parse(fs.readFileSync(MATCHES_FILE, { encoding: 'utf-8' }));

    matches[heroId] = count;

    fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 4));
}

export function averageHeroRolesAverages(heroId: string, roles: HeroRole[]) {
    // make backups (for historical relevance)
    fs.copyFileSync(STATS_FILE, STATS_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));
    fs.copyFileSync(MATCHES_FILE, MATCHES_FILE_BACKUP.replace('%DATE%', fileNameFriendlyDate(new Date())));

    // calculate average of averages
    const stats: Record<string, Record<string, number>> = JSON.parse(fs.readFileSync(STATS_FILE, { encoding: 'utf-8' }));
    // also add matches together
    const matches: Record<string, number> = JSON.parse(fs.readFileSync(MATCHES_FILE, { encoding: 'utf-8' }));
    matches[heroId] = 0; // reset since we'll be adding

    const averageStatsSums: Record<string, [number, number]> = {};
    for (const role of roles) {
        const heroIdForRole = `${heroId}_${role}`;

        const matchesForRole = matches[heroIdForRole];
        if (matchesForRole)
            matches[heroId] += matchesForRole;

        const statsForRole = stats[heroIdForRole];
        if (!statsForRole)
            continue;

        Object.entries(statsForRole).forEach(([type, avg]) => {
            if (!averageStatsSums[type])
                averageStatsSums[type] = [0, 0];

            averageStatsSums[type][0] += avg; // sum
            averageStatsSums[type][1]++; // count
        });        
    }

    stats[heroId] = Object.fromEntries(
        Object.entries(averageStatsSums)
            .map(([type, [ sum, count ]]) => [ type, sum / count ]
        )
    );
    
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 4));
    fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 4));
}