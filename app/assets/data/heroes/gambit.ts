import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Gambit: HeroData = {
    id: 'gambit',
    name: 'Gambit',
    aliases: [
        'Remy Etienne LeBeau',
        'Gambit',
        'Le Diable Blanc',
        'Mr. X',

        'gambit never folds'
    ],
    roles: 'strategist',
    color: '#ff97e0',
    dataDir: '/img/heroes/data/gambit/',

    iconAnimationOffset: [-10, -52],
    iconLargeAnimationOffset: [20, -52],
    iconLargeMask: '/img/heroes/data/gambit/hero-select-mask.webp',

    ranks: [
        {
            type: PROFICIENCY_RANKS.agent!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 20
                },
                {
                    type: 'heal',
                    needed: 4500,
                    reward: 7
                },
                {
                    type: 'kos_assists',
                    needed: 15,
                    reward: 7
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.knight!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 20
                },
                {
                    type: 'heal',
                    needed: 9100,
                    reward: 13
                },
                {
                    type: 'kos_assists',
                    needed: 30,
                    reward: 13
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.captain!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 20
                },
                {
                    type: 'heal',
                    needed: 14000,
                    reward: 20
                },
                {
                    type: 'kos_assists',
                    needed: 45,
                    reward: 20
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.centurion!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 20
                },
                {
                    type: 'heal',
                    needed: 18000,
                    reward: 26
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 26
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.lord!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 60
                },
                {
                    type: 'heal',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 80
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.count!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 60
                },
                {
                    type: 'heal',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 80
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.colonel!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 60
                },
                {
                    type: 'heal',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 80
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.warrior!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 60
                },
                {
                    type: 'heal',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 80
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.elite!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 60
                },
                {
                    type: 'heal',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 80
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.guardian!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 60
                },
                {
                    type: 'heal',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 80
                },
            ],
        },
        {
            type: PROFICIENCY_RANKS.champion!,
            challenges: [
                {
                    type: 'play',
                    needed: 15,
                    reward: 60
                },
                {
                    type: 'heal',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 80
                },
            ],
        },
    ]
}