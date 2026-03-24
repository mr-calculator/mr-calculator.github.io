import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const AdamWarlock: HeroData = {
    id: 'adam-warlock',
    name: 'Adam Warlock',
    aliases: [
        'child of light',
        'god slayer',
        'avatar of life',
        'master of all souls',
        'him',

        'born again'
    ],
    roles: 'strategist',
    color: '#e29058',
    dataDir: '/img/heroes/data/adam-warlock/',

    iconAnimationSize: [3584, 3972],
    iconAnimationOffset: [-20, -20],

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
                    type: 'heal',
                    needed: 5400,
                    reward: 7
                },
                {
                    type: 'kos_assists',
                    needed: 13,
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
                    type: 'heal',
                    needed: 11000,
                    reward: 13
                },
                {
                    type: 'kos_assists',
                    needed: 26,
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
                    type: 'heal',
                    needed: 16000,
                    reward: 20
                },
                {
                    type: 'kos_assists',
                    needed: 38,
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
                    type: 'heal',
                    needed: 21000,
                    reward: 26
                },
                {
                    type: 'kos_assists',
                    needed: 51,
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
                    type: 'heal',
                    needed: 21000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 51,
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
                    type: 'heal',
                    needed: 21000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 51,
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
                    type: 'heal',
                    needed: 21000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 51,
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
                    type: 'heal',
                    needed: 21000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 51,
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
                    type: 'heal',
                    needed: 21000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 51,
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
                    type: 'heal',
                    needed: 21000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 51,
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
                    type: 'heal',
                    needed: 21000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 51,
                    reward: 80
                },
            ],
        },
    ]
}