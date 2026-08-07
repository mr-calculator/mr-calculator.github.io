import 'dotenv/config'
import { log } from "@clack/prompts";
import fs from "fs"
import path from "path";
import sharp from "sharp";
import { generateSeoImage, SEO_DEST_DIR } from '../generate-hero-seo-image/generator';

/**
 * From pak: `pakchunkHQ-Windows.utoc`
 * To export root directories:
 * - Battle/
 * - HeroDetail/
 * - HeroGallery_V3/
 * - HeroLogo/
 * - HeroPortrait/
 * - Item/
 * - Mastery/
 * - Show/
 */

export const FILES = {
    'fantastic-nameplate': 'Item/Nameplate/item_nameplate_3%HERO_ID%002',
    'uncanny-nameplate': 'Item/Nameplate/item_nameplate_3%HERO_ID%003',
    'amazing-nameplate': 'Item/Nameplate/item_nameplate_3%HERO_ID%004',
    'immortal-nameplate': 'Item/Nameplate/item_nameplate_3%HERO_ID%005',

    'bust': 'HeroPortrait/SelectHero/img_selecthero_%HERO_ID%001',
    'bust-champion': 'Mastery/Common/%HERO_ID%/fb_mastery2%HERO_ID%020',
    'bust-lord': 'HeroPortrait/TransverseHeroHead/Proficiency/img_commontransverse_2%HERO_ID%020_avatar',
    'head': 'HeroPortrait/SquareHeroHead/img_squarehead_%HERO_ID%0010_avatar',
    'transverse-head': [
        'HeroPortrait/TransverseHeroHead/img_commontransverse_%HERO_ID%0010_avatar',
        'HeroPortrait/TransverseHeroHead/img_commontransverse_%HERO_ID%0011_avatar' // hulk
    ],
    'head-lord': 'HeroPortrait/SquareHeroHead/Proficiency/img_squarehead_2%HERO_ID%020_avatar',
    'battle-head': [
        'Battle/PlayerInfo/V2/img_battle_%HERO_ID%0_avatar',
        'Battle/PlayerInfo/V2/img_battle_%HERO_ID%1_avatar' // cnd (tandy)
    ],
    'battle-head-lord': [
        'Battle/PlayerInfo/V2/Proficiency/img_battle_2%HERO_ID%020_avatar',
        'Battle/PlayerInfo/V2/Proficiency/img_battle_2%HERO_ID%021_avatar' // cnd (tandy)
    ],

    'ko-1': 'Item/Kill/item_kill_2%HERO_ID%12',
    'ko-2': 'Item/Kill/item_kill_2%HERO_ID%13',

    'logo': 'HeroLogo/img_herologo_%HERO_ID%_logo',
    'portrait': [
        'Show/Skin/OriginalSkin/img_heroportrait_%HERO_ID%0010_portrait',
        'Show/Skin/OriginalSkin/img_heroportrait_%HERO_ID%0010_small2' // cnd both
    ],
    'full-body': [
        'Show/Skin/OriginalSkin/img_heroportrait_%HERO_ID%0010_portrait',
        'Show/Skin/OriginalSkin/img_heroportrait_%HERO_ID%0010_small2' // cnd both
    ],
    'prestige': 'HeroGallery_V3/HeroDetail/Prestige/HeroPrestige/img_prestige_%HERO_ID%0010_hero',
    'story': [
        'HeroGallery_V3/HeroDetail/Story/Dynamic/img_herostory_%HERO_ID%01_hover',
        'HeroGallery_V3/HeroDetail/Story/Dynamic/img_herostory_%HERO_ID%11_hover', // hulk
    ],
    'silhouette': 'HeroDetail/img_herogallery_silhouette_%HERO_ID%_bg',
    'spray': 'Show/Spray/img_spray_4%HERO_ID%002'
};

export type ResourceId = keyof typeof FILES;

/**
 * With FModel: `Path/to/FModel/Output/Exports/Marvel/Content/Marvel/UI/Textures`
 * 
 * PAK path: `Marvel/Content/Marvel/UI/Textures`
 */
const GAME_FILES_DIRECTORY = process.env.GAME_FILES_DIRECTORY!;

/**
 * Copies and converts all necessary images to the hero's own folder
 * @param internalId Marvel Game ID (e.g.: 1031)
 * @param heroId kebab-case id of hero
 */
export async function copyImages(
    internalId: string,
    heroId: string,
    logger: typeof log,
    resources?: ResourceId[],
    generateSEOImage: boolean = true
) {
    const heroDir = `./public/img/heroes/data/${heroId}/`;
    if (!fs.existsSync(heroDir))
        fs.mkdirSync(heroDir)

    for (const [result, resourcePathAny] of Object.entries(FILES)) {
        if (resources?.length && !resources.includes(result as ResourceId))
            continue;

        let resPathAny1 = Array.isArray(resourcePathAny) ? resourcePathAny[0] : resourcePathAny;

        const resourcePath = () => resPathAny1.replaceAll('%HERO_ID%', internalId);
        const resourceFullPath = () => path.join(GAME_FILES_DIRECTORY, resourcePath()) + '.png';

        let exists = false;
        const checkExists = (iteration = 0) => {
            let hasNext = false;
            if (Array.isArray(resourcePathAny) && iteration < resourcePathAny.length - 1)
                hasNext = true;

            if (!fs.existsSync(resourceFullPath())) {
                logger.error(`Couldn\'t find resource [${resourcePath()}] for [${heroId}], ${hasNext ?
                    'attempting other path' : 'skipping'
                }`);

                if (hasNext) {
                    resPathAny1 = resourcePathAny[++iteration];
                    checkExists(iteration);
                }
            }
            else
                exists = true;
        }

        checkExists();
        if (!exists)
            continue;

        // cut portrait above the knees
        if (result == 'portrait') {
            await sharp(resourceFullPath())
                .extract({ left: 201, top: 41, width: 295, height: 556 })
                .webp({ quality: 85 })
                .toFile(path.join(heroDir, result) + '.webp')
        }
        else if (
            result == 'full-body'
         && (heroId == 'devil-dinosaur' || heroId == 'jeff-the-land-shark')) {
            if (heroId == 'devil-dinosaur') {
                await sharp(resourceFullPath())
                    .extract({ left: 0, top: 0, width: 530, height: 484 })
                    .webp({ quality: 85 })
                    .toFile(path.join(heroDir, result) + '.webp')
            }
            else if (heroId == 'jeff-the-land-shark') {
                await sharp(resourceFullPath())
                    .extract({ left: 105, top: 0, width: 560, height: 380 })
                    .webp({ quality: 85 })
                    .toFile(path.join(heroDir, result) + '.webp')
            }
        }
        else {
            await sharp(resourceFullPath())
                .webp({ quality: 85 })
                .toFile(path.join(heroDir, result) + '.webp')
        }
    }


    if (generateSEOImage) {
        logger.info(`Generating SEO image for ${heroId}`);
        try {
            const image = await generateSeoImage(heroId);
            fs.writeFileSync(path.join(SEO_DEST_DIR, `${heroId}.webp`), image);
        }
        catch (e) {
            logger.error(`Failed to generate image for [${heroId}] due to: "${e}"`);
        }
    }
}