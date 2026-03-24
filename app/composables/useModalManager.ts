export interface ModalData {
    id: string
    component: any
    props?: Record<string, any>
    resolve?: (result: any) => void
    reject?: (reason: any) => void
}

const modals = ref<ModalData[]>([])

function checkSsr() {
    if (import.meta.server)
        throw new Error('Cannot open modals in SSR!');
}

export function useModalManager() {
    const openModal = <T = any>(component: any, props?: Record<string, any>) => {
        checkSsr();

        let resolve!: (value: T) => void
        let reject!: (reason?: any) => void

        const id = randomId()

        const promise = new Promise<T>((res, rej) => {
            resolve = res
            reject = rej
        })

        modals.value.push({
            id,
            component,
            props,
            resolve,
            reject,
        })
        
        return { id, promise }
    }

    const closeModal = (id: string, result?: any) => {
        const index = modals.value.findIndex((m) => m.id === id)
        if (index !== -1) {
            const modal = modals.value[index]
            modal?.resolve?.(result)
            modals.value.splice(index, 1)
        }
    }

    const cancelModal = (id: string, reason?: any) => {
        const index = modals.value.findIndex((m) => m.id === id)
        if (index !== -1) {
            const modal = modals.value[index]
            modal?.reject?.(reason)
            modals.value.splice(index, 1)
        }
    }

    const registerKeyboardEvents = () => {
        useEvent('keyup', (e: KeyboardEvent) => {
            if (e.defaultPrevented)
                return;

            const lastModal = modals.value.at(-1);
            if (!lastModal)
                return;

            if (e.key == 'Escape' && !e.shiftKey && !e.ctrlKey && !e.altKey)
                cancelModal(lastModal.id);
        });
    }

    return {
        modals,
        openModal,
        closeModal,
        cancelModal,

        registerKeyboardEvents
    }
}
