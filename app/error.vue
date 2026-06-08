<template>
    <NuxtLayout name="default">
        <div class="common-page">
            <h1>
                Error {{ error.status }}
            </h1>
            <p>{{ error.message }}</p>

            <br/>
            <NuxtLink to="/">Go back Home</NuxtLink>
        </div>
        
        <ClientOnly>
            <UiModalsInjector />
            <UiNotificationsInjector />
            <UiTooltipInjector />
        </ClientOnly>
    </NuxtLayout>
</template>

<style lang="sass" scoped>
.common-page
    h1
        padding: 0 20px
    p, a
        padding: 0 20px
        font-size: 18px
        color: $light-blue
        text-align: center

    a
        text-decoration: underline

        +hover
            color: $blue
</style>

<style src="@/assets/style/main.sass"></style>
<style src="@/assets/style/fonts.css"></style>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { injectTexturesCss } from './assets/data/textures';

injectTexturesCss(true);

const props = defineProps<{ error: NuxtError }>();

console.error(props.error);
</script>