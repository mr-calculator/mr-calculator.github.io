import type { WatchHandle } from "vue";
import type z from "zod";

export const storageState: Record<string, Ref<any>> = {};
const watchers: Record<string, WatchHandle> = {};

const persistenceScope = effectScope(true);


function deepMerge(target: any, source: any): any {
    if (typeof source !== 'object' || source === null)
        return source;
    if (typeof target !== 'object' || target === null)
        return source;

    const result = Array.isArray(target) ? [ ...target ] : { ...target };
    for (const key of Object.keys(source)) {
        result[key] = typeof source[key] === 'object'
                   && source[key] !== null
                   && !Array.isArray(source[key]) ? // this should probably be removed, since this can now handle arrays
            deepMerge(target[key], source[key]) : source[key];
    }
    return result;
}
function loadFromStorage<T>(
    saved: string,
    defaultValue: T,
    schema?: z.ZodType<T>
): T {
    try {
        const parsed = JSON.parse(saved);
        if (schema) {
            // merge saved data over defaults so missing new fields get defaults,
            // while existing saved values are preserved
            const merged = deepMerge(defaultValue as object, parsed);
            return schema.parse(merged);
        }
        return parsed;
    }
    catch {
        return defaultValue;
    }
}

export function useLocalStorage<T>(
    key: string | Ref<string> | (() => string),
    defaultValue: T,
    schema?: z.ZodType<T>,
) {
    if (!import.meta.client) {
        return ref(defaultValue) as Ref<T>;
    }

    const resolvedKey = isRef(key) ? key : typeof key === 'function' ? computed(key) : ref(key);

    function ensureKey(k: string) {
        if (!storageState[k]) {
            const saved = typeof localStorage !== 'undefined' ? 
                localStorage.getItem(k) : null;

            if (saved)
                storageState[k] = ref(
                    loadFromStorage(saved, defaultValue, schema)
                );
            else
                storageState[k] = ref(defaultValue);

            watchers[k]?.stop();
            persistenceScope.run(() => 
                watchers[k] = watch(storageState[k]!, (val) => {
                    localStorage?.setItem(k, JSON.stringify(extractRawValue(val)));
                }, { deep: true })
            );
        }
    }

    ensureKey(resolvedKey.value);

    const result = computed({
        get: () => storageState[resolvedKey.value]!.value as T,
        set: (val) => {
            ensureKey(resolvedKey.value);
            storageState[resolvedKey.value]!.value = val;
        }
    });

    watch(resolvedKey, (newKey) => {
        ensureKey(newKey);
    });

    return result as unknown as Ref<T>;
}

export function resetLocalStorageCache() {
    Object.entries(storageState).forEach(([key, _ref]) => {
        const saved = localStorage.getItem(key);
        if (saved)
            storageState[key]!.value = JSON.parse(saved);
    });
}

export function changeLocalStorageKey(currentKey: string, newKey: string) {
    if (!storageState[currentKey])
        return false;

    watchers[currentKey]?.stop();
    delete watchers[currentKey];

    const currentRef = storageState[currentKey];
    delete storageState[currentKey];

    storageState[newKey] = currentRef!;

    localStorage.removeItem(currentKey);
    localStorage.setItem(newKey, JSON.stringify(extractRawValue(currentRef)));

    watchers[newKey] = watch(storageState[newKey]!, (val) => {
        localStorage.setItem(newKey, JSON.stringify(extractRawValue(val)));
    }, { deep: true });
}

export function deleteFromLocalStorage(key: string) {
    delete storageState[key];
    watchers[key]?.stop();
    delete watchers[key];

    localStorage.removeItem(key);
}
