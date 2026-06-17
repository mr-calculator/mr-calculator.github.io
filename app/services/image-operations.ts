import type { HeroData } from "~/assets/data/common";

const DB_NAME = 'local-images';
const DB_VERSION = 1;

export type HeroImages = {
    // commented entries are unused or unnecessary
    // 'bust'?: Blob|null,
    'bust-champion'?: Blob|null,
    // 'bust-lord'?: Blob|null,
    'full-body'?: Blob|null,
    'head'?: Blob|null,
    'head-lord'?: Blob|null,
    'portrait'?: Blob|null,
    'prestige'?: Blob|null,
    'silhouette'?: Blob|null,
    'logo'?: Blob|null,
    'story'?: Blob|null,

    'fantastic-nameplate'?: Blob|null,
    'uncanny-nameplate'?: Blob|null,
    'amazing-nameplate'?: Blob|null,
    'immortal-nameplate'?: Blob|null,

    'ko-1'?: Blob|null,
    'ko-2'?: Blob|null,

    'spray'?: Blob|null,
}

export const HERO_IMAGES: Record<keyof HeroImages, { name: string, description?: string }> = {
    'full-body': {
        name: 'Full Body',
        description: 'Size: 684x684 (1:1)'
    },
    'head': {
        name: 'Head',
        description: 'Aspect: 1:1'
    },
    'head-lord': {
        name: 'Head Lord',
        description: 'Aspect: 1:1'
    },
    'bust-champion': {
        name: 'Bust Champion',
        description: 'A 3600x4000 sprite sheet with 6 columns and 10 rows.'
    },
    'portrait': {
        name: 'Portrait',
        description: 'A cutout of the full body (684x684) that goes from left: 201, top: 41; with a width of 295 and height of 556.'
    },
    'prestige': {
        name: 'Prestige',
        description: 'Size: 1200x1356'
    },
    'silhouette': {
        name: 'Silhouette',
        description: 'Aspect: 1:1'
    },
    'logo': {
        name: 'Logo',
        description: 'Aspect: 1:1'
    },
    'story': {
        name: 'Story',
        description: 'Size: 344x120'
    },

    'fantastic-nameplate': {
        name: 'Fantastic Nameplate'
    },
    'uncanny-nameplate': {
        name: 'Uncanny Nameplate'
    },
    'amazing-nameplate': {
        name: 'Amazing Nameplate'
    },
    'immortal-nameplate': {
        name: 'Immortal Nameplate'
    },

    'ko-1': {
        name: 'KO I'
    },
    'ko-2': {
        name: 'KO II'
    },

    'spray': {
        name: 'Spray'
    },
}

export async function getAllHeroImages(hero: HeroData): Promise<HeroImages> {
    const images = await Promise.all(Object.keys(HERO_IMAGES).map(key => loadImage(hero.id, key as keyof HeroImages)));

    return Object.fromEntries(
        Object.keys(HERO_IMAGES).map((key, idx) => [key, images[idx]]).filter(([_, blob]) => !!blob)
    );
}

// fixed, known set of stores, one per image type
let _imageStores: string[] | null = null;
function getImageStores(): string[] {
    if (!_imageStores)
        _imageStores = Object.keys(HERO_IMAGES);
    return _imageStores;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = () => {
            const db = req.result;
            getImageStores().forEach(store => {
                if (!db.objectStoreNames.contains(store))
                    db.createObjectStore(store);
            });
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });

    return dbPromise;
}

// heroId stays arg 1, key (image type) stays arg 2, same call signature as before
export async function saveImage(heroId: string, key: keyof HeroImages, blob: Blob): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(key, 'readwrite');
            tx.objectStore(key).put(blob, heroId);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        }
        catch (e) {
            reject(e);
        }
    });
}

export async function loadImage(heroId: string, key: keyof HeroImages): Promise<Blob | null> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(key, 'readonly');
            const req = tx.objectStore(key).get(heroId);
            req.onsuccess = () => resolve(req.result ?? null);
            req.onerror = () => resolve(null);
        }
        catch {
            resolve(null);
        }
    });
}

export async function deleteImage(heroId: string, key: keyof HeroImages): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(key, 'readwrite');
            tx.objectStore(key).delete(heroId);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        }
        catch(e) {
            reject(e);
        }
    });
}

export async function getImageDimensions(blob: Blob) {
  // Create an ImageBitmap from the blob
  const bitmap = await createImageBitmap(blob);
  
  const width = bitmap.width;
  const height = bitmap.height;
  
  // Always close the bitmap to free up memory
  bitmap.close(); 
  
  return { width, height };
}