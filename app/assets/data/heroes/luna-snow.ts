import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const LunaSnow: HeroData = {
    id: 'luna-snow',
    name: 'Luna Snow',
    aliases: [
        'Seol Hee',
        '설희',

        'guang guang\'s favourite',
        'guang guang\'s favorite',
        'guangguang\'s favourite',
        'guangguang\'s favorite',
        'guang guangs favourite',
        'guang guangs favorite',
        'guangguangs favourite',
        'guangguangs favorite',

        'i am ready to pun on a show'
    ],
    roles: 'strategist',
    color: '#227ddf',
    dataDir: '/img/heroes/data/luna-snow/',

    iconAnimationOffset: [-10, -35],

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
                    needed: 6200,
                    reward: 7
                },
                {
                    type: 'kos_assists',
                    needed: 15,
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
                    needed: 12000,
                    reward: 13
                },
                {
                    type: 'kos_assists',
                    needed: 30,
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
                    needed: 18000,
                    reward: 20
                },
                {
                    type: 'kos_assists',
                    needed: 45,
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
                    needed: 25000,
                    reward: 26
                },
                {
                    type: 'kos_assists',
                    needed: 60,
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
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
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
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
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
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
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
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
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
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
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
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
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
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 60,
                    reward: 80
                },
            ],
        },
    ]
}