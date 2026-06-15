import { getAverageStatsForHero, levelToRank, NO_DAILY_POINTS_ATTENUATION_RANK_IDS, PROFICIENCY_RANKS, type Challenge, type HeroData, type PlayerHeroStore, type Rank } from "~/assets/data/common";

export interface PersonalRankTimeEstimate {
    rankId: string, 
    time: [conservative: number, avg: number, optimistic: number],
    points: [conservative: number, avg: number, optimistic: number],
    levelCount: number,

    arcade?: {
        dailyPoints: number,
        dayCount: number
    }
}

type PickedStore = Pick<PlayerHeroStore, 
    'averageStats'|'averageStatsArcade'
    |'averageStatsPerRole'|'averageStatsArcadePerRole'|'lastViewingRole'
    |'arcadeMaxFeasableMissions'|'goal'|'level'|'points'
>;

export class Calculator {
    public hero: HeroData;
    public store: PickedStore;

    public constructor(hero: HeroData, level: PickedStore);
    public constructor(hero: HeroData, level: PlayerHeroStore) {
        this.hero = hero;
        this.store = level;
    }

    private getAverageStatFromStore(type: string, arcade: boolean) {
        let source: Record<string, number>|undefined = {};
        if (!arcade) {
            if (!this.store.lastViewingRole)
                source = this.store.averageStats;
            else {
                source = this.store.averageStatsPerRole?.[this.store.lastViewingRole];
            }
        }
        else {
            if (!this.store.lastViewingRole)
                source = this.store.averageStatsArcade;
            else {
                source = this.store.averageStatsArcadePerRole?.[this.store.lastViewingRole];
            }
        }

        return source?.[type];
    }

    private avgPointsPer10MinsForChallenge(rank: Rank, challenge: Challenge, arcade: boolean) {
        const genericStats = getAverageStatsForHero(this.hero.id);

        const shouldAttenuate = !NO_DAILY_POINTS_ATTENUATION_RANK_IDS.includes(rank.type.id);
        const reward = arcade && shouldAttenuate ? (challenge.reward * 45) / 60 : challenge.reward;

        if (challenge.type == 'play')
            return 10 * reward / challenge.needed;

        let avgStat = this.getAverageStatFromStore(challenge.type, arcade);

        if (!avgStat) {
            avgStat = genericStats?.[challenge.type] ?? 0;

            if (!avgStat)
                return null;
        }

        return avgStat * reward / challenge.needed;
    }

    private avgPointsPer10MinForRank(rank: Rank, arcade: boolean): { challenge: Challenge, points: number }[] {
        const challenges: Challenge[] = rank.challenges;

        let missionsPoints: { challenge: Challenge, points: number }[] = [];
        for (const challenge of challenges) {
            const challengePoints = this.avgPointsPer10MinsForChallenge(rank, challenge, arcade);
            if (!challengePoints)
                continue;

            missionsPoints.push({ challenge, points: challengePoints });
        }

        return missionsPoints;
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
        points: number,
        arcade?: {
            /**
             * The user's max feasable missions they are willing to play and finish (complete all 15 of) until
             * they stop playing arcade as their time investment becomes a loss compared to playing other game modes
             * or waiting for the next daily mission reset
             */
            maxFeasableMissions: number,
            previousRankTime?: PersonalRankTimeEstimate,
        }
    ): PersonalRankTimeEstimate {
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
        const missionsAvgPoints = this.avgPointsPer10MinForRank(rank, !!arcade);
        
        // calculate averages
        const avgPointsPer10 = missionsAvgPoints.reduce((sum, c) => sum + c.points, 0);
        const conservativePointsPer10 = avgPointsPer10 * 0.9;
        const optimisticPointsPer10 = avgPointsPer10 * 1.1;

        if (!arcade || avgPointsPer10 <= 0.001) {
            return {
                rankId: rank.type.id,
                time: [
                    pointsNeeded / conservativePointsPer10 * 10 * 60,
                    pointsNeeded / avgPointsPer10 * 10 * 60,
                    pointsNeeded / optimisticPointsPer10 * 10 * 60,
                ],
                points: [
                    avgPointsPer10 * 0.9,
                    avgPointsPer10,
                    avgPointsPer10 * 1.1
                ],
                levelCount: noLevels
            }
        }
        else {
            // need to calculate how many points can be earned until arcadeMaxFeasableMissions are all completed
            missionsAvgPoints.sort((a,b) => b.points - a.points);

            // make a budget map for how much each mission can give daily
            // since every mission can be completed 15 times every day
            const missionsBudgetMap: Partial<Record<Challenge['type'], number>> = {};
            let remainingPoints = pointsNeeded;
            missionsAvgPoints.forEach(({ challenge }) => {
                missionsBudgetMap[challenge.type] = challenge.reward * 15;
            });

            // while we still have points that need to be gained, check mission counts for every mission
            while (remainingPoints > 0) {
                for (const { challenge, points } of missionsAvgPoints) {
                    // if this mission's budget is depleted, don't account for it anymore
                    // any points over the limit will not be registered in game
                    if (missionsBudgetMap[challenge.type]! <= 0)
                        continue;

                    // remove one count of the points reward of this mission from its budget and the points to be gained
                    let removablePoints = points;
                    if (missionsBudgetMap[challenge.type]! - points < 0)
                        removablePoints -= points - missionsBudgetMap[challenge.type]!;
                    
                    missionsBudgetMap[challenge.type]! -= removablePoints;
                    remainingPoints -= removablePoints;
                }
                
                // calculate how many missions were depleted
                const remainingFeasableMissions = Object.values(missionsBudgetMap).filter(m => m > 0).length;
                const totalMissions = missionsAvgPoints.length;
                const depletedMissions = totalMissions - remainingFeasableMissions;

                // compare the depleted missions against the user's feasable missions
                if (depletedMissions >= arcade.maxFeasableMissions || remainingFeasableMissions === 0)
                    break;
            }

            // calc how many points can be earned per day
            const canEarnPointsDaily = pointsNeeded - remainingPoints;

            return {
                rankId: rank.type.id,
                time: [
                    pointsNeeded / conservativePointsPer10 * 10 * 60,
                    pointsNeeded / avgPointsPer10 * 10 * 60,
                    pointsNeeded / optimisticPointsPer10 * 10 * 60,
                ],
                arcade: {
                    dailyPoints: canEarnPointsDaily,
                    dayCount: pointsNeeded / canEarnPointsDaily
                },
                points: [
                    avgPointsPer10 * 0.9,
                    avgPointsPer10,
                    avgPointsPer10 * 1.1
                ],
                levelCount: noLevels
            }
        }
    }

    public totalTimes(arcade = false): PersonalRankTimeEstimate[] {
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
        for (let i = 0; i < remainingRanks.length; i++) {
            const rank = remainingRanks[i]!;
            let arcadePreviousRankTimes: {
                maxFeasableMissions: number,
                previousRankTime?: PersonalRankTimeEstimate,
            } | undefined = undefined;

            if (arcade) {
                arcadePreviousRankTimes = { maxFeasableMissions: this.store.arcadeMaxFeasableMissions ?? 1 };

                if (i > 0)
                    arcadePreviousRankTimes.previousRankTime = totalTimes[i - 1];
            }
            totalTimes.push(this.rankTime(rank, currentLevel, goal, this.store.points, arcadePreviousRankTimes));
        }

        return totalTimes;
    }
}

export function calculateTimesToLevel(hero: HeroData, store: PickedStore) {
    const calculator = new Calculator(hero, store);
    return calculator.totalTimes();
}