import { useRouteHistory } from '~/middleware/history.global';

export function useBackButton(options: {
    // routes that are "within" the current section — back skips all of these
    currentSection: string | string[],
    fallback: string,
}) {
    const router = useRouter();
    const history = useRouteHistory();

    const sections = Array.isArray(options.currentSection) ?
        options.currentSection : [options.currentSection];

    function isInSection(path: string) {
        return sections.some(s => path.startsWith(s));
    }

    function getBackPath(history: string[]) {
        // walk backwards through history to find first route outside current section
        for (let i = history.length - 1; i >= 0; i--) {
            if (!isInSection(history[i]!))
                return history[i]!;
        }

        return options.fallback;
    }

    function back() {
        const target = getBackPath(history.value);
        router.push(target);
    }

    const backPath = computed(() => getBackPath(history.value));

    return { back, backPath };
}