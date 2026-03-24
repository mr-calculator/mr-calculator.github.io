import { DEFAULT_HERO_STORE, type HeroData, type PlayerHeroStore } from "~/assets/data/common";

export const useHasAvgStats = (heroReactive: MaybeRefOrGetter<HeroData>, ignoreGeneric = false) => {
    return computed(() => {
        const hero = toValue(heroReactive);

        const storedLevel = useLocalStorage<PlayerHeroStore>(
            `hero_${hero.id}`, DEFAULT_HERO_STORE()
        );
        const neededStats: string[] = hero.ranks[0]?.challenges.map(c => c.type) as string[] || [];

        if (storedLevel.value.usesGenericStats && !ignoreGeneric)
            return true;

        const stats = storedLevel.value.averageStats;
        return neededStats.every(s => {
            if (s === 'play')
                return true

            return !!stats[s]
        });
    });
}