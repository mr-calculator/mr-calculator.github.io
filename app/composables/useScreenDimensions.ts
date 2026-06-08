export const useScreenDimensions = () => {
    const dimensions = ref({ width: window?.innerWidth ?? 0, height: window?.innerHeight });

    function setDimensions() {
        dimensions.value = { width: window?.innerWidth ?? 0, height: window?.innerHeight };
    }

    useDynamicInstance({
        onMounted: setDimensions
    });

    useEvent('resize', setDimensions);

    return dimensions;
}