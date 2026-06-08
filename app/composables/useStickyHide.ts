import { ref, nextTick, type ShallowRef } from 'vue'

interface StickyBarOptions {
    /** Offset from top when sticky kicks in. Pass negative value for navbar offset (e.g. -65) */
    topOffset?: number | (() => number)
    /** If true, scroll-direction show/hide only applies on mobile */
    mobileOnly?: boolean
    /** CSS class toggled when stuck */
    stickyClass?: string
    /** CSS class toggled on scroll-up to force-show */
    showClass?: string
    /** Extra scroll trigger (e.g. the "force-show" trigger in your first snippet) */
    forceShowTrigger?: {
        start: string
        showClass: string
    }
    /** Called when scrolling down while sticky — close your dropdowns here */
    onScrollDownWhileSticky?: () => void
    /** Whether to scroll the container to top on init */
    scrollToTopOnInit?: boolean
    /** Block hiding for N scroll events (your blockStickyHide pattern) */
    blockHideRef?: Ref<number>
}

export async function useStickyBar(
    elementRef: Readonly<ShallowRef<HTMLElement | null>>,
    options: StickyBarOptions = {}
) {
    const {
        topOffset = 0,
        mobileOnly = false,
        stickyClass = 'sticky',
        showClass = 'sticky-show',
        forceShowTrigger,
        onScrollDownWhileSticky,
        scrollToTopOnInit = false,
        blockHideRef,
    } = options

    const scroller = ref<Window | HTMLElement>()
    const mobile = isMobile()

    function resolveOffset() {
        return typeof topOffset === 'function' ? topOffset() : topOffset
    }

    function findScroller() {
        scroller.value = getScrollParent(elementRef.value)
        if ((scroller.value as HTMLElement).tagName === 'BODY')
            scroller.value = window
    }

    await useGsap(({ scrollTrigger }) => {
        nextTick(() => {
            findScroller()

            if (scrollToTopOnInit)
                scroller.value?.scrollTo({ top: 0, behavior: 'instant' })

            const offset = resolveOffset()
            scrollTrigger.create({
                trigger: elementRef.value,
                scroller: scroller.value,
                start: `${offset !== 0 ? `${offset}px` : '0%'} 0%`,
                onEnter: () => elementRef.value?.classList.add(stickyClass),
                onLeaveBack: () => elementRef.value?.classList.remove(stickyClass),
            })

            if (forceShowTrigger) {
                scrollTrigger.create({
                    trigger: elementRef.value,
                    scroller: scroller.value,
                    start: forceShowTrigger.start,
                    onEnter: () => elementRef.value?.classList.remove(forceShowTrigger.showClass),
                    onLeaveBack: () => elementRef.value?.classList.add(forceShowTrigger.showClass),
                })
            }
        })
    })

    let lastKnownScrollY = 0
    useEvent('scroll', () => {
        if (mobileOnly && !mobile.value) return

        if (blockHideRef && blockHideRef.value > 0) {
            blockHideRef.value--
            return
        }

        const scrollY =
            (scroller.value as HTMLElement).scrollTop ??
            (scroller.value as Window).scrollY
        const deltaY = scrollY - lastKnownScrollY
        lastKnownScrollY = scrollY

        if (deltaY > 0) {
            elementRef.value?.classList.remove(showClass)
            if (elementRef.value?.classList.contains(stickyClass))
                onScrollDownWhileSticky?.()
        } else {
            elementRef.value?.classList.add(showClass)
        }
    }, scroller.value)

    return { scroller }
}