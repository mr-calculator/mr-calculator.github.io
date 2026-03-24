import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Phoenix: HeroData = {
    id: 'phoenix',
    name: 'Phoenix',
    aliases: [
        'Jean Elaine Grey-Summers',
        'Jeannie',
        'Dark Phoenix',
        'Marvel Girl',

        'you are nothing'
    ],
    roles: 'duelist',
    color: '#fd7b73',
    dataDir: '/img/heroes/data/phoenix/',

    iconAnimationSize: [3528, 3980],
    iconAnimationOffset: [10, -25],

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
                    needed: 5700,
                    reward: 7
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 11000,
                    reward: 13
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 17000,
                    reward: 20
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 23000,
                    reward: 26
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 23000,
                    reward: 80
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 23000,
                    reward: 80
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 23000,
                    reward: 80
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 23000,
                    reward: 80
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 23000,
                    reward: 80
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 23000,
                    reward: 80
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 23000,
                    reward: 80
                },
                {
                    type: 'finals',
                    needed: 25,
                    reward: 80
                },
            ],
        },
    ]
}