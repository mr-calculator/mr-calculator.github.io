
import GALACTA_GUIDE from './galacta-guide.json';
import RIVALRY_RISING from './rivalry-rising.json';
import HEROIC_JOURNEY from './heroic-journey.json';
import CHRONOVERSE_SAGA from './chronoverse-saga.json';
import z from "zod";

import type { TEX } from '../textures';
import { getHeroCostumes } from '../cosmetics/costumes/costumes';

export type AchievementTypeCategory = 'galacta-guide'|'rivalry-rising'|'heroic-journey'|'chronoverse-saga';
export interface AchievementCategoryReward {
    title: string,
    icon: string,
    requirement: number,

    onClick?: (reward: AchievementCategoryReward) => void
}

export type AchievementTypeRarity = 'copper'|'silver'|'gold';
export interface AchievementType {
    /**
     * For now, it stands for a Hero's Id
     */
    owner?: string,

    id: string,
    title: string,
    description: string,
    category: AchievementTypeCategory,
    rarity: AchievementTypeRarity,

    requirement: number,
    reward: number
}

export const AchievementSchema = z.object({
    id: z.string(),
    current: z.number()
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const ACHIEVEMENT_ICONS: Record<
    AchievementTypeCategory, Record<'normal'|AchievementTypeRarity, keyof typeof TEX>
> = {
    'galacta-guide': {
        normal: 'achievementGalactaGuide',
        copper: 'achievementGalactaGuideCopper',
        silver: 'achievementGalactaGuideSilver',
        gold: 'achievementGalactaGuideGold',
    },
    'rivalry-rising': {
        normal: 'achievementRivalryRising',
        copper: 'achievementRivalryRisingCopper',
        silver: 'achievementRivalryRisingSilver',
        gold: 'achievementRivalryRisingGold',
    },
    'heroic-journey': {
        normal: 'achievementHeroicJourney',
        copper: 'achievementHeroicJourneyCopper',
        silver: 'achievementHeroicJourneySilver',
        gold: 'achievementHeroicJourneyGold',
    },
    'chronoverse-saga': {
        normal: 'achievementChronoverseSaga',
        copper: 'achievementChronoverseSagaCopper',
        silver: 'achievementChronoverseSagaSilver',
        gold: 'achievementChronoverseSagaGold',
    },
}

export const ACHIEVEMENT_RARITY_NAMES: Record<AchievementTypeRarity, string> = {
    copper: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
}

async function openCostumeRewardModal(heroId: string, costumeId: string) {
    const { useModalManager } = await import('~/composables/useModalManager');
    const { openModal } = useModalManager();
    const costume = getHeroCostumes(heroId).find(c => c.id == costumeId)!;

    const modal =  defineAsyncComponent(() => import("~/components/modals/CostumeDetailModal.vue"));
    openModal(modal, {
        costume,
        heroId,
        heroColor: '#fff',
    })
    .promise
    .catch(() => null);
}

export const ACHIEVEMENT_CATEGORIES: {
    id: AchievementTypeCategory,
    name: string,
    icon(): keyof typeof TEX,
    rewards: AchievementCategoryReward[]
}[] = [
    {
        id: 'galacta-guide',
        name: 'Galacta\'s Guide',
        icon() {
            return ACHIEVEMENT_ICONS[this.id].normal;
        },
        rewards: [
            {
                title: '200 Chrono Tokens',
                icon: '/img/common-rewards/chrono-tokens.webp',
                requirement: 40,
            },
            {
                title: 'Your Biggest Fan',
                icon: '/img/achievements/rewards/galacta-guide/your-biggest-fan.webp',
                requirement: 80,
            },
            {
                title: 'No One Rivals Doom',
                icon: '/img/achievements/rewards/galacta-guide/no-one-rivals-doom.webp',
                requirement: 120,
            },
            {
                title: 'Galacta\'s Favorite',
                icon: '/img/common-rewards/title.webp',
                requirement: 160,
            },
            {
                title: 'Win Them All',
                icon: '/img/achievements/rewards/galacta-guide/win-them-all.webp',
                requirement: 200,
            },
            {
                title: 'Symbiote Shenanigans',
                icon: '/img/achievements/rewards/galacta-guide/symbiote-shenanigans.webp',
                requirement: 240,
            },
            {
                title: 'It\'s Your Girl, Galacta',
                icon: '/img/achievements/rewards/galacta-guide/its-your-girl-galacta.webp',
                requirement: 280,
            },
        ]
    },
    {
        id: 'rivalry-rising',
        name: 'Rivalry Rising',
        icon() {
            return ACHIEVEMENT_ICONS[this.id].normal;
        },
        rewards: [
            {
                title: '200 Chrono Tokens',
                icon: '/img/common-rewards/chrono-tokens.webp',
                requirement: 40,
            },
            {
                title: 'Rising Rival',
                icon: '/img/common-rewards/title.webp',
                requirement: 80,
            },
        ]
    },
    {
        id: 'heroic-journey',
        name: 'Heroic Journey',
        icon() {
            return ACHIEVEMENT_ICONS[this.id].normal;
        },
        rewards: [
            {
                title: '100 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 40,
            },
            {
                title: '100 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 80,
            },
            {
                title: '100 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 120,
            },
            {
                title: '100 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 160,
            },
            {
                title: 'Ivory Breeze',
                icon: '/img/achievements/rewards/heroic-journey/ivory-breeze.webp',
                requirement: 200,

                onClick: () => openCostumeRewardModal('storm', '1015100')
            },
            {
                title: '100 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 240,
            },
            {
                title: '100 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 280,
            },
            {
                title: '100 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 320,
            },
            {
                title: '200 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 360,
            },
            {
                title: 'Jovial Star',
                icon: '/img/achievements/rewards/heroic-journey/jovial-star.webp',
                requirement: 400,

                onClick: () => openCostumeRewardModal('star-lord', '1043100')
            },
            {
                title: '200 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 440,
            },
            {
                title: 'Heroic Ally',
                icon: '/img/common-rewards/title.webp',
                requirement: 480,
            },
            {
                title: '200 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 510,
            },
            {
                title: '200 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 540,
            },
            {
                title: 'Daring Dramatist',
                icon: '/img/common-rewards/title.webp',
                requirement: 580,
            },
            {
                title: '200 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 620,
            },
            {
                title: '200 Unstable Molecules',
                icon: '/img/common-rewards/unstable-mollecule.webp',
                requirement: 660,
            },
            {
                title: '200 Chrono Tokens',
                icon: '/img/common-rewards/chrono-tokens.webp',
                requirement: 700,
            },
        ]
    },
    {
        id: 'chronoverse-saga',
        name: 'Chronoverse Saga',
        icon() {
            return ACHIEVEMENT_ICONS[this.id].normal;
        },
        rewards: [
            {
                title: 'Celestial Codex',
                icon: '/img/achievements/rewards/chronoverse-saga/celestial-codex.webp',
                requirement: 40,
            },
            {
                title: 'Spider-Totem',
                icon: '/img/achievements/rewards/chronoverse-saga/spider-totem.webp',
                requirement: 80,
            },
            {
                title: 'Thread of Fate',
                icon: '/img/achievements/rewards/chronoverse-saga/thread-of-fate.webp',
                requirement: 120,
            },
            {
                title: 'Hive Statue',
                icon: '/img/achievements/rewards/chronoverse-saga/hive-statue.webp',
                requirement: 140,
            },
            {
                title: 'Chrono-Explorer',
                icon: '/img/common-rewards/title.webp',
                requirement: 160,
            },
            {
                title: '200 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 190,
            },
            {
                title: '200 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 220,
            },
            {
                title: 'Chronicle Expert',
                icon: '/img/common-rewards/title.webp',
                requirement: 250,
            },
            {
                title: '200 Units',
                icon: '/img/common-rewards/units.webp',
                requirement: 280,
            },
            {
                title: '200 Unstable Molecules',
                icon: '/img/common-rewards/unstable-mollecule.webp',
                requirement: 320,
            },
            {
                title: '200 Unstable Molecules',
                icon: '/img/common-rewards/unstable-mollecule.webp',
                requirement: 360,
            },
        ]
    }
] as const;

export const ACHIEVEMENTS: AchievementType[] = [
    ...(GALACTA_GUIDE as AchievementType[]),
    ...(RIVALRY_RISING as AchievementType[]),
    ...(HEROIC_JOURNEY as AchievementType[]),
    ...(CHRONOVERSE_SAGA as AchievementType[]),
]

export function getAchievements(category?: AchievementTypeCategory, heroId?: string) {
    return ACHIEVEMENTS.filter(a => {
        if (category && a.category != category)
            return false;

        if (heroId && a.owner != heroId)
            return false;

        return true;
    });
}