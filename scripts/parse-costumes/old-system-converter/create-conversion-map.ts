import fs from "fs";
import { BASE, Costume, COSTUMES_FILE } from "../util";
import { OLD_HERO_COSMETICS, skinSlug } from "./old-costumes";
import path from "path";

const newCostumes: Record<string, Costume[]> = JSON.parse(fs.readFileSync(COSTUMES_FILE, { encoding: 'utf-8' }));

const map: Record<string, string|null> = {};

Object.entries(OLD_HERO_COSMETICS).forEach(([ heroId, costumes ]) => {
    if (!newCostumes[heroId])
        return;

    costumes.forEach(costume => {
        const costumeName = costume.nameMatch ? costume.nameMatch.toUpperCase() : costume.name.toUpperCase();

        let newCEqv = newCostumes[heroId].find(newCostume => costumeName == newCostume.name.toUpperCase());

        if (!newCEqv) {
            // attempt to append `(IGNITE SERIES 2026)`
            newCEqv = newCostumes[heroId].find(newCostume => costumeName + ' (IGNITE SERIES 2026)' == newCostume.name.toUpperCase());

            if (!newCEqv) {
                console.error(`Failed to find equivalent for ${costume.name} [${skinSlug(costume.name)}], hero [${heroId}], leaving empty`);
                map[skinSlug(costume.name)] = null;

                return;
            }
        }

        map[skinSlug(costume.name)] = newCEqv.id;
    });
})

fs.writeFileSync(path.join(BASE, 'output', 'conversion-map.json'), JSON.stringify(map, undefined, 4));
console.log('Success');