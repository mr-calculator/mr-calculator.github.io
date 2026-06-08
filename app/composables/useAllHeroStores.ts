import type { PlayerHeroStore } from "~/assets/data/common";

export const useAllHeroStores = () => {
    return computed(() => {
        if (import.meta.server)
            return [];

        const storageHeroKeys = Array.from(
            { length: localStorage.length }, 
            (_, i) => localStorage.key(i)
        ).filter(k => !!k && k.startsWith('hero_')) as string[];
        const stateHeroKeys = Object.keys(storageState)
                                .filter((key) => key.startsWith('hero_'));

        const allStateHeroStores: [string, PlayerHeroStore][] = stateHeroKeys.map(key =>
            [key, storageState[key]!.value as PlayerHeroStore]
        );
        const allStorageHeroStores: [string, PlayerHeroStore][] =
            storageHeroKeys.map(key => [key, JSON.parse(localStorage[key])]
        );

        const allHeroStores = allStorageHeroStores.map(([key, value]) =>
            allStateHeroStores.find(s => s[0] == key)?.[1] ?? value
        ).filter(s => !!s);

        return allHeroStores;
    });
}