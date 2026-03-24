import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const HumanTorch: HeroData = {
    id: 'human-torch',
    name: 'Human Torch',
    aliases: [
        'Jonathan Lowell Spencer Johnny Storm',

        'supernova'
    ],
    roles: 'duelist',
    color: '#e47263',
    dataDir: '/img/heroes/data/human-torch/',

    iconAnimationSize: [3588, 3972],
    iconAnimationOffset: [0, -32],

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