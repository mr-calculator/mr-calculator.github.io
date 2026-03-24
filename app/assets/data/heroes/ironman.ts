import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Ironman: HeroData = {
    id: 'ironman',
    name: 'Iron Man',
    aliases: [
        'Anthony Edward Tony Stark',
        'Invincible Iron Man',
        'Armored Avenger',

        'jarvis remove his balls',

        'maximum pulse'
    ],
    roles: 'duelist',
    color: '#ff6680',
    dataDir: '/img/heroes/data/ironman/',

    iconAnimationOffset: [-17, -15],

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