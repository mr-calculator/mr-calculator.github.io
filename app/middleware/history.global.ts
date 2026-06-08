const routeHistory = ref<string[]>([]);

export const useRouteHistory = () => routeHistory;

export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client && from.fullPath !== to.fullPath)
        routeHistory.value.push(from.fullPath);
});