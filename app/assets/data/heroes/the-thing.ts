import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const TheThing: HeroData = {
    id: 'the-thing',
    name: 'The Thing',
    aliases: [
        'Benjamin Jacob Ben Grimm',
        'Benjy',
        'The Ever-Lovin\' Blue-Eyed Thing',

        'it\'s clobbering time',
        'its clobbering time',
    ],
    roles: 'vanguard',
    color: '#fbb565',
    dataDir: '/img/heroes/data/the-thing/',

    iconAnimationSize: [3584, 3980],
    iconAnimationOffset: [-2, -38],

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
                    needed: 7,
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
                    needed: 15,
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
                    needed: 22,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
                    reward: 80
                },
            ],
        },
    ]
}