import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger, SplitText)
}

type GsapTools = {
    gsap: typeof gsap
    scrollTrigger: typeof ScrollTrigger
    splitText: typeof SplitText
}

export function useGsap(callback: (tools: GsapTools) => void) {
    if (import.meta.server)
        return { remove: () => null };

    const triggers: InstanceType<typeof ScrollTrigger>[] = []

    const scrollTriggerProxy = new Proxy(ScrollTrigger, {
        get(target, prop, receiver) {
            if (prop === 'create')
                return (vars: Parameters<typeof ScrollTrigger.create>[0]) => {
                    const trigger = ScrollTrigger.create(vars);
                    triggers.push(trigger);
                    return trigger;
                }

            return Reflect.get(target, prop, receiver);
        }
    })

    useDynamicInstance({
        onMounted: () => callback({
            gsap,
            scrollTrigger: scrollTriggerProxy as typeof ScrollTrigger,
            splitText: SplitText
        }),
        onUnmounted: () => triggers.forEach(t => t.kill()),
    })

    return { remove: () => triggers.forEach(t => t.kill()) }
}
