import { DEFAULT_HERO_STORE, HERO_ROLES, PlayerHeroStoreSchema, type HeroData, type HeroRole, type PlayerHeroStore } from "~/assets/data/common";

export const useRolesWithAvgStats = (heroReactive: MaybeRefOrGetter<HeroData>) => {
    return computed(() => {
        const hero = toValue(heroReactive);
        
        const storedLevel = useLocalStorage<PlayerHeroStore>(
            `hero_${hero.id}`, DEFAULT_HERO_STORE(),
            PlayerHeroStoreSchema
        );
        const isMultiRole = computed(() => Array.isArray(hero.roles) && hero.roles.length > 1);

        if (!isMultiRole.value)
            return [];

        const roles: Set<HeroRole|'all-roles'> = new Set(['all-roles']);

        const sources = [
            storedLevel.value.averageStatsPerRole,
            storedLevel.value.averageStatsArcadePerRole
        ];
        sources.forEach(source => 
            Object.entries(source ?? {}).forEach(([role, stats]) => {
                if (Object.values(stats).some(s => !!s))
                    roles.add(role as HeroRole);
            })
        );
        const rolesOrder = ['all-roles', ...HERO_ROLES];

        return Array.from(roles).sort((a,b) => rolesOrder.indexOf(a) - rolesOrder.indexOf(b));
    });
}

export const useHasAvgStats = (heroReactive: MaybeRefOrGetter<HeroData>, ignoreGeneric = false, ignoreRole = false) => {
    return computed(() => {
        const hero = toValue(heroReactive);

        const storedLevel = useLocalStorage<PlayerHeroStore>(
            `hero_${hero.id}`, DEFAULT_HERO_STORE(),
            PlayerHeroStoreSchema
        );
        const neededStats: string[] = hero.ranks[0]?.challenges.map(c => c.type) as string[] || [];

        if (storedLevel.value.usesGenericStats && !ignoreGeneric)
            return true;

        const stats = storedLevel.value.averageStats;

        const hasNormalStats = neededStats.every(s => {
            if (s === 'play')
                return true;

            return !!stats[s];
        });

        const hasRoleStats = Object.entries(storedLevel.value.averageStatsPerRole ?? {})
            .some(([role, stats]) =>
                hero.ranks[0]?.challenges.map(c => c.type).every(s => {
                    if (s === 'play')
                        return true;

                    return !!stats[s];
                })
            );

        return hasNormalStats || (!ignoreRole && hasRoleStats);
    });
}

export const useHasAvgArcadeStats = (heroReactive: MaybeRefOrGetter<HeroData>) => {
    return computed(() => {
        const hero = toValue(heroReactive);

        const storedLevel = useLocalStorage<PlayerHeroStore>(
            `hero_${hero.id}`, DEFAULT_HERO_STORE(),
            PlayerHeroStoreSchema
        );
        const neededStats: string[] = hero.ranks[0]?.challenges.map(c => c.type) as string[] || [];

        const stats = storedLevel.value.averageStatsArcade;
        if (!stats)
            return false;

        const hasNormalStats = neededStats.every(s => {
            if (s === 'play')
                return true;

            return !!stats[s];
        });

        const hasRoleStatsArcade = Object.entries(storedLevel.value.averageStatsArcadePerRole ?? {})
            .some(([role, stats]) =>
                hero.ranks[0]?.challenges.map(c => c.type).every(s => {
                    if (s === 'play')
                        return true;

                    return !!stats[s];
                })
            );

        return hasNormalStats || hasRoleStatsArcade;
    });
}