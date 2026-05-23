import type { WatchHandle } from "vue";
import type z from "zod";

const state: Record<string, Ref<any>> = {};
const watchers: Record<string, WatchHandle> = {};

export function useLocalStorage<T>(
    key: string | Ref<string> | (() => string),
    defaultValue: T,
    schema?: z.ZodType<T>
) {
    if (!import.meta.client) {
        return ref(defaultValue) as Ref<T>;
    }

    const resolvedKey = isRef(key) ? key : typeof key === 'function' ? computed(key) : ref(key);

    function ensureKey(k: string) {
        if (!state[k]) {
            const saved = localStorage.getItem(k);
            if (saved) {
                const parsed = JSON.parse(saved);
                state[k] = ref(schema ? schema.parse(parsed) : parsed);
            } else {
                state[k] = ref(defaultValue);
            }

            watchers[k]?.stop();
            watchers[k] = watch(state[k]!, (val) => {
                localStorage.setItem(k, JSON.stringify(extractRawValue(val)));
            }, { deep: true });
        }
    }

    ensureKey(resolvedKey.value);

    const result = computed({
        get: () => state[resolvedKey.value]!.value as T,
        set: (val) => {
            ensureKey(resolvedKey.value);
            state[resolvedKey.value]!.value = val;
        }
    });

    watch(resolvedKey, (newKey) => {
        ensureKey(newKey);
    });

    return result as unknown as Ref<T>;
}

export function resetLocalStorageCache() {
    Object.entries(state).forEach(([key, _ref]) => {
        const saved = localStorage.getItem(key);
        if (saved)
            state[key]!.value = JSON.parse(saved);
    });
}

export function changeLocalStorageKey(currentKey: string, newKey: string) {
    if (!state[currentKey])
        return false;

    watchers[currentKey]?.stop();
    delete watchers[currentKey];

    const currentRef = state[currentKey];
    delete state[currentKey];

    state[newKey] = currentRef!;

    localStorage.removeItem(currentKey);
    localStorage.setItem(newKey, JSON.stringify(extractRawValue(currentRef)));

    watchers[newKey] = watch(state[newKey]!, (val) => {
        localStorage.setItem(newKey, JSON.stringify(extractRawValue(val)));
    }, { deep: true });
}

export function deleteFromLocalStorage(key: string) {
    delete state[key];
    watchers[key]?.stop();
    delete watchers[key];

    localStorage.removeItem(key);
}