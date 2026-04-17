<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <p v-if="message" class="modal-subtitle" v-html="message" />
        <UiSeparator class="separator" />
    
        <FormPointsSlider
            class="slider"
            :hero="hero"
            show-numbers

            :model-value="parseFloat(inputModel) || 0"
            @update:model-value="inputModel = `${$event}`"
        />

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

<style lang="sass" scoped>
.modal
    .slider
        max-width: 670px
        margin-bottom: 30px

        +media-mobile
            padding-right: 20px
            padding-left: 20px
</style>

<script setup lang="ts">
import type { HeroData } from '~/assets/data/common';

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

    hero: HeroData
}>();

const emit = defineEmits(['confirm', 'cancel']);

const inputModel = ref(typeof props.inputValue === 'undefined' ? '' : props.inputValue);

const input = ref<HTMLInputElement|null>(null);

onMounted(() => {
    input.value?.focus();
});

useEvent('keydown', (e: KeyboardEvent) => {
    if (e.code !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey)
        return;

    emit('confirm', inputModel.value);
});

</script>