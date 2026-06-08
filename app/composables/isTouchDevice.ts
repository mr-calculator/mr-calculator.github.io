export const isTouchDevice = () => {
    const touch = ref(hasTouch());

    useDynamicInstance({
        onMounted: () => touch.value = hasTouch()
    });

    useEvent('resize', () => touch.value = hasTouch());

    return touch;
}