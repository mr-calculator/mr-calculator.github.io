// composables/usePwaInstall.ts
const deferredPrompt = ref<any>(null)

export function usePwaInstall() {
    onMounted(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            deferredPrompt.value = e
        })
    })

    async function install() {
        if (!deferredPrompt.value) return
        
        deferredPrompt.value.prompt()
        const result = await deferredPrompt.value.userChoice
        
        if (result.outcome === 'accepted')
            deferredPrompt.value = null
    }

    const canInstall = computed(() => deferredPrompt.value !== null)

    return { install, canInstall }
}