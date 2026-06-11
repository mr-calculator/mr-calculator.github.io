import fs from "fs";
import { JSDOM } from 'jsdom';
const { DOMParser } = new JSDOM().window;
import * as p from '@clack/prompts'
import { ACHIEVEMENT_CATEGORIES, AchievementTypeCategory } from "../../app/assets/data/achievements/achievements";
import { HERO_LIST } from "../../app/assets/data/heroes";

const BASE = `./scripts/parse-achievements-table`;
const ACHIEVEMENTS_FILE = (category: string) =>         `./app/assets/data/achievements/${category}.json`;
const ACHIEVEMENTS_FILE_BACKUP = (category: string) =>  `./app/assets/data/achievements/${category}_%DATE%.backup.json`;

type AchievementTypeRarity = 'copper'|'silver'|'gold'|string;
interface AchievementType {
    /**
     * For now, it stands for a Hero's Id
     */
    owner?: string,

    id: string,
    title: string,
    description: string,
    category: AchievementTypeCategory,
    rarity: AchievementTypeRarity,

    requirement: number,
    reward: number
}

function toKebabCase(string: string) {
	return string.replace(/\s+/g, '-')
				.replace(/[^a-zA-Z0-9-_]/g, '')
				.replace(/-+/g, '-')
				.replace(/^-+|-+$/g, '')
				.toLowerCase();
}

function fileNameFriendlyDate(date: Date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const millis = date.getUTCMilliseconds();
    return `${year}-${month}-${day}.${hours}-${minutes}-${seconds}-${millis}`;
}

function createDiff(newAchievements: AchievementType[], oldAchievements: AchievementType[]) {
	const diffAchievements: AchievementType[] = newAchievements.filter(newAch =>
		!oldAchievements.find(oldAch => 
			oldAch.id.slice(37, oldAch.id.length) === newAch.id.slice(37, newAch.id.length)
		)
	);
	return diffAchievements;
}

function parseAchievements(html: string, category: AchievementTypeCategory): AchievementType[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<table><tbody>${html}</tbody></table>`, 'text/html');
    const rows = doc.querySelectorAll('tr');

    return Array.from(rows).map<AchievementType|null>(row => {
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
    }).filter(Boolean) as AchievementType[];
}

async function main() {
	p.intro('Parse a table from MR Wiki/Achievements to extract bulk data.')
	p.log.info(
		'This expects the tables to exist in `./scripts/parse-achievements-table/tables/` with the id names. (only <tr> elements of the <tbody>)'
	);
	p.log.info(
		'You are expected to manually check every new addition. There will be a string item insertion in between the previous achievememnts and the new ones, delete it once everything has been manually checked!'
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
	const tablePath = `${BASE}/tables/${category}.html`;
	const outputPath = `${BASE}/output/${category}.json`;
	const outputAppPath = ACHIEVEMENTS_FILE(category);

	const html = fs.readFileSync(
		tablePath,
		{ encoding: 'utf-8' }
	);
	const achievements = parseAchievements(html, category);

	let previousAchivements: AchievementType[] = [];
	if (fs.existsSync(outputAppPath)) {
		previousAchivements = JSON.parse(
			fs.readFileSync(outputAppPath, { encoding: 'utf-8' })
		);
	}

	const diff = createDiff(achievements, previousAchivements);

	if (diff.length) {
		// make a backup in case things go south
		if (fs.existsSync(outputAppPath)) {
			p.log.info(`Making a backup of the previous achievements file (${category})...`);
			fs.copyFileSync(
				outputAppPath,
				ACHIEVEMENTS_FILE_BACKUP(category).replace(
					'%DATE%', fileNameFriendlyDate(new Date())
				)
			);
		}

		const combinedAchievements: (AchievementType|'_____new_achievements_____')[] = previousAchivements.slice();
		combinedAchievements.push(
			'_____new_achievements_____',
			...diff
		);

		fs.writeFileSync(outputPath, JSON.stringify(combinedAchievements, null, 2));
		fs.writeFileSync(outputAppPath, JSON.stringify(combinedAchievements, null, 2));

		p.log.info(`Parsed ${category} successfully. Saved at: ${outputPath}, ${outputAppPath}`);
		p.log.info(`Added ${diff.length} achievements to ${category}.`);
	}
	else
		p.log.warn(`${category} didn't have any new additions. Nothing was modified.`);
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