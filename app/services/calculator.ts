import { getAverageStatsForHero, levelToRank, PROFICIENCY_RANKS, type Challenge, type HeroData, type PlayerHeroStore, type Rank } from "~/assets/data/common";

export type PersonalRankTimeEstimate = [
    rankId: string, 
    time: [conservative: number, avg: number, optimistic: number],
    points: [conservative: number, avg: number, optimistic: number],
    levelCount: number
];

export class Calculator {
    public hero: HeroData;
    public store: PlayerHeroStore;

    public constructor(hero: HeroData, level: PlayerHeroStore) {
        this.hero = hero;
        this.store = level;
    }

    private avgPointsPer10MinForRank(rank: Rank): number {
        const neededStats: Challenge[] = rank.challenges;
        const playNeeded = rank.challenges.find(c => c.type == 'play')?.needed ?? 15;
        
        const genericStats = getAverageStatsForHero(this.hero.id);

        let points = 0;
        for (const stat of neededStats) {
            if (stat.type == 'play') {
                points += 10 * stat.reward / playNeeded;
                continue;
            }

            let avgStat = this.store.averageStats[stat.type];

            if (!avgStat) {
                avgStat = genericStats?.[stat.type] ?? 0;

                if (!avgStat)
                    continue;
            }

            points += avgStat * stat.reward / stat.needed;
        }

        return points;
    }

    /**
     * Calculates the time (in seconds) needed to complete a rank's levels up to {@link toLevel}
     * @param rank rank
     * @param toLevel level to stop at, if out of bounds of the current rank, it is ignored
     */
    private rankTime(
        rank: Rank,
        fromLevel: number,
        toLevel: number,
        points: number): [PersonalRankTimeEstimate[1], PersonalRankTimeEstimate[2], levelCount: number]
    {
        // assume all levels initially
        let noLevels = rank.type.levelCount;

        let rankLevelStart = rank.type.levelStart;
        let rankLevelEnd = rank.type.levelEnd;

        // check if this rank is the last.
        // the last rank's final level is 70, but 70 cannot be completed
        // ergo, we need to remove it from the equation
        const lastRankId = Object.values(PROFICIENCY_RANKS).at(-1)!.id;
        if (rank.type.id == lastRankId)
            rankLevelEnd -= 1;

        // check if current (from) level is within the levelStart and levelEnd of this rank
        const fromLevelWithinBounds = fromLevel >= rankLevelStart && fromLevel <= rankLevelEnd;
        // check if current (from) level is outside the bounds (only in the positive axis)
        const fromLevelGreaterThanBounds = fromLevel > rankLevelEnd;

        // check if goal (to) level is within the levelStart and levelEnd of this rank
        const toLevelWithinBounds = toLevel >= rankLevelStart && toLevel <= rankLevelEnd;

        // if the current (from) level is within bounds, subtract all "completed" levels
        // of this rank
        if (fromLevelWithinBounds)
            noLevels -= fromLevel - rankLevelStart

        // if the goal (to) level is within the bounds of this rank, subtract higher levels
        // up to the levelEnd of this rank, since they do not concern us as they are past the goal
        if (toLevelWithinBounds)
            noLevels -= rankLevelEnd - toLevel + 1;

        // if the current (from) level is outside the bounds of this rank, it means the rank
        // has been fully completed and is no longer our concern, yield no levels
        if (fromLevelGreaterThanBounds)
            noLevels = 0;

        // calculate points needed (subtracting the current points if the current (from) level is
        // within the bounds of this rank)
        const pointsNeeded = rank.type.xpPerLevel * noLevels - (fromLevelWithinBounds ? points : 0);
        // calculate averages
        const avgPointsPer10 = this.avgPointsPer10MinForRank(rank);
        const conservativePointsPer10 = avgPointsPer10 * 0.9;
        const optimisticPointsPer10 = avgPointsPer10 * 1.1;

        return [
            [
                pointsNeeded / conservativePointsPer10 * 10 * 60,
                pointsNeeded / avgPointsPer10 * 10 * 60,
                pointsNeeded / optimisticPointsPer10 * 10 * 60,
            ],
            [
                avgPointsPer10 * 0.9,
                avgPointsPer10,
                avgPointsPer10 * 1.1
            ],
            noLevels
        ];
    }

    public totalTimes(): PersonalRankTimeEstimate[] {
        const currentLevel = this.store.level;
        let goal = this.store.goal;

        const currentProficiencyRank = levelToRank(currentLevel);
        if (!currentProficiencyRank)
            return [];

        let toProficiencyRank = levelToRank(goal);
        if (!toProficiencyRank)
            return [];

        const remainingRanks = this.hero.ranks.filter(rank => 
            rank.type.levelEnd >= currentLevel &&
            rank.type.levelStart < goal
        );

        let totalTimes: PersonalRankTimeEstimate[] = [];
        for (const rank of remainingRanks) {
            totalTimes.push([
                rank.type.id, 
                ...this.rankTime(rank, currentLevel, goal, this.store.points)
            ]);
        }

        return totalTimes;
    }
}