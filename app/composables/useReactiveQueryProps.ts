import type { WatchHandle } from "vue";

type FromQuery = string|undefined;
export type RouteConverter<T = any> = {
    from: (fromQuery: FromQuery) => T|undefined,
    to: (value: T) => string|undefined
}
export const RouteConverter: {
    none: RouteConverter<string>,
    uri: RouteConverter<string>,
    string: RouteConverter<string>,
    stringArray: RouteConverter<string[]>,
    boolean: RouteConverter<boolean>
} = {
    none: {
        from: (fromQuery) => fromQuery as string,
        to: <T>(value: T) => value,
    },
    uri: {
        from: (fromQuery) => fromQuery ? decodeURIComponent(fromQuery) : undefined,
        to: (value: string) => encodeURIComponent(value),
    },

    string: {
        from: (fromQuery) => fromQuery ? decodeURIComponent(fromQuery.replaceAll('+', ' ')) : undefined,
        to: (value: string|undefined) => value ? encodeURIComponent(value).replaceAll('%20', '+') : undefined,
    },
    stringArray: {
        from: (fromQuery) => {
            if (!fromQuery)
                return [];

            const asString = fromQuery as string;
            return asString.split(',').map(i => decodeURIComponent(i.replaceAll('+', ' '))!);
        },
        to: (value: string[]|undefined) => {
            return value?.length ? 
                value.map(v => encodeURIComponent(v)).join(',').replaceAll('%20', '+')
                :
                undefined
        }
    },
    boolean: {
        from: (fromQuery) => fromQuery ? fromQuery === '1' : undefined,
        to: (value: boolean) => value ? '1' : undefined,
    },
};

export type RouteOpt<T = any> = {
    ref: Ref<T>,
    converter: RouteConverter<T>,
    default?: T,
    debounceDelay?: number
};
export type DefineRouteOpts = Record<string, RouteOpt>;

export const useReactiveQueryProps = (routeMap: DefineRouteOpts) => {
    const instance = getCurrentInstance();
    if (!instance || instance?.isUnmounted)
        throw createError('Cannot use reactive query props outside of a component/page instance!');

    const watchers: WatchHandle[] = [];

    const route = useRoute();
    const router = useRouter();

    const rawQuery = computed(() => {
        if (import.meta.server) return {} as Record<string, string>;

        const search = route.fullPath.includes('?') ? route.fullPath.split('?')[1] : '';
        if (!search) return {} as Record<string, string>;

        return Object.fromEntries(
            search.split('&')
                .filter(part => part.includes('='))
                .map(part => {
                    const eqIndex = part.indexOf('=');
                    return [part.slice(0, eqIndex), part.slice(eqIndex + 1)];
                })
        ) as Record<string, string>;
    });

    type ActiveOpts = Record<string, any>;
    const routeOpts = computed<ActiveOpts>(() => {
        const convertedOpts: ActiveOpts = {};
        Object.entries(routeMap).forEach(([routeId, opt]) =>
            convertedOpts[routeId] = opt.converter.from(rawQuery.value[routeId]) ?? opt.default
        );

        return convertedOpts;
    })

    function watchOpts() {
        watchers.push(
            watch(routeOpts, (opts) => {
                Object.entries(opts).forEach(([routeId, converted]) =>
                    routeMap[routeId]!.ref.value = converted
                )
            }, {
                immediate: true, deep: true
            })
        );
    }

    if (!instance.isMounted)
        onMounted(watchOpts);
    else
        watchOpts();

    function routeOptWatcher<T>(newValue: T, oldValue: T) {
        if (newValue == oldValue)
            return;

        const queryBuilder: Record<string, string|undefined> = {
            ...rawQuery.value  // ← preserve existing params not in routeMap
        };

        Object.entries(routeMap).forEach(([key, { ref: reference, converter, default: defaultValue }]) => {
            if (reference.value != defaultValue)
                queryBuilder[key] = converter.to(reference.value);
            else
                delete queryBuilder[key]; // ← remove if back to default, don't leave stale param
        });

        const qs = Object.entries(queryBuilder)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}=${v}`)
            .join('&');

        router.push(`${route.path}${qs ? '?' + qs : ''}`);
    }

    Object.entries(routeMap).forEach(([_, { ref, debounceDelay }]) => {
        const delay = debounceDelay ?? 50;
        const debouncedRouteOptWatcher = useDebounceFn(routeOptWatcher, delay);
        
        watchers.push(watch(ref, debouncedRouteOptWatcher));
    });

    return () => watchers.forEach(w => w.stop());
}