const positions: Record<string, number> = {}

export function useScrollPosition() {
    const route = useRoute();

    function save() {
        positions[route.fullPath] = window?.scrollY;
    }

    function restore() {
        const saved = positions[route.fullPath];

        if (saved === undefined)
            return;

        let maxIterations = 100;
        const task = window?.setInterval(() => {
            if (--maxIterations < 0) {
                clearInterval(task);
                return;
            }

            if (document.body.scrollHeight < saved)
                return;

            window?.scrollTo({ top: saved });
            clearInterval(task);
        }, 5);
    }

    return { save, restore };
}