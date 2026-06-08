const LIFECYCLE_HOOKS = {
    onMounted,
    onBeforeUnmount,
    onUnmounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeMount,
} as const

type LifecycleCallbacks = Partial<
    Record<keyof typeof LIFECYCLE_HOOKS, () => void>
>

const IMMEDIATE_IF_MOUNTED = new Set<
    keyof typeof LIFECYCLE_HOOKS
>(['onMounted'])

export function useDynamicInstance(
    callbacks: LifecycleCallbacks,
) {
    const instance = getCurrentInstance()

    for (const [name, hook] of objectEntries(callbacks)) {
        if (!hook)
            continue;

        if (!instance) {
            if (name === 'onMounted')
                hook();

            continue;
        }

        if (instance.isMounted && IMMEDIATE_IF_MOUNTED.has(name))
            hook()
        else if (!instance.isMounted)
            LIFECYCLE_HOOKS[name](hook);
    }
}