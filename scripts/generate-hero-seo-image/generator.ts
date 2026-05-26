import fs from 'fs'
import path from 'path'
import satori from 'satori'
import sharp from 'sharp'
import { HERO_LIST } from '../../app/assets/data/heroes';
import { changeColor, objectEntries } from '../../app/utils/util';

export const SEO_DEST_DIR = './public/img/seo/heroes/';

const FONTS = {
    // MarvelRivals: 'https://db.onlinewebfonts.com/t/deff549f5c443598a8380e1f91055c01.ttf',
    // MarvelRivalsBold: 'https://www.marvelrivals.com/pc/gw/20241128194803/font/RefrigeratorDeluxeBold_30fce753.ttf',
    MarvelRivalsHeavy: 'https://www.marvelrivals.com/pc/gw/20240301101352//css/RefrigeratorDeluxeHeavy_8349567.ttf',
    // MRBody: 'https://www.marvelrivals.com/pc/gw/20241128194803/font/NunitoSans10ptCondensedMedium_a1bedac6.ttf'
}

function getLocalAssetAsBuffer(filePath: string) {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    return fs.readFileSync(fullPath);
}
function getLocalAssetAsBase64(file: string|Buffer, mime: string) {
    const buffer = file instanceof Buffer ? file : getLocalAssetAsBuffer(file as string);
    const base64 = buffer.toString('base64');
    return `data:${mime};base64,${base64}`;
}

async function applyColorToImage(buffer: Buffer, color: sharp.Colour, blend: sharp.Blend = 'atop') {
    // create a "colour filter" - a solid block of the target colour matched to the input image's dimensions.
    const { width, height } = await sharp(buffer).metadata();
    const colorBlock = await sharp({
        create: {
            width,
            height,
            channels: 3, // alpha is applied later
            background: color,
        }
    })
    .png() // convert to a standard format for processing
    .toBuffer();

    const originalAlphaBuffer = await sharp(buffer)
        .ensureAlpha()
        .extractChannel('alpha')
        .raw()
        .toBuffer();

    // use the colour block as a 'tint' layer and composite it.
    // 'dest-in' keeps the original alpha channel, applying the color block only where the source
    // image was not transparent.
    const coloredStickerBuffer = await sharp(colorBlock)
        // Glue the perfect original transparency container on
        .joinChannel(originalAlphaBuffer, { raw: { width, height, channels: 1 } })
        .png()
        .toBuffer();

    return await sharp(buffer)
        .composite([{
            input: coloredStickerBuffer,
            blend
        }])
        .png()
        .toBuffer();
}
async function combineImages(images: Buffer[], width?: number, height?: number, positions?: [number, number][]) {
    if (!images.length)
        return null;

    const { width: iWidth, height: iHeight } = await sharp(images[0]).metadata();

    // create a transparent base image to composite onto
    const finalBase = sharp({
        create: {
            width: width ?? iWidth,
            height: height ?? iHeight,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 } // Completely transparent
        }
    });

    // define how each processed image is laid out
    const layers = images.map((processedFile, idx) => ({
        input: processedFile,
        gravity: !!positions ? undefined : 'centre', // place each one in the center
        top: positions?.[idx]?.[1],
        left: positions?.[idx]?.[0]
    }));

    // composite all layers together
    const result = await finalBase
        .composite(layers)
        .png()
        .toBuffer()

    return result;
}

async function createPrestigeBackground(color: string, logo: string) {
    const LEFT = '/img/tex/mask/prestige-left.png';
    const CENTER = '/img/tex/mask/prestige-bg-pattern.webp';
    const RIGHT = '/img/tex/mask/prestige-right.png';

    const leftImage = getLocalAssetAsBuffer(LEFT);
    const leftColoured = await applyColorToImage(leftImage, changeColor(color, 30));

    const centerImage = getLocalAssetAsBuffer(CENTER);
    const centerColoured = await applyColorToImage(centerImage, changeColor(color, 10), 'multiply');

    const rightImage = getLocalAssetAsBuffer(RIGHT);
    const rightColoured = await applyColorToImage(rightImage, changeColor(color, -30));

    const logoImage = getLocalAssetAsBuffer(logo);
    const logoImageColoured = await applyColorToImage(logoImage, changeColor(color, 70));

    return await combineImages(
        [ centerColoured, leftColoured, rightColoured, logoImageColoured ],
        undefined, undefined,
        [
            [0,0],
            [0,0],
            [0,0],
            [Math.ceil(971 / 2) - 300 + 50, 0]
        ]
    );
}

async function createPrestigeHeroImage(heroImagePath: string) {
    const heroImage = getLocalAssetAsBuffer(heroImagePath);
    const white = await applyColorToImage(heroImage, '#ffffff');
    const yellow = await applyColorToImage(heroImage, '#fbdc2c');

    return await combineImages(
        [ white, yellow, heroImage ],
        undefined, undefined,
        [
            [-40, 0],
            [-20, 0],
            [0, 0]
        ]
    );
}

async function maskImage(base: Buffer, mask: Buffer) {
    const maskedBuffer = await sharp(base)
        .composite([{ input: mask, blend: 'dest-in' }])
        .png() 
        .toBuffer();

    return maskedBuffer;
}

export async function generateSeoImage(heroId: string) {
    const hero = HERO_LIST.find(h => h.id == heroId);

    if (!hero)
        throw new Error(`Hero [${heroId}] not found`);

    const bgImage = getLocalAssetAsBase64('/img/seo/og-image-heroes-empty.png', 'image/png');

    const prestigeBg = await createPrestigeBackground(hero.color, hero.dataDir + 'logo.webp');
    if (!prestigeBg)
        throw new Error(`Could not generate prestige background`);
    const prestigeBgBase64 = getLocalAssetAsBase64(prestigeBg, 'image/png');

    const prestigeImage = await createPrestigeHeroImage(hero.dataDir + 'prestige.webp');
    if (!prestigeImage)
        throw new Error(`Could not generate prestige image`);

    const prestigeMask = getLocalAssetAsBuffer('/img/tex/mask/hero-prestige-seo.png');
    const maskedPrestigeImage = await maskImage(prestigeImage, prestigeMask);
    const maskedPrestigeImageBase64 = getLocalAssetAsBase64(maskedPrestigeImage, 'image/png');


    const fetchPromises = objectEntries(FONTS).map(async ([name, src]) => {
        try {
            const res = await fetch(src);
            if (!res.ok) throw new Error();
            
            // key-value tuple that Object.fromEntries can read
            return [name, await res.arrayBuffer()] as const; 
        }
        catch {
            throw new Error(`Font acquisition failed for ${name}`);
        }
    });

    // await all fetches in parallel, then build the object in one shot
    const fontEntries = await Promise.all(fetchPromises);
    const fonts = Object.fromEntries(fontEntries) as Record<keyof typeof FONTS, ArrayBuffer>;

    // dynamic name font size to not go out of bounds
    const nameSplit = hero.name.split(' ');
    const smaller = nameSplit.some(c => c.length > 13) || (hero.name.length / 13) > 2
    const nameFontSize = smaller ? '90px' : '120px';

    const svg = await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: '100%',
                    height: '100%',
                    
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    color: '#f5edd8',
                    
                    fontFamily: 'MarvelRivalsHeavy',
                },
                children: [
                    // LEFT CONTAINER
                    {
                        type: 'div',
                        props: {
                            style: {
                                position: 'relative',
                                width: '35%',
                                height: '100%',

                                display: 'flex'
                            },
                            children: [
                                // PRESTIGE BG
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',

                                            backgroundImage: `url(${prestigeBgBase64})`,
                                            backgroundSize: 'auto 100%',
                                            backgroundPosition: '-50px 0',
                                            backgroundRepeat: 'no-repeat',
                                        }
                                    }
                                },
                                // PRESTIGE IMAGE
                                {
                                    type: 'img',
                                    props: {
                                        style: {
                                            position: 'absolute',
                                            left: '-50px',
                                            bottom: '-20px',
                                            
                                            height: '80%',
                                        },
                                        src: maskedPrestigeImageBase64,
                                    }
                                }
                            ]    
                        }
                    },
                    // RIGHT CONTAINER
                    {
                        type: 'div',
                        props: {
                            style: {
                                width: '65%',
                                height: '100%',

                                padding: '180px 40px 40px 40px',

                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            },

                            children: [
                                {
                                    type: 'h1',
                                    props: {
                                        style: {
                                            fontFamily: 'MarvelRivalsHeavy',
                                            fontSize: nameFontSize,
                                            textAlign: 'center',
                                            textTransform: 'uppercase',
                                            lineHeight: '0.95',
                                            color: '#fbdc2c',

                                            textShadow: '0 -10px 0 #1d1f37'
                                        },

                                        children: hero.name
                                    }
                                },
                                {
                                    type: 'p',
                                    props: {
                                        style: {
                                            fontFamily: 'MarvelRivalsHeavy',
                                            fontSize: '34px',
                                            textAlign: 'center',
                                            color: '#c0c1cc',
                                        },

                                        children: `View all proficiency rewards, see time estimates to reach set goals, and plan your grind for ${hero.name} in Marvel Rivals.`
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            width: 1200,
            height: 630,
            fonts: Object.entries(fonts).map(([name, font]) => ({ name, data: font }))
        }
    );

    const webp = await sharp(Buffer.from(svg)).webp({ quality: 85 }).toBuffer();

    return webp;
}