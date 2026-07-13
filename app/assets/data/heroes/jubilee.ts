import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const Jubilee: HeroData = {
    meta: {
        releasedAt: '2026-07-10',
        featured: true
    },
    internalId: '1064',
    id: 'jubilee',
    name: 'Jubilee',
    aliases: [
        'Jubilation Lee',
        '李千歡',
        'Jubes',
        'Jub Jub',
        'The Explosive Firecracker',
        'Horseman of Famine',
    ],
    roles: ['strategist'],
    color: '#f5ca53',
    dataDir: '/img/heroes/data/jubilee/',
    
    iconAnimationOffset: [17, 20],
    iconLargeAnimationOffset: [-8, 17],

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
                    type: 'heal',
                    needed: 6200,
                    reward: 7
                },
                {
                    type: 'kos_assists',
                    needed: 17,
                    reward: 7
                }
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
                    type: 'heal',
                    needed: 12000,
                    reward: 13
                },
                {
                    type: 'kos_assists',
                    needed: 35,
                    reward: 13
                }
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
                    type: 'heal',
                    needed: 18000,
                    reward: 20
                },
                {
                    type: 'kos_assists',
                    needed: 52,
                    reward: 20
                }
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
                    type: 'heal',
                    needed: 25000,
                    reward: 26
                },
                {
                    type: 'kos_assists',
                    needed: 70,
                    reward: 26
                }
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
                    type: 'heal',
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 70,
                    reward: 80
                }
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
                    type: 'heal',
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 70,
                    reward: 80
                }
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
                    type: 'heal',
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 70,
                    reward: 80
                }
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
                    type: 'heal',
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 70,
                    reward: 80
                }
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
                    type: 'heal',
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 70,
                    reward: 80
                }
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
                    type: 'heal',
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 70,
                    reward: 80
                }
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
                    type: 'heal',
                    needed: 25000,
                    reward: 80
                },
                {
                    type: 'kos_assists',
                    needed: 70,
                    reward: 80
                }
            ],
        },
    ]
}