import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const BruceBanner: HeroData = {
    id: 'bruce-banner',
    name: 'Bruce Banner',
    aliases: [
        'Dr. Robert Bruce Banner',
        'The Incredible Hulk',
        'Big Guy',
        'Jade Giant',
        'Taciturn Terror',
        'Jade Jaws',
        'smash',
        'gamma',

        'im hulking out',
        'i\'m hulking out',
        'hulk smash',
    ],
    roles: 'vanguard',
    color: '#4d8d6f',
    dataDir: '/img/heroes/data/bruce-banner/',

    iconAnimationOffset: [-10, -25],

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
                    needed: 10000,
                    reward: 7
                },
                {
                    type: 'kos',
                    needed: 5,
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
                    needed: 21000,
                    reward: 13
                },
                {
                    type: 'kos',
                    needed: 11,
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
                    needed: 31000,
                    reward: 20
                },
                {
                    type: 'kos',
                    needed: 16,
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
                    needed: 42000,
                    reward: 26
                },
                {
                    type: 'kos',
                    needed: 22,
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
                    needed: 42000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 22,
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
                    needed: 42000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 22,
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
                    needed: 42000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 22,
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
                    needed: 42000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 22,
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
                    needed: 42000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 22,
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
                    needed: 42000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 22,
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
                    needed: 42000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 22,
                    reward: 80
                },
            ],
        },
    ]
}