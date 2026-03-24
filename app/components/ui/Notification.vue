<template>
    <div class="notification">
        <Tex
            v-if="icon"
            v-bind="icon"
        />
        <p v-html="message" />
        <Tex
            image="cross"
            hover="color"
            hover-color="var(--color)"
            clickable

            width="20px"
            height="20px"
            object-fit="contain"

            @click="$emit('close')"
        />
    </div>
</template>

<!-- <style src="@/assets/style/components/notifications.sass"></style> -->

<script setup lang="ts">
import type { TexProps } from '../Tex.vue';

defineProps<{
    icon?: TexProps,
    message: string
}>()

defineEmits(['close'])
</script>