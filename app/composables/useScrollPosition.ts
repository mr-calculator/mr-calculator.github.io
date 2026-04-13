const positions: Record<string, number> = {}

export function useScrollPosition(id?: string) {
    const route = useRoute();

    const positionId = id ?? route.fullPath;

    function save() {
        positions[positionId] = window?.scrollY;
    }

    function restore() {
        const saved = positions[positionId];

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

            useGsap(({ scrollTrigger }) => {
                scrollTrigger.refresh();
            }, true);
        }, 5);
    }

    return { save, restore, positions };
}