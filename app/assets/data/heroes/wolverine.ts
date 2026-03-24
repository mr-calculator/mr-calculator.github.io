import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Wolverine: HeroData = {
    id: 'wolverine',
    name: 'Wolverine',
    aliases: [
        'James Howlett',
        'Logan',
        'Weapon X',
        'Dog Brother X',

        'berserker rage'
    ],
    roles: 'duelist',
    color: '#deb23d',
    dataDir: '/img/heroes/data/wolverine/',

    iconAnimationSize: [2400, 2668],
    iconAnimationOffset: [-5, -15],
    iconLargeAnimationOffset: [5, -15],

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