import type { Challenge } from "./common";
import { HERO_LIST } from "./heroes";

const challengesAggregated: Partial<Record<Challenge['type'], Record<string, Challenge[]>>> = {};

HERO_LIST.forEach(hero => {
    hero.ranks.forEach(rank => {
        rank.challenges.forEach(challenge => {
            if (!challengesAggregated[challenge.type])
                challengesAggregated[challenge.type] = {};

            if (!challengesAggregated[challenge.type]![rank.type.id])
                challengesAggregated[challenge.type]![rank.type.id] = [];

            // prevent duplicates
            if (challengesAggregated[challenge.type]![rank.type.id]!.find(c => 
                c.needed == challenge.needed && c.reward == challenge.reward
            ))
                return;
                
            challengesAggregated[challenge.type]![rank.type.id]!.push(challenge);
        });
    })
});

export const ALL_CHALLENGES = challengesAggregated;

export function guessChallenge(type: Challenge['type'], anyValue: number) {
    const challengeRanks = challengesAggregated[type];

    if (!challengeRanks)
        return null;

    let foundIndex = -1;
    for (const challenges of Object.values(challengeRanks)) {
        const index = challenges.findIndex(challenge => challenge.needed == anyValue);
        if (index != -1) {
            foundIndex = index;
            break;
        }
    }

    if (foundIndex == -1)
        return null;

    const aggregated: Record<string, Challenge> = {};
    Object.entries(challengeRanks).forEach(([rank, challenges]) => {
        const challenge = challenges[foundIndex];
        if (challenge)
            aggregated[rank] = challenge;
    })

    return aggregated;
}