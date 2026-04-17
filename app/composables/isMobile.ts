export const isMobile = () => {
    const mobile = ref(window.innerWidth < 992);

    function checkMobile() {
        mobile.value = window.innerWidth < 992;
    }

    onMounted(() => {
        checkMobile();
        useEvent('resize', checkMobile);
    });

    return mobile;
}