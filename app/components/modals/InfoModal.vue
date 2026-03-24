<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <p v-if="message" v-html="message" />
        
        <div v-if="!noButton" class="buttons">
            <FormButton type="primary" @click="confirm">
                Okay
            </FormButton>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['title', 'message', 'noButton', 'action'])

const emit = defineEmits(['confirm']);

function confirm() {
    props.action?.();
    
    emit('confirm', true);
}
</script>