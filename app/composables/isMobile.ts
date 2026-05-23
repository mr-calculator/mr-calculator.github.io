export const isMobile = (width = 992) => {
    const mobile = ref((window?.innerWidth ?? 993) < width);

    function checkMobile() {
        mobile.value = (window?.innerWidth ?? 993) < width;
    }

    const instance = getCurrentInstance();
    if (instance) {
        if (instance.isMounted && !instance.isUnmounted)
            checkMobile();
        else
            onMounted(() => {
                checkMobile();
            });
    }
    else
        checkMobile();

    useEvent('resize', checkMobile);

    return mobile;
}