import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const PeniParker: HeroData = {
    id: 'peni-parker',
    name: 'Peni Parker',
    aliases: [
        'Peni Parker',
        'ペニ・パーカー',
        'Aliases',
        'SP//dr',

        'it\'s sp//dr time',
        'its sp//dr time',
        'it\'s spider time',
        'its spider time',
    ],
    roles: 'vanguard',
    color: '#fe6d67',
    dataDir: '/img/heroes/data/peni-parker/',

    iconAnimationSize: [3584, 3980],
    iconAnimationOffset: [-7, -30],

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
                    needed: 7,
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
                    needed: 15,
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
                    needed: 22,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
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
                    needed: 29,
                    reward: 80
                },
            ],
        },
    ]
}