import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Ultron: HeroData = {
    id: 'ultron',
    name: 'Ultron',
    aliases: [
        'X-Tron',

        'extermination'
    ],
    roles: 'strategist',
    color: '#8492bb',
    dataDir: '/img/heroes/data/ultron/',

    iconAnimationSize: [3584, 3972],
    iconAnimationOffset: [-5, -33],

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
                    needed: 17,
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
                    needed: 35,
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
                    needed: 52,
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
                    needed: 70,
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
                    needed: 70,
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
                    needed: 70,
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
                    needed: 70,
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
                    needed: 70,
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
                    needed: 70,
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
                    needed: 70,
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
                    needed: 70,
                    reward: 80
                },
            ],
        },
    ]
}