<template>
    <div>
        <NuxtLoadingIndicator color="#fbdc2c" />
        <NuxtLayout :name="layout">
            <NuxtPage />
        </NuxtLayout>

        <Teleport to="body">
            <div v-for="modal in modals" :key="modal.id" class="modal-wrapper">
                <component
                    :is="modal.component"
                    v-bind="modal.props"
                    @confirm="(result) => closeModal(modal.id, result)"
                    @cancel="() => cancelModal(modal.id)"
                />
            </div>
            <div class="notifications-wrapper">
                <UiNotification
                    v-for="notification in notifications"
                    :icon="notification.icon"
                    :message="notification.message"
                    @close="close(notification.id)"
                />
            </div>
        </Teleport>
    </div>
</template>

<style src="@/assets/style/components/modals.sass"></style>
<style src="@/assets/style/components/notifications.sass"></style>

<script setup>
import { injectTexturesCss } from './assets/data/textures';

const { modals, closeModal, cancelModal, registerKeyboardEvents } = useModalManager();
const { notifications, close } = useNotificationManager();

const layout = ref('default');

injectTexturesCss();

registerKeyboardEvents();
</script>