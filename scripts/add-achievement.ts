import * as p from "@clack/prompts";
import fs from "fs";
import { ACHIEVEMENT_CATEGORIES } from "../app/assets/data/achievements/achievements";

const ACHIEVEMENTS_FILE = (category: string) => `./app/assets/data/achievements/${category}.json`;

function toKebabCase(string: string) {
	return string.replace(/\s+/g, '-')
				.replace(/[^a-zA-Z0-9-_]/g, '')
				.replace(/-+/g, '-')
				.replace(/^-+|-+$/g, '')
				.toLowerCase();
}

function rarityToReward(rarity: 'copper'|'silver'|'gold') {
    switch (rarity) {
        case 'copper':
            return 5;
        case 'silver':
            return 10;
        case 'gold':
            return 20;
    }
}

async function main() {
    p.intro('Add a new achievement to any achievement category.')

    const achievement = await p.group({
        category: () => p.select({
            message: 'Select an achievement category',
            options: ACHIEVEMENT_CATEGORIES.map(c => ({
                label: `${c.name} (${c.id})`,
                value: c.id
            })),
        }),

        title: () => p.text({
            message: 'Achievement Title'
        }),
        description: () => p.text({
            message: 'Achievement Description'
        }),
        rarity: () => p.select({
            message: 'Achievement Rarity',
            options: [
                { label: 'Copper', value: 'copper' },
                { label: 'Silver', value: 'silver' },
                { label: 'Gold', value: 'gold' },
            ]
        }),
        requirement: () => p.text({
            message: 'Achievement Requirement',
            placeholder: 'e.g.: 5',
            validate: (value) => !value || isNaN(parseInt(value)) ? 'Must be a number!' : undefined
        }),
        reward: (prev) => p.text({
            message: 'Achievement Reward',
            initialValue: rarityToReward(prev.results.rarity as any)!.toString()!,
            defaultValue: rarityToReward(prev.results.rarity as any)!.toString()!,
            validate: (value) => value && isNaN(parseInt(value)) ? 'Must be a number!' : undefined
        }),
    });

    Object.values(achievement).forEach(v => {
        if (typeof v === 'symbol') {
            p.cancel('Cancelled');
            process.exit(0);
        }
    });

    const filePath = ACHIEVEMENTS_FILE(achievement.category);

    if (!fs.existsSync(filePath)) {
        p.cancel(`Achievements file for ${achievement.category} doesn't exist!`);
        process.exit(0);
    }

    const existingAchievements: any[] = JSON.parse(
        fs.readFileSync(filePath, { encoding: 'utf-8' })
    );

    (achievement as any).id = crypto.randomUUID() + '_' + toKebabCase(achievement.title.trim())

    existingAchievements.push({
        id: crypto.randomUUID() + '_' + toKebabCase(achievement.title.trim()),
        title: achievement.title.trim(),
        description: achievement.description.trim(),
        category: achievement.category,
        rarity: achievement.rarity,
        requirement: parseInt(achievement.requirement),
        reward: parseInt(achievement.reward! as string),
    });

    fs.writeFileSync(filePath, JSON.stringify(existingAchievements, null, 2));

    p.outro(`Added achievement ${achievement.title.trim()} to ${achievement.category}.`);
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