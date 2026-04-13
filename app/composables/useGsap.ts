import type _ScrollTrigger from 'gsap/ScrollTrigger';
import type _SplitText from 'gsap/SplitText';

interface CallbackParams { gsap: GSAP, scrollTrigger: typeof _ScrollTrigger, splitText: typeof _SplitText };
type Callback = (params: CallbackParams) => void;

export async function useGsap(callback: Callback, outsideCycle: boolean = false) {
    let scrollTrigger: typeof _ScrollTrigger;
    async function setup() {
        const { gsap } = await import('gsap');
        scrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
        const { SplitText } = await import('gsap/SplitText')
        
        gsap!.registerPlugin(scrollTrigger);
        gsap!.registerPlugin(SplitText);

        callback({ gsap, scrollTrigger, splitText: SplitText });
    }

    if (outsideCycle)
        setup();
    else {
        onMounted(setup);
        onUnmounted(() => scrollTrigger?.getAll()?.forEach((t: any) => t?.kill()));
    }
}