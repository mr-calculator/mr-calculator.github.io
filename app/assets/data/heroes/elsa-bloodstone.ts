import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const ElsaBloodstone: HeroData = {
    id: 'elsa-bloodstone',
    name: 'Elsa Bloodstone',
    aliases: [
        'The Hunter Heiress',
        'Ellie',
        'English Girl',

        'release the glartrox',
        'release the glortrox',
        'release the glartrox',
        'release the glortrock'
    ],
    roles: 'duelist',
    color: '#e86245',
    dataDir: '/img/heroes/data/elsa-bloodstone/',

    iconAnimationOffset: [15, -20],

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
                    type: 'damage',
                    needed: 11000,
                    reward: 13
                },
                {
                    type: 'finals',
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
                    type: 'damage',
                    needed: 17000,
                    reward: 20
                },
                {
                    type: 'finals',
                    needed: 17,
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
                    needed: 23,
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
                    needed: 23,
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
                    needed: 23,
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
                    needed: 23,
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
                    needed: 23,
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
                    needed: 23,
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
                    needed: 23,
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
                    needed: 23,
                    reward: 80
                },
            ],
        },
    ]
}