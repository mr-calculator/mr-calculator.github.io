import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Angela: HeroData = {
    id: 'angela',
    name: 'Angela',
    aliases: [
        'aldrif odinsdottir',
        'ᚨᚾᚷᛖᛚᚨ ᛟᛞᛁᚾᛋᛞᛟᛏᛏᛁᚱ',
        'the hand of heven',
        'the hand of heaven',

        'heaven fall',
        'heven fall'
    ],
    roles: 'vanguard',
    color: '#ffb158',
    dataDir: '/img/heroes/data/angela/',

    iconAnimationSize: [3624, 4040],
    iconAnimationOffset: [-20, -15],
    iconLargeAnimationOffset: [8, -15],

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
                    type: 'take_damage',
                    needed: 7500,
                    reward: 7
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 15000,
                    reward: 13
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 22000,
                    reward: 20
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 30000,
                    reward: 26
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 30000,
                    reward: 80
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 30000,
                    reward: 80
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 30000,
                    reward: 80
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 30000,
                    reward: 80
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 30000,
                    reward: 80
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 30000,
                    reward: 80
                },
                {
                    type: 'kos',
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
                    type: 'take_damage',
                    needed: 30000,
                    reward: 80
                },
                {
                    type: 'kos',
                    needed: 25,
                    reward: 80
                },
            ],
        },
    ]
}