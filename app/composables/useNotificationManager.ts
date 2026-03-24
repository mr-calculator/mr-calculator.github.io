import type { TexProps } from "~/components/Tex.vue";

export interface NotificationData {
    id: string
    icon?: TexProps,
    message: string,
    closeTask: number,
    onClose?: () => void
}

const notifications = ref<NotificationData[]>([])

function checkSsr() {
    if (import.meta.server)
        throw new Error('Cannot open notifications in SSR!');
}

export function useNotificationManager() {
    const notify = (
        message: string,
        time: number = 5000,
        icon?: TexProps,
        onClose?: NotificationData['onClose']
    ) => {
        checkSsr();

        const id = crypto.randomUUID()
        
        let closeTask: any = setTimeout(() => close(id), time);

        if (icon && !icon.width)
            icon.width = 30;
        if (icon && !icon.height)
            icon.height = 30;

        notifications.value.push({
            id,
            message,
            icon,
            closeTask,
            onClose
        })

        return id
    }

    const close = (id: string) => {
        const index = notifications.value.findIndex((m) => m.id === id)
        if (index !== -1) {
            const notification = notifications.value[index]
            notification?.onClose?.()
            notifications.value.splice(index, 1)
        }
    }

    return {
        notifications,
        notify,
        close,
    }
}
