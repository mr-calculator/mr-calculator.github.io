<template>
    <div>
        <NuxtLoadingIndicator color="#fbdc2c" />
        <NuxtLayout :name="appLayout">
            <NuxtPage />
        </NuxtLayout>

        <ClientOnly>
            <ModalsDevloperLetter />

            <UiModalsInjector />
            <UiNotificationsInjector />
            <UiTooltipInjector />
        </ClientOnly>
    </div>
</template>

<style src="@/assets/style/components/notifications.sass"></style>

<script setup lang="ts">
import { updateUnknownHeroes, setupProfile } from './assets/data/common';
import { injectTexturesCss } from './assets/data/textures';

const route = useRoute();
const appLayout = computed(() => route.meta.layout ?? 'default');

injectTexturesCss();

onMounted(() => {
    setupProfile();
    updateUnknownHeroes();
});
</script>