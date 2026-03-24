import type _ScrollTrigger from 'gsap/ScrollTrigger';
import type _SplitText from 'gsap/SplitText';

interface CallbackParams { gsap: GSAP, scrollTrigger: typeof _ScrollTrigger, splitText: typeof _SplitText };
type Callback = (params: CallbackParams) => void;

export async function useGsap(callback: Callback) {
    let scrollTrigger: typeof _ScrollTrigger;
    onMounted(async () => {
        const { gsap } = await import('gsap');
        scrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
        const { SplitText } = await import('gsap/SplitText')
        
        gsap!.registerPlugin(scrollTrigger);
        gsap!.registerPlugin(SplitText);

        callback({ gsap, scrollTrigger, splitText: SplitText });
    });

    onUnmounted(() => scrollTrigger?.getAll()?.forEach((t: any) => t?.kill()));
}