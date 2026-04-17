export const isMobile = (width = 992) => {
    const mobile = ref(window.innerWidth < width);

    function checkMobile() {
        mobile.value = window.innerWidth < width;
    }

    onMounted(() => {
        checkMobile();
        useEvent('resize', checkMobile);
    });

    return mobile;
}