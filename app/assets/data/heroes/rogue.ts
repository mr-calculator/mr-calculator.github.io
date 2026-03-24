import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Rogue: HeroData = {
    id: 'rogue',
    name: 'Rogue',
    aliases: [
        'Anna Marie LeBeau',
        'Mrs. X',

        'i take everything'
    ],
    roles: 'vanguard',
    color: '#e4ca62',
    dataDir: '/img/heroes/data/rogue/',

    iconAnimationSize: [3584, 3972],
    iconAnimationOffset: [-20, -32],
    iconLargeAnimationOffset: [0, -32],

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
                    type: 'take_damage',
                    needed: 9000,
                    reward: 7
                },
                {
                    type: 'kos',
                    needed: 6,
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
                    type: 'take_damage',
                    needed: 18000,
                    reward: 13
                },
                {
                    type: 'kos',
                    needed: 13,
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
                    type: 'take_damage',
                    needed: 27000,
                    reward: 20
                },
                {
                    type: 'kos',
                    needed: 19,
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
                    type: 'take_damage',
                    needed: 36000,
                    reward: 26
                },
                {
                    type: 'kos',
                    needed: 25,
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
                    type: 'take_damage',
                    needed: 36000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 25,
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
                    type: 'take_damage',
                    needed: 36000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 25,
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
                    type: 'take_damage',
                    needed: 36000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 25,
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
                    type: 'take_damage',
                    needed: 36000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 25,
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
                    type: 'take_damage',
                    needed: 36000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 25,
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
                    type: 'take_damage',
                    needed: 36000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 25,
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
                    type: 'take_damage',
                    needed: 36000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 25,
                    reward: 80
                },
            ],
        },
    ]
}