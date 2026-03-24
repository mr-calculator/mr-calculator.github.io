import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const StarLord: HeroData = {
    id: 'star-lord',
    name: 'Star-Lord',
    aliases: [
        'star lord',
        'Peter Jason Quill',
        'Lord of Stars',
        'Master of the Sun',

        'legendary'
    ],
    roles: 'duelist',
    color: '#6498e6',
    dataDir: '/img/heroes/data/star-lord/',

    iconAnimationSize: [3584, 3980],
    iconAnimationOffset: [0, -47],
    iconLargeAnimationOffset: [20, -47],

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
                    type: 'damage',
                    needed: 8800,
                    reward: 13
                },
                {
                    type: 'finals',
                    needed: 10,
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
                    needed: 15,
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
                    needed: 20,
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
                    needed: 20,
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
                    needed: 20,
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
                    needed: 20,
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
                    needed: 20,
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
                    needed: 20,
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
                    needed: 20,
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
                    needed: 20,
                    reward: 80
                },
            ],
        },
    ]
}