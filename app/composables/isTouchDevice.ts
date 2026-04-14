export const isTouchDevice = () => {
    const touch = ref(false);

    onMounted(() => {
        touch.value = hasTouch();
        useEvent('resize', () => touch.value = hasTouch());
    });

    return touch;
}