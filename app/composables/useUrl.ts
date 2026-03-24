import type { RouteLocationNormalizedLoadedGeneric } from "vue-router";

export const useUrl = (route?: RouteLocationNormalizedLoadedGeneric|null): string[] => {
    if (route === null || typeof route === 'undefined')
        route = useRoute();

    let path: string|null = null;
    if (typeof route === 'string')
        path = route as string;
    else
        path = route.fullPath;

    if (path == null)
        return [];
    
    // get rid of get vars or #
    path = path.split('?')[0] ?? '';
    path = path.split('#')[0] ?? '';

    // trim path
    path = path.replace(/^\/+/g, '');
    path = path.replace(/\/+$/g, '');

    let pathSplit = path.split('/');

    return pathSplit;
}