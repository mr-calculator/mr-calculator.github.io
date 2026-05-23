import fs from "fs";
import { JSDOM } from 'jsdom';
const { DOMParser } = new JSDOM().window;
import * as p from '@clack/prompts'
import { ACHIEVEMENT_CATEGORIES, AchievementTypeCategory } from "../../app/assets/data/achievements";
import { HERO_LIST } from "../../app/assets/data/heroes";

const BASE = `./scripts/parse-achievements-table`;

function toKebabCase(string: string) {
	return string.replace(/\s+/g, '-')
				.replace(/[^a-zA-Z0-9-_]/g, '')
				.replace(/-+/g, '-')
				.replace(/^-+|-+$/g, '')
				.toLowerCase();
}

function parseAchievements(html: string, category: AchievementTypeCategory) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<table><tbody>${html}</tbody></table>`, 'text/html');
    const rows = doc.querySelectorAll('tr');

    return Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 5)
			return null;

        // Rarity from image src in 2nd cell
        const iconSrc = cells[1].querySelector('img')?.getAttribute('src') ?? '';
        let rarity = '';
        if (iconSrc.includes('Gold'))
			rarity = 'gold';
        else if (iconSrc.includes('Silver'))
			rarity = 'silver';
        else if (iconSrc.includes('Bronze') || iconSrc.includes('Copper'))
			rarity = 'copper';

        // Title from 3rd cell
        const title = cells[2].textContent.trim();

        // ID from title
        const id = toKebabCase(title);

        // Description from 4th cell (text only)
        const description = cells[3].textContent.trim();
		// Requirement from description
		const requirementMatch = description.match(/\d+/);
		const requirement = requirementMatch ? parseInt(requirementMatch[0], 10) : 1;

        // Reward from 5th cell (extract number only)
        const rewardMatch = cells[4].textContent.trim().match(/\d+/);
        const reward = rewardMatch ? parseInt(rewardMatch[0], 10) : 0;

		// Hero id if the category is heroic-journey
		let heroId = undefined;
		if (category == 'heroic-journey') {
			const heroIconSrc = cells[5].querySelector('img')?.getAttribute('src') ?? '';
			const kebabishCase = heroIconSrc.replaceAll('_', '-').toLowerCase();

			heroId = HERO_LIST.find(h => kebabishCase.includes(h.id))?.id ?? `!!${kebabishCase}!!`;
		}

        return {
            owner: heroId,
			
            id: crypto.randomUUID() + '_' + id,
            title,
            description,
            category,
            rarity,
            requirement,
            reward,
        };
    }).filter(Boolean);
}

async function main() {
	p.intro('Parse a table from MR Wiki/Achievements to extract bulk data.')
	p.log.info(
		'This expects the tables to exist in `./scripts/parse-achievements-table/tables/` with the id names. (only <tr> elements of the <tbody>)'
	);

	const category = await p.select({
		message: 'Which category is this table in?',
		options: [
			...ACHIEVEMENT_CATEGORIES.map(c => ({
				label: `${c.name} (${c.id})`,
				value: c.id
			})),
			{
				label: 'All',
				value: 'all'
			}
		]
	});

	if (typeof category === 'symbol') {
		p.cancel('Cancelled');
		process.exit(0);
	}

	if (category !== 'all')
		parseAchievementCategory(category);
	else
		for (const cat of ACHIEVEMENT_CATEGORIES)
			parseAchievementCategory(cat.id);

	p.outro('Parse finished');
}

function parseAchievementCategory(category: AchievementTypeCategory) {
	const html = fs.readFileSync(
		`${BASE}/tables/${category}.html`,
		{ encoding: 'utf-8' }
	);
	const achievements = parseAchievements(html, category);

	const outputPath = `${BASE}/output/${category}.json`
	fs.writeFileSync(outputPath, JSON.stringify(achievements, null, 2));

	p.log.info(`Parsed ${category} successfully. Saved at: ${outputPath}`);
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