import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Deadpool: HeroData = {
    id: 'deadpool',
    name: 'Deadpool',
    roles: ['vanguard', 'duelist', 'strategist'],
    aliases: [
        'Wade Winston Wilson',
        'Merc with a Mouth',
        'King of Monsters',
        'Dadpool',

        'shut the fuck up',

        'let\'s fucking go',
        'lets fucking go',
        'what are you aiming at'
    ],
    color: '#ff6c67',
    dataDir: '/img/heroes/data/deadpool/',

    iconAnimationSize: [3584, 3980],
    iconAnimationOffset: [5, -30],

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
                    type: 'damage_heal',
                    needed: 5700,
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
                    type: 'damage_heal',
                    needed: 11000,
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
                    type: 'damage_heal',
                    needed: 17000,
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
                    type: 'damage_heal',
                    needed: 23000,
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
                    type: 'damage_heal',
                    needed: 23000,
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
                    type: 'damage_heal',
                    needed: 23000,
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
                    type: 'damage_heal',
                    needed: 23000,
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
                    type: 'damage_heal',
                    needed: 23000,
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
                    type: 'damage_heal',
                    needed: 23000,
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
                    type: 'damage_heal',
                    needed: 23000,
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
                    type: 'damage_heal',
                    needed: 23000,
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