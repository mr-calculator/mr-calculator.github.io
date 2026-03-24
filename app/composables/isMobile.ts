export const isMobile = () => {
    const mobile = ref(false);

    function checkMobile() {
        if (window.innerWidth < 992)
            mobile.value = true;
        else
            mobile.value = false;
    }

    onMounted(() => {
        checkMobile();
        useEvent('resize', checkMobile);
    });

    return mobile;
}