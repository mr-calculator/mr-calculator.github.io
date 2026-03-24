export const scrollTo = (
    selector: string,
    parent: string | Element | Window | null = null
) => {
    const target = document.querySelector(selector)
    if (!target) return

    if (!parent) parent = window
    if (typeof parent === 'string')
        parent = document.querySelector(parent) ?? window

    if (parent === window) {
        const rect = target.getBoundingClientRect()

        window.scrollTo({
            top: window.scrollY + rect.top,
            behavior: 'smooth'
        })
    } else if (parent instanceof Element) {
        const parentRect = parent.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()

        parent.scrollTo({
            top: parent.scrollTop + (targetRect.top - parentRect.top),
            behavior: 'smooth'
        })
    }
}