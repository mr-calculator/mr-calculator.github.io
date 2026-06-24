let dbPromise: Promise<IDBDatabase> | null = null;

const DB_NAME = 'costume-local-images';

function openCostumeImagesDb() {
    if (dbPromise)
        return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);

        req.onupgradeneeded = () => {
            const db = req.result;
            db.createObjectStore('costumes');
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });

    return dbPromise;
}

export async function saveCostumeImage(uuid: string, blob: Blob): Promise<void> {
    const db = await openCostumeImagesDb();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('costumes', 'readwrite');
            tx.objectStore('costumes').put(blob, uuid);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        }
        catch (e) {
            reject(e);
        }
    });
}

export async function loadCostumeImage(uuid: string): Promise<Blob | null> {
    const db = await openCostumeImagesDb();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('costumes', 'readonly');
            const req = tx.objectStore('costumes').get(uuid);
            req.onsuccess = () => resolve(req.result ?? null);
            req.onerror = () => resolve(null);
        }
        catch {
            resolve(null);
        }
    });
}

export async function deleteCostumeImage(uuid: string): Promise<void> {
    const db = await openCostumeImagesDb();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('costumes', 'readwrite');
            tx.objectStore('costumes').delete(uuid);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        }
        catch(e) {
            reject(e);
        }
    });
}