import satori from 'satori';
import z from 'zod';
import { LATEST_SEASON_NO } from '~/assets/data/common';

const FONTS = {
    // MarvelRivals: 'https://db.onlinewebfonts.com/t/deff549f5c443598a8380e1f91055c01.ttf',
    MarvelRivalsBold: 'https://www.marvelrivals.com/pc/gw/20241128194803/font/RefrigeratorDeluxeBold_30fce753.ttf',
    MarvelRivalsHeavy: 'https://www.marvelrivals.com/pc/gw/20240301101352//css/RefrigeratorDeluxeHeavy_8349567.ttf',
    MRBody: 'https://www.marvelrivals.com/pc/gw/20241128194803/font/NunitoSans10ptCondensedMedium_a1bedac6.ttf',
}

async function getFonts() {
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
    return Object.fromEntries(fontEntries) as Record<keyof typeof FONTS, ArrayBuffer>;
}

async function webpToBase64Png(url: string): Promise<string> {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d')!.drawImage(img, 0, 0);

    return canvas.toDataURL('image/png');
}

async function toBase64(url: string, mime: string) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const base64 = base64ArrayBuffer(buffer);
    return `data:${mime};base64,${base64}`
}

async function textToBase64Image(
    text: string,
    font: string,
    color: string = '#ffffff',
    scale: number = 2
): Promise<{ base64: string, width: number, height: number }> {
    await document.fonts.load(font);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    ctx.font = font;
    const measured = ctx.measureText(text);
    const width = Math.ceil(measured.width);
    const height = Math.ceil(measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent);

    // render at higher resolution
    canvas.width = width * scale;
    canvas.height = height * scale;

    ctx.scale(scale, scale);
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, 0, measured.actualBoundingBoxAscent);

    return {
        base64: canvas.toDataURL('image/png'),
        width,   // report original dimensions to Satori
        height
    };
}

async function applyMaskCanvas(imageBase64: string, maskBase64: string): Promise<string> {
    const [img, mask] = await Promise.all([
        loadImage(imageBase64),
        loadImage(maskBase64)
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;

    // draw the image
    ctx.drawImage(img, 0, 0);

    // apply mask — 'destination-in' keeps pixels where mask is opaque
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}



const resourceCache: Record<string, any> = {};
async function useCache<T>(key: string, getter: () => Promise<T>): Promise<T> {
    if (resourceCache[key])
        return resourceCache[key] as T;

    const resource = await getter();
    resourceCache[key] = resource;

    return resource;
}

export function clearProfileSheetCache() {
    Object.keys(resourceCache).forEach(k => delete resourceCache[k]);
}

const CALCULATOR_LOGO = '/img/icons/logo-large.webp';
const BACKGROUND = '/img/tex/bg/page-bg.png';
const SEASON_BANNER = `/img/season-banners/season_${LATEST_SEASON_NO}.png`;
const NAMEPLATE_BG = '/img/tex/bg/profile-header-bg.png';
const HERO_IMG_MASK = '/img/tex/mask/hero-display.png';
const PLAYER_LEVEL_BG = '/img/tex/ui/player-level-background.png';

const PROFICIENCY_ICON = '/img/tex/icon/proficiency-gray.png';
const LORD_ICON = '/img/tex/ui/ranks/lord-badge-gray.png';
const CHAMP_ICON = '/img/tex/ui/ranks/champion-badge-gray.png';

const ACHIEVEMENT_ICON = '/img/tex/icon/career-achievements-gray.png';
const SKIN_ICON = '/img/tex/icon/skin-gray.png';

export type ProfileSheetData = {
    profile: {
        name: string,
        level: number,
        selectedHeroImageUrl: string,
        iconUrl: string,
        frameUrl?: string,

        highestRank: {
            iconUrl: string,
            iconBgUrl: string,
            name: string,
            level: number,
            heroName: string
        }
    },
    heroes: {
        name: string,
        iconUrl: string,
        levels: number,
        rankName: string,
    }[],
    proficiency: {
        points: number,
        lords: number,
        champions: number,
    },
    other: {
        achievements: number,
        costumes: number
    }
}

export async function generateProfileSheet(data: ProfileSheetData): Promise<Blob> {
    const [
        fonts, background, logo, seasonBanner,

        nameplateBg, heroImgMask, playerLvlBg, proficiencyIcon, lordIcon,
        champIcon, achievementIcon, skinIcon,

        selectedHeroImage,
        icon,
        frame,
        highestRankIcon,
        highestRankIconBg,

        ...heroIcons
    ] = await Promise.all([
        useCache('fonts', () => getFonts()),
        useCache('background', () => toBase64(BACKGROUND, 'image/png')),
        useCache('calc_logo', () => webpToBase64Png(CALCULATOR_LOGO)),
        useCache('season_banner', () => toBase64(SEASON_BANNER, 'image/png')),

        useCache('nameplate_bg', () => toBase64(NAMEPLATE_BG, 'image/png')),
        useCache('hero_img_mask', () => toBase64(HERO_IMG_MASK, 'image/png')),
        useCache('player_level_bg', () => toBase64(PLAYER_LEVEL_BG, 'image/png')),
        useCache('prof_icon', () => toBase64(PROFICIENCY_ICON, 'image/png')),
        useCache('lord_icon', () => toBase64(LORD_ICON, 'image/png')),
        useCache('champ_icon', () => toBase64(CHAMP_ICON, 'image/png')),
        useCache('achievement_icon', () => toBase64(ACHIEVEMENT_ICON, 'image/png')),
        useCache('skin_icon', () => toBase64(SKIN_ICON, 'image/png')),

        webpToBase64Png(data.profile.selectedHeroImageUrl),
        webpToBase64Png(data.profile.iconUrl),
        data.profile.frameUrl ? webpToBase64Png(data.profile.frameUrl) : null,
        webpToBase64Png(data.profile.highestRank.iconUrl),
        toBase64(data.profile.highestRank.iconBgUrl, 'image/png'),

        ...data.heroes.map(h => webpToBase64Png(h.iconUrl))
    ]);

    
    async function Nameplate() {
        // let the browser handle the font fallbacks (for non-ascii characters)
        const nameImage = await textToBase64Image(
            data.profile.name,
            'normal 20px MRBody, sans-serif',
            '#ffffff'
        );

        const maskedHeroImage = await applyMaskCanvas(selectedHeroImage, heroImgMask);

        return {
            // nameplate wrapper
            type: 'div',
            props: {
                style: {
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '40px',
                    width: '100%',
                    height: '380px',
                },
                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                boxSizing: 'border-box',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                
                                width: '100%',
                                height: '100px',
                                padding: '0 15px 10px 15px',
                                marginTop: '60px',

                                backgroundImage: `url(${nameplateBg})`,
                                backgroundSize: '100% 80px',
                                backgroundPosition: '0% 20px',
                                backgroundRepeat: 'no-repeat',
                            },
                            children: [
                                // profile icon
                                {
                                    type: 'div',
                                    props: {
                                        position: 'relative',
                                        style: {
                                            display: 'flex',

                                            width: '85px',
                                            height: '85px',
                                        },
                                        children: [
                                            {
                                                type: 'img',
                                                props: {
                                                    src: icon,
                                                    style: {
                                                        position: 'absolute',
                                                        top: '0',
                                                        left: '0',
                                                        width: '100%',
                                                        height: '100%',

                                                        border: '3px solid #9ea6b8'
                                                    }
                                                }
                                            },
                                            frame ?
                                            {
                                                type: 'img',
                                                props: {
                                                    src: frame,
                                                    style: {
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: '145%',
                                                        height: '145%'
                                                    }
                                                }
                                            } : undefined,
                                            {
                                                type: 'div',
                                                props: {
                                                    style: {
                                                        position: 'absolute',
                                                        bottom: '0',
                                                        left: '50%',
                                                        transform: 'translate(-50%, 50%)',
                                                        
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: '40px',
                                                        height: '20px',

                                                        backgroundImage: `url(${playerLvlBg})`,
                                                        backgroundSize: '100% 100%',
                                                        backgroundPosition: '0 0',
                                                        backgroundRepeat: 'no-repeat',

                                                        fontFamily: 'MarvelRivalsBold',
                                                        fontSize: '16px',
                                                        textAlign: 'center',
                                                        color: '#9ea6b8'
                                                    },
                                                    children: `${data.profile.level}`
                                                }
                                            }
                                        ]
                                    }
                                },

                                // name
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            padding: '8px 5px',

                                            fontFamily: 'MRBody, Arial',
                                            fontWeight: 400,

                                            background: '#525a6e'
                                        },
                                        children: [
                                            {
                                                type: 'img',
                                                props: {
                                                    src: nameImage.base64,
                                                    style: {
                                                        width: `${nameImage.width}px`,
                                                        height: `${nameImage.height}px`,
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'img',
                        props: {
                            src: logo,
                            style: {
                                width: '265px'
                            }
                        }
                    },
                    {
                        type: 'img',
                        props: {
                            src: maskedHeroImage,
                            style: {
                                position: 'absolute',
                                top: 0,
                                right: '-80px',

                                height: '480px',
                                transform: 'scale(-1, 1)',
                            }
                        }
                    }
                ]
            }
        }
    }

    function RankBanner() {
        return {
            type: 'div',
            props: {
                style: {
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    width: '230px',
                    height: '100%',

                    paddingTop: '70px',

                    backgroundImage: `url(${seasonBanner})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: '0 0',
                    backgroundRepeat: 'no-repeat',
                },

                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                position: 'relative',
                                display: 'flex',
                                width: '100%',
                                height: '180px',
                            },

                            children: [
                                {
                                    type: 'img',
                                    props: {
                                        src: highestRankIconBg,
                                        style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '65%'
                                        }
                                    }
                                },
                                {
                                    type: 'img',
                                    props: {
                                        src: highestRankIcon,
                                        style: {
                                            position: 'absolute',
                                            top: '-5px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '80%'
                                        }
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            position: 'absolute',
                                            bottom: '16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',

                                            fontFamily: 'MarvelRivalsHeavy',
                                            fontSize: '20px',
                                            textAlign: 'center',
                                            color: '#ffffff'
                                        },
                                        children: data.profile.highestRank.level
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '15px',
                                width: '100%'
                            },

                            children: [
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            fontFamily: 'MarvelRivalsHeavy',
                                            fontSize: '26px',
                                            textTransform: 'uppercase',
                                            color: '#ffffff'
                                        },
                                        children: `${data.profile.highestRank.name} LV. ${data.profile.highestRank.level}`
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            fontFamily: 'MRBody',
                                            fontSize: '18px',
                                            color: '#ffffffc2'
                                        },
                                        children: `${data.profile.highestRank.heroName}`
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    }

    function Stats() {
        function Item(image: string, supertext: string, quantity: string, quantifier?: string, subtext?: string) {
            return {
                type: 'div',
                props: {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px',
                        width: '130px',
                        marginBottom: '25px'
                    },
                    children: [
                        {
                            type: 'img',
                            props: {
                                src: image,
                                style: {
                                    width: '80px'
                                }
                            }
                        },
                        {
                            type: 'div',
                            props: {
                                style: {
                                    display: 'flex',
                                    fontFamily: 'MRBody',
                                    fontSize: '18px',
                                    textAlign: 'center',
                                    lineHeight: '1',
                                    color: '#7d84ae'
                                },
                                children: supertext
                            }
                        },
                        {
                            type: 'div',
                            props: {
                                style: {
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    gap: '5px',

                                    fontFamily: 'MarvelRivalsBold',
                                    fontSize: '18px',
                                    lineHeight: 1,
                                    textTransform: 'uppercase',
                                    color: '#434760'
                                },
                                children: [
                                    {
                                        type: 'div',
                                        props: {
                                            style: {
                                                display: 'flex',
                                                fontFamily: 'MarvelRivalsHeavy',
                                                fontSize: '40px',
                                                textTransform: 'uppercase',
                                            },
                                            children: quantity
                                        }
                                    },
                                    quantifier ? {
                                        type: 'div',
                                        props: {
                                            style: {
                                                display: 'flex',
                                                lineHeight: '26px',
                                            },
                                            children: quantifier
                                        }
                                    } : undefined,
                                ]
                            }
                        },
                        {
                            type: 'div',
                            props: {
                                style: {
                                    display: 'flex',
                                    fontFamily: 'MarvelRivalsHeavy',
                                    fontSize: '16px',
                                    textTransform: 'uppercase',
                                    color: '#434760'
                                },
                                children: subtext
                            }
                        }
                    ]
                }
            }
        }

        return {
            type: 'div',
            props: {
                style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    // justifyContent: 'space-around',
                    // alignItems: 'center',
                    gap: '10px',

                    padding: '40px 40px',
                    margin: '0 0 14px 0',

                    width: (844 - 60 - 60 - 230) + 'px',
                    height: '100% - 14px',
                    backgroundImage: 'linear-gradient(180deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.6) 100%)'
                },
                children: [
                    data.heroes.slice(0, 3).map((h, i) =>
                        Item(heroIcons[i]!, h.name, `${h.levels}`, 'LVLS', h.rankName)
                    ),

                    Item(
                        proficiencyIcon, 'Proficiency Points',
                        data.proficiency.points.toLocaleString(undefined, { maximumFractionDigits: 0 })
                    ),
                    Item(lordIcon, 'Lord+ Heroes', `${data.proficiency.lords}`),
                    Item(champIcon, 'Champion Heroes', `${data.proficiency.champions}`),

                    Item(achievementIcon, 'Achievements Unlocked', `${data.other.achievements}`),
                    Item(skinIcon, 'Costumes Owned', `${data.other.costumes}`)
                ]
            }
        }
    }

    function Footer() {
        return {
            type: 'div',
            props: {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',

                    height: '150px'
                },
                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                fontFamily: 'MarvelRivalsHeavy',
                                fontSize: '18px',
                                color: '#1f1e46'
                            },
                            children: 'Calculate exactly how long it takes to unlock every proficiency reward for any hero.'
                        }
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                fontFamily: 'MarvelRivalsHeavy',
                                fontSize: '28px',
                                color: '#1f1e46'
                            },
                            children: config.domain
                        }
                    }
                ]
            }
        }
    }

    const svg = await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',

                    padding: '10px 60px 30px 60px',

                    backgroundImage: `url(${background})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                },
                children: [
                    await Nameplate(),
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                width: '100%',
                                height: '600px',
                            },
                            children: [
                                RankBanner(),
                                Stats(),
                            ]
                        }
                    },
                    Footer()
                ]
            }
        },
        {
            width: 844,
            height: 1128,
            fonts: Object.entries(fonts).map(([name, font]) => ({ name, data: font }))
        }
    );

    return satoriToWebp(svg, 844, 1128, 2);
}

async function satoriToWebp(svg: string, width: number, height: number, scale = 2): Promise<Blob> {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;
            const ctx = canvas.getContext('2d')!;
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            canvas.toBlob(b => b ? resolve(b) : reject(), 'image/webp', 0.9);
        };

        img.onerror = reject;
        img.src = url;
    });
}