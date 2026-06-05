import type { WatchHandle } from "vue";
import type z from "zod";

export const storageState: Record<string, Ref<any>> = {};
const watchers: Record<string, WatchHandle> = {};

const persistenceScope = effectScope(true);

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
                localStorage.getItem(k) : JSON.stringify(defaultValue);

            if (saved) {
                const parsed = JSON.parse(saved);
                storageState[k] = ref(schema ? schema.parse(parsed) : parsed);
            }
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
