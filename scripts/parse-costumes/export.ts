import { JSDOM } from 'jsdom';
const { DOMParser } = new JSDOM().window;
import { forEachTable } from "./util";
import { HERO_LIST } from '../../app/assets/data/heroes';

type CellProcessor = (cells: NodeListOf<HTMLTableCellElement>) => void;

const wikiHeroIds = new Set<string>();
const processHeroIds: CellProcessor = (cells) => {
    const heroCell = cells[9];
    if (!heroCell)
        return;

    const heroName = heroCell.querySelector('div span[typeof="mw:File"] span')?.getAttribute('title');
    if (!heroName)
        return;

    wikiHeroIds.add(heroName);
}

const costumeTypes = new Set<string>();
const processCostumeTypes: CellProcessor = (cells) => {
    const typeCell = cells[8];
    if (!typeCell)
        return;

    const sortVal = typeCell.getAttribute('data-sort-value');
    if (!sortVal)
        return;

    costumeTypes.add(sortVal);
};

const costumeSources = new Set<string>();
const processCostumeSources: CellProcessor = (cells) => {
    const typeCell = cells[8];
    if (!typeCell)
        return;

    const title = typeCell.querySelector('font span span a')?.getAttribute('title');
    if (!title)
        return;

    costumeSources.add(title);
};

const costumeRarities = new Set<string>();
const processCostumeRarities: CellProcessor = (cells) => {
    const rarityCell = cells[6];
    if (!rarityCell)
        return;

    const sortVal = rarityCell.getAttribute('data-sort-value');
    if (!sortVal)
        return;

    costumeRarities.add(sortVal);
};

forEachTable((table: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(table, 'text/html');
    const rows = doc.querySelectorAll('tr');

    Array.from(rows).forEach(row => {
        const cells = row.querySelectorAll('td');
        
        processHeroIds(cells);
        processCostumeTypes(cells);
        processCostumeSources(cells);
        processCostumeRarities(cells);
    });
});

console.log(JSON.stringify(Array.from(costumeSources).sort(), undefined, 4));

// console.log(JSON.stringify(Array.from(costumeRarities).sort(), undefined, 4));

// console.log(JSON.stringify(Array.from(costumeTypes).sort(), undefined, 4));

// const wikiIds = Array.from(wikiHeroIds).sort();
// console.log(JSON.stringify(wikiIds, undefined, 4));

// console.log(JSON.stringify(HERO_LIST.map(h => h.id).sort(), undefined, 4));