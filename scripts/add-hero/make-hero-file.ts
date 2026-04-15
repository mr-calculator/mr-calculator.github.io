import fs from "fs";
import { Challenge, CHALLENGE_PLAY_RANKS, HeroRole, PROFICIENCY_RANKS } from "../../app/assets/data/common";
import { guessChallenge } from "../../app/assets/data/converge";

const emptyChallenge = () =>({
    type: 'damage',
    needed: 0,
    reward: 0
});

const template = `import { PROFICIENCY_RANKS, type HeroData } from "../common";

export const %HERO_NAME_CONST%: HeroData = {
    id: '%HERO_ID%',
    name: '%HERO_NAME%',
    aliases: [
        
    ],
    roles: %HERO_ROLES%,
    color: '%HERO_COLOR%',
    dataDir: '/img/heroes/data/%HERO_ID%/',
    
    ranks: [
`;

/**
 * Creates the hero's data file (app/assets/data/heroes/<hero-name>.ts)
 * This does not add the hero to the heroes list, that must be done manually
 * @param param0 hero information gathered from main script prompts
 */
export function makeHeroFile({
    id,
    name,
    roles,
    color,
    mission1,
    mission1Req,
    mission2,
    mission2Req 
} : {
    id: string,
    name: string,
    roles: HeroRole[],
    color: string,
    mission1: Challenge['type'],
    mission1Req: string,
    mission2: Challenge['type'],
    mission2Req: string,
}) {
    // replace variables with info
    let file = template.replaceAll('%HERO_ID%', id)
                       .replaceAll('%HERO_NAME%', name)
                       .replaceAll('%HERO_NAME_CONST%', name.replace(/\s+/g, ""))
                       .replaceAll('%HERO_ROLES%', `[${roles.map(r => `'${r}'`).join(', ')}]`)
                       .replaceAll('%HERO_COLOR%', color)

    // guess missions
    const challenge1 = guessChallenge(mission1, parseFloat(mission1Req));
    const challenge2 = guessChallenge(mission2, parseFloat(mission2Req));

    // fill all ranks with missions and needed/reward values
    for (const rankId of Object.keys(PROFICIENCY_RANKS)) {
        const currentPlayChallenge = CHALLENGE_PLAY_RANKS[rankId] ?? emptyChallenge();
        const currentChallenge1 = challenge1?.[rankId] ?? emptyChallenge();
        const currentChallenge2 = challenge2?.[rankId] ?? emptyChallenge();

        file += `        {
            type: PROFICIENCY_RANKS.${rankId}!,
            challenges: [
                {
                    type: 'play',
                    needed: ${currentPlayChallenge.needed},
                    reward: ${currentPlayChallenge.reward}
                },
                {
                    type: '${currentChallenge1.type}',
                    needed: ${currentChallenge1.needed},
                    reward: ${currentChallenge1.reward}
                },
                {
                    type: '${currentChallenge2.type}',
                    needed: ${currentChallenge2.needed},
                    reward: ${currentChallenge2.reward}
                }
            ],
        },
`
    }

    file += `    ]
}`;

    // write the ts file
    fs.writeFileSync(`./app/assets/data/heroes/${id}.ts`, file, { encoding: 'utf-8'});
}