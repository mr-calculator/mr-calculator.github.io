import { levelToRank, replaceRewardPlaceholders, type HeroData, type Reward } from "~/assets/data/common";
import { tex } from "~/assets/data/textures";
import { HERO_IMAGES } from "~/services/image-operations";

export const useLevel = (level: number, hero: HeroData) => {
    const rank = levelToRank(level);

    const emptyReward: Reward = {
        level: level,
        name: 'No Reward',
        icon: tex('none'),
    };

    const reward = cloneObjectRefAsRaw<Reward>(rank?.rewards.find(r => r.level == level)) ?? emptyReward;
    const iconPath = replaceRewardPlaceholders(reward.icon, hero);
    let iconKey = iconPath.split('/').at(-1)!;
    iconKey = iconKey.slice(0, iconKey.length - '.webp'.length)!;
    const icon = Object.keys(HERO_IMAGES).includes(iconKey)
            ? useHeroImage(iconKey, hero).value
            : iconPath;

    const processedReward: Reward = {
        ...reward,
        name: replaceRewardPlaceholders(reward.name, hero),
        icon
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