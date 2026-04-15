import fs from "fs"
import { Challenge, HeroRole } from "../../app/assets/data/common";

// RivalsMeta data structure for hero
interface HeroData {
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
const ENDPOINT = `https://rivalsmeta.com/api/hero-leaderboard/%CHARACTER_ID%?device=1&season=last`
const STATS_FILE = './app/assets/data/average-hero-stats.json';
const MATCHES_FILE = './app/assets/data/hero-matches.json';

// to automatically convert from RivalsMeta structure to our own structure
type MissionMap = Partial<Record<Challenge['type'], string[]|null>>;
const MISSION_TYPES_FOR_ROLE: Record<HeroRole, MissionMap> = {
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
    }
}

// since we don't have final hits from the API, I manually went through a few hundred players' profiles
// and got their Avg Final Hits / 10 mins stat for every hero - yes it was painful
// this looks like: Record<string, number[]>
const FINAL_HITS_MANUAL = JSON.parse(fs.readFileSync('./scripts/stats/data/average-final-hits.json', { encoding: 'utf-8' }));
// A little info from what I've tried:
// while it is technically possible to scrape these final hits (at least from a few hundred players -
// 5 players per hero = 240) from tracker.gg or RivalsMeta matches, that would be an invasive/aggresive
// scrape that is not only unethical, but breaks ToS and will get rate limited if done from 1 IP address.

// marvelrivalsapi.com, the API that RivalsMeta uses does not expose a final hits property in any API responses.

// needless to say, packet intercepting is not possible without knowing the ins and outs of the rivals game client
// and specifically packet structure, network protocol etc., which is likely not possible without making a
// headless rivals client and using that to get info, but that is waaaay beyond the scope of this project.


// count how many matches were used in getting these stats
let heroMatchCount: number = 0;

// scrapes data for hero from every player available -> processes it
export async function scrapeData(internalId: string, heroId: string, role: HeroRole) {
    // request RivalsMeta API
    const res = await fetch(ENDPOINT.replace('%CHARACTER_ID%', internalId));
    const data: HeroData = await res.json();

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
    setHeroStatsInFile(heroId, averagedStats);
    setHeroMatchCountInFile(heroId, heroMatchCount);
}

function setHeroStatsInFile(heroId: string, newStats: Partial<Record<Challenge['type'], number>>) {
    const stats = JSON.parse(fs.readFileSync(STATS_FILE, { encoding: 'utf-8' }));

    stats[heroId] = newStats;

    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 4));
}

function setHeroMatchCountInFile(heroId: string, count: number) {
    const matches = JSON.parse(fs.readFileSync(MATCHES_FILE, { encoding: 'utf-8' }));

    matches[heroId] = count;

    fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 4));
}