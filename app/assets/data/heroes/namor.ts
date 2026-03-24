import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Namor: HeroData = {
    id: 'namor',
    name: 'Namor',
    aliases: [
        'Namor McKenzie',
        'The Sub-Mariner',
        'King of the Seas',

        'whale'
    ],
    roles: 'duelist',
    color: '#35afa5',
    dataDir: '/img/heroes/data/namor/',

    iconAnimationSize: [3584, 3972],
    iconAnimationOffset: [0, -30],

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
                    needed: 10000,
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
                    needed: 15000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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