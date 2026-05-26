import fs from "fs";
import path from "path";
import * as p from '@clack/prompts';
import { HERO_LIST } from "../../app/assets/data/heroes";
import { generateSeoImage, SEO_DEST_DIR } from "./generator";

function checkCancelled(res: any|symbol) {
    if (typeof res === 'symbol') {
        p.cancel('Canceled');
        process.exit(0);
    }
}

async function main() {
    p.intro('Generate SEO Images for heroes')
    const allHeroes = await p.select({
        message: 'Generate SEO images for:',
        options: [
            { label: 'Specific hero', value: false },
            { label: 'All heroes', value: true },
        ]
    });

    checkCancelled(allHeroes);

    let heroIds: string[] = [];
    if (!allHeroes) {
        const heroId = await p.select({
            message: 'Which hero?',
            options: HERO_LIST.map(h => ({
                label: h.name,
                value: h.id
            }))
        });

        checkCancelled(heroId);

        heroIds.push(heroId as string);
    }
    else
        heroIds.push(...HERO_LIST.map(h => h.id));

    const promises = heroIds.map(id => new Promise<void>(async resolve => {
        try {
            const image = await generateSeoImage(id);
            fs.writeFileSync(path.join(SEO_DEST_DIR, `${id}.webp`), image);

            p.log.info(`Successfully generated seo image for [${id}]`);
            resolve();
        }
        catch (e) {
            p.log.error(`Failed to generate image for [${id}] due to: "${e}"`);
        }
    }));

    await Promise.all(promises);

    p.outro('Completed');
}

try {
    await main();
}
catch(err) {
    p.log.error(err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack)
        p.log.error(err.stack);

    process.exit(1);
}