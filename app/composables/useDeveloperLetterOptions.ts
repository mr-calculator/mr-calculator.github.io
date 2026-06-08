const options = ref<{
    overrideDisplay?: boolean
}>({});

export const useDeveloperLetterOptions = () => {
    return {
        options,
        setDisplay(display: boolean|undefined) {
            options.value.overrideDisplay = display;
        }
    }
}