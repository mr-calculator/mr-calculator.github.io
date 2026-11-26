<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <p v-if="message" class="modal-subtitle" v-html="message" />
        <UiSeparator class="separator" />
    
        <label>Name</label>
        <FormAdvancedInput
            :input-placeholder="inputPlaceholder"
            :input-props="inputProps"
            :number-input="numberInput"

            v-model="nameModel"
        />

        <label>Level</label>
        <FormAdvancedInput
            input-placeholder="LVL"
            :number-input="{
                step: 10,
                min: 1,
                max: 100
            }"

            v-model="levelModel"
        />

        <div class="buttons">
            <FormButton size="small" @click="$emit('confirm', { name: nameModel, level: levelModel })">
                Confirm
            </FormButton>
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Cancel</FormButton>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.modal
    label
        display: block
        width: 100%
        max-width: 650px

        font-size: 18px

    .input-wrapper
        max-width: 650px
</style>

<script setup lang="ts">
import { DEFAULT_PROFILE_STORE, ProfileStoreSchema } from '~/assets/data/common';

const props = defineProps<{
    title: string,
    message?: string,
    inputPlaceholder: string,
    inputValue?: string,
    inputProps?: any,
    numberInput?: {
        step?: number
        min?: number
        max?: number
    },
}>();

const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);

const emit = defineEmits(['confirm', 'cancel']);

const nameModel = ref(extractRawValue(profile.value.name));
const levelModel = ref(extractRawValue(profile.value.level) + "");

const nameInput = ref<HTMLInputElement|null>(null);

onMounted(() => {
    nameInput.value?.focus();
});

useEvent('keydown', (e: KeyboardEvent) => {
    if (e.code !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey)
        return;

    emit('confirm', { name: nameModel.value, level: levelModel.value });
});

</script>