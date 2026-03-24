import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const MoonKnight: HeroData = {
    id: 'moon-knight',
    name: 'Moon Knight',
    aliases: [
        'Marc Spector',
        'Steven Grant',
        'Jake Lockley',
        'Fist of Khonshu',
        'Mister Knight',

        'moonie',
        'oscar isaac',
        'oscar issac',

        'the moon haunts you'
    ],
    roles: 'duelist',
    color: '#809ab0',
    dataDir: '/img/heroes/data/moon-knight/',

    iconAnimationSize: [3584, 3980],
    iconAnimationOffset: [0, -42],

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
                    type: 'damage',
                    needed: 4400,
                    reward: 7
                },
                {
                    type: 'finals',
                    needed: 4,
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
                    type: 'damage',
                    needed: 8800,
                    reward: 13
                },
                {
                    type: 'finals',
                    needed: 8,
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
                    type: 'damage',
                    needed: 13000,
                    reward: 20
                },
                {
                    type: 'finals',
                    needed: 12,
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
                    type: 'damage',
                    needed: 18000,
                    reward: 26
                },
                {
                    type: 'finals',
                    needed: 17,
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
                    type: 'damage',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'finals',
                    needed: 17,
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
                    type: 'damage',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'finals',
                    needed: 17,
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
                    type: 'damage',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'finals',
                    needed: 17,
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
                    type: 'damage',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'finals',
                    needed: 17,
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
                    type: 'damage',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'finals',
                    needed: 17,
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
                    type: 'damage',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'finals',
                    needed: 17,
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
                    type: 'damage',
                    needed: 18000,
                    reward: 80
                },
                {
                    type: 'finals',
                    needed: 17,
                    reward: 80
                },
            ],
        },
    ]
}