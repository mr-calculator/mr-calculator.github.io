import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const DoctorStrange: HeroData = {
    id: 'doctor-strange',
    name: 'Doctor Strange',
    aliases: [
        'Dr. Stephen Vincent Strange',
        'Sorcerer Supreme',
        'Wizard',
        'by the eye of mama coco',
        'by the eye of mamacoco',

        'by the eye of agamotto',
        'by the eye of agamoto',
    ],
    roles: 'vanguard',
    color: '#fd7b73',
    dataDir: '/img/heroes/data/doctor-strange/',

    iconAnimationOffset: [-5, -10],

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
                    needed: 10000,
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
                    needed: 21000,
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
                    needed: 31000,
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
                    needed: 42000,
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
                    needed: 42000,
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
                    needed: 42000,
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
                    needed: 42000,
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
                    needed: 42000,
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
                    needed: 42000,
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
                    needed: 42000,
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
                    needed: 42000,
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