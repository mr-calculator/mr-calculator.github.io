export const isMobile = (width = 992) => {
    const mobile = ref(993 < width);

    function checkMobile() {
        mobile.value = (window?.innerWidth ?? 993) < width;
    }

    useDynamicInstance({
        onMounted: checkMobile
    });

    useEvent('resize', checkMobile);

    return mobile;
}