import { onUnmounted, ref, watchEffect } from 'vue';

export function useObjectURL(file: File | null) {
    const url = ref<string | null>(null);

    watchEffect(() => {
        if (file) {
            url.value = URL.createObjectURL(file);
        } else {
            url.value = null;
        }
    });

    onUnmounted(() => {
        if (url.value) URL.revokeObjectURL(url.value);
    });

    return url;
}