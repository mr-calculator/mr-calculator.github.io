import { levelToRank, replaceRewardPlaceholders, type HeroData, type Reward } from "~/assets/data/common";
import { tex } from "~/assets/data/textures";

export const useLevel = (level: number, hero: HeroData) => {
    const rank = levelToRank(level);

    const emptyReward: Reward = {
        level: level,
        name: 'No Reward',
        icon: tex('none'),
    };

    const reward = cloneObjectRefAsRaw<Reward>(rank?.rewards.find(r => r.level == level)) ?? emptyReward
    const processedReward: Reward = {
        ...reward,
        name: replaceRewardPlaceholders(reward.name, hero),
        icon: replaceRewardPlaceholders(reward.icon, hero)
    }

    if (processedReward.iconAnimation) {
        if (hero.iconAnimationSize)
            processedReward.iconAnimation.size = cloneObjectRefAsRaw(hero.iconAnimationSize)!;

        if (hero.iconAnimationOffset)
            processedReward.iconAnimation.offset = cloneObjectRefAsRaw(hero.iconAnimationOffset)!;
    }

    return {
        rank,
        reward: processedReward,
        level: level
    }
}