import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const IronFist: HeroData = {
    id: 'iron-fist',
    name: 'Iron Fist',
    aliases: [
        'Lin Lie',
        '林烈',
        'The Immortal Weapon',
        'Protector of K\'un-Lun',
        'Protector of Kun-Lun',
        'Sword Master',

        '气贯长虹',
        'Qì guàn cháng hóng',
        'qi guan chang hong',
        'cheaper town hall'
    ],
    roles: 'duelist',
    color: '#32b5a2',
    dataDir: '/img/heroes/data/iron-fist/',

    iconAnimationSize: [3584, 3940],
    iconAnimationOffset: [-3, -35],

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
                    needed: 3100,
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
                    needed: 6200,
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
                    needed: 92000,
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
                    needed: 12000,
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
                    needed: 12000,
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
                    needed: 12000,
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
                    needed: 12000,
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
                    needed: 12000,
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
                    needed: 12000,
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
                    needed: 12000,
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
                    needed: 12000,
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