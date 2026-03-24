import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Magneto: HeroData = {
    id: 'magneto',
    name: 'Magneto',
    aliases: [
        'Max Eisenhardt',
        'Erik Lehnsherr',
        'Magnus',
        'Master of Magnetism',
        'Auschwitz I.D. #214782',

        'fear magneto'
    ],
    roles: 'vanguard',
    color: '#7167a4',
    dataDir: '/img/heroes/data/magneto/',

    iconAnimationSize: [3584, 3980],
    iconAnimationOffset: [-15, -30],

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
                    needed: 9000,
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
                    needed: 18000,
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
                    needed: 27000,
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
                    needed: 36000,
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
                    needed: 36000,
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
                    needed: 36000,
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
                    needed: 36000,
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
                    needed: 36000,
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
                    needed: 36000,
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
                    needed: 36000,
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
                    needed: 36000,
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