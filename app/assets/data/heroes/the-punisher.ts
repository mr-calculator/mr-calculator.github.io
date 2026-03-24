import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const ThePunisher: HeroData = {
    id: 'the-punisher',
    name: 'The Punisher',
    aliases: [
        'Francis David Frank Castle',
        'Castiglione',
        'Frankie',
        'Skull Guy',
        'Johnny Tower',

        'judge jury executioner'
    ],
    roles: 'duelist',
    color: '#5f6a7e',
    dataDir: '/img/heroes/data/the-punisher/',

    iconAnimationSize: [3584, 3980],
    iconAnimationOffset: [-10, -30],

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
                    needed: 5100,
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
                    needed: 10000,
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
                    needed: 15000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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
                    needed: 20000,
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