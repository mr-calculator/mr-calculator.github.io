import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const SquirrelGirl: HeroData = {
    id: 'squirrel-girl',
    name: 'Squirrel Girl',
    aliases: [
        'Doreen Allene Green',
        'Aliases',
        'The Unbeatable Squirrel Girl',

        'Squirrel stampede'
    ],
    roles: 'duelist',
    color: '#f4a366',
    dataDir: '/img/heroes/data/squirrel-girl/',

    iconAnimationOffset: [-8, -15],
    iconLargeAnimationOffset: [-8, -10],
    iconLargeMask: '/img/heroes/data/squirrel-girl/hero-select-mask.webp',

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
                    needed: 5100,
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
                    needed: 10000,
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
                    needed: 15000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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