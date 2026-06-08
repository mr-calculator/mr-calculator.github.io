const deferredPrompt = ref<any>(null);

// runs immediately when the module is first imported, before any component mounts
if (import.meta.client) {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt.value = e;
    })
}

export function usePwaInstall() {
    async function install() {
        if (!deferredPrompt.value)
            return;

        deferredPrompt.value.prompt();
        const result = await deferredPrompt.value.userChoice;

        if (result.outcome === 'accepted')
            deferredPrompt.value = null;
    }

    const canInstall = computed(() => deferredPrompt.value !== null);

    return { install, canInstall }
}