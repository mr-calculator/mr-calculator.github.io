import type { HeroData } from "~/assets/data/common";
import { UNKNOWN_HERO } from "~/assets/data/heroes";
import { loadHeroImage } from "~/services/hero-image-operations";

const heroImageRefs: Record<string, Ref<string>> = {};

export function useHeroImage(key: string, hero: HeroData): Ref<string> {
    // prevent heroes other than unknown heroes from being cached here
    if (!hero.id.startsWith('__unknown_')) {
        return ref(`${hero.dataDir}${key}.webp`);
    }

    const cacheKey = `${hero.id}:${key}`;

    if (heroImageRefs[cacheKey])
        return heroImageRefs[cacheKey];

    const fallback = `${hero.dataDir}${key}.webp`;
    const refImage = ref(fallback);
    heroImageRefs[cacheKey] = refImage;

    loadHeroImage(hero.id, key)
        .then(image => {
            if (image)
                refImage.value = URL.createObjectURL(image);
        })
        .catch(() => {});

    return refImage;
}

export async function useHeroImageAsync(key: string, hero: HeroData): Promise<string> {
    let image = `${hero.dataDir}${key}.webp`;

    try {
        const imageBlob = await loadHeroImage(hero.id, key);
        if (imageBlob)
            image = URL.createObjectURL(imageBlob);
    }
    catch {  }

    return image;
}

export async function revokeHeroImageCache(heroId?: string) {
    let source = Object.entries(heroImageRefs);
    if (heroId)
        source = Object.keys(heroImageRefs).filter(key => key.startsWith(heroId)).map(key => [key, heroImageRefs[key]!]);

    source.forEach(([cacheKey, urlRef]) => {
        const heroId = cacheKey.split(':')[0]!;
        const key = cacheKey.split(':')[1]!;
        URL.revokeObjectURL(urlRef.value);
        // since images can only be changed for unknown heroes, it's safe to assume this is the fallback path
        urlRef.value = `${UNKNOWN_HERO().dataDir}${key}.webp`;

        // in case an image was added (and wasn't removed), load it into the ref
        loadHeroImage(heroId, key)
            .then(image => {
                if (image)
                    urlRef.value = URL.createObjectURL(image);
            })
            .catch(() => {});
    });
}