const state: Record<string, Ref<any>> = {};

export function useLocalStorage<T>(key: string, defaultValue: T) {
    // const state = ref(defaultValue) as Ref<T>

    if (!import.meta.client) {
        return ref(defaultValue) as Ref<T>;
    }

    if (!state[key]) {
        const saved = localStorage.getItem(key)
        if (saved)
            state[key] = ref(JSON.parse(saved))
        else
            state[key] = ref(defaultValue);
    }

    watch(state[key], (val) => {
        localStorage.setItem(key, JSON.stringify(val))
    }, { deep: true })

    return state[key] as Ref<T>;
}

export function resetLocalStorageCache() {
    Object.entries(state).forEach(([key, _ref]) => {
        const saved = localStorage.getItem(key)
        if (saved)
            state[key]!.value = JSON.parse(saved);

        // if it wasn't saved, it means the default value was never modified,
        // ergo we don't need to do anything
    });
}