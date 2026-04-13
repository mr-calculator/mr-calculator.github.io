<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <UiSeparator class="separator" />
        <p v-if="message" class="modal-subtitle" v-html="message" />
        <br/>

        <div class="buttons">
            <FormButton size="small" @click="$emit('confirm', true)">
                Confirm
            </FormButton>
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Cancel</FormButton>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps(['title', 'message']);

const emit = defineEmits(['confirm', 'cancel']);

useEvent('keyup', (e: KeyboardEvent) => {
    if (e.code !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey)
        return;

    emit('confirm', true);
});
</script>