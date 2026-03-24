<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <p v-if="message" class="modal-subtitle" v-html="message" />
        <UiSeparator class="separator" />
    
        <FormAdvancedInput
            :input-placeholder="inputPlaceholder"
            :input-props="inputProps"
            :number-input="numberInput"

            v-model="inputModel"
        />

        <div class="buttons">
            <FormButton size="small" @click="$emit('confirm', inputModel)">
                Confirm
            </FormButton>
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Cancel</FormButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string,
    message: string,
    inputPlaceholder: string,
    inputValue: string,
    inputProps?: any,
    numberInput?: {
        step?: number
        min?: number
        max?: number
    },
}>();
const inputModel = ref(typeof props.inputValue === 'undefined' ? '' : props.inputValue);

const input = ref<HTMLInputElement|null>(null);

onMounted(() => {
    input.value?.focus();
});


</script>