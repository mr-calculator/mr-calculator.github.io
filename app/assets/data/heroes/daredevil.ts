import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Daredevil: HeroData = {
    id: 'daredevil',
    name: 'Daredevil',
    aliases: [
        'Matthew Michael Matt Murdock',
        'The Devil of Hell\'s Kitchen',
        'Dizang',
        'The Man Without Fear',

        'aleks le',
        'solo leveling',
        'solo levelling',
        'sung jinwoo',

        'let the devil out',
    ],
    roles: 'duelist',
    color: '#f0597d',
    dataDir: '/img/heroes/data/daredevil/',

    iconAnimationOffset: [-10, -25],
    iconLargeAnimationOffset: [15, -25],

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
                    needed: 3700,
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
                    needed: 7500,
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
                    needed: 11000,
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
                    needed: 15000,
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
                    needed: 15000,
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
                    needed: 15000,
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
                    needed: 15000,
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
                    needed: 15000,
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
                    needed: 15000,
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
                    needed: 15000,
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
                    needed: 15000,
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