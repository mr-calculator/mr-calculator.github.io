<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <p v-if="message" class="modal-subtitle" v-html="message" />
        <UiSeparator class="separator" />
    
        <FormAdvancedInput
            :input-placeholder="inputPlaceholder"

            v-model="inputModel"
        />

        <div class="checkbox">
            <FormCheckbox v-model="showOwnerModel" color-scheme="dark">
                <div class="text">
                    Include my name <i>({{ profile.name }})</i>
                </div>
            </FormCheckbox>
        </div>

        <div class="buttons">
            <FormButton size="small" @click="$emit('confirm', { title: inputModel, showOwner: showOwnerModel })">
                Confirm
            </FormButton>
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Cancel</FormButton>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.modal
    .checkbox
        padding: 0 20px

        .text
            +media-mobile
                font-size: 18px
</style>

<script setup lang="ts">
import { DEFAULT_PROFILE_STORE, ProfileStoreSchema } from '~/assets/data/common';

const props = defineProps<{
    title: string,
    message?: string,
    inputPlaceholder: string,
    inputValue?: string,
    showOwner?: boolean
}>();

const emit = defineEmits(['confirm', 'cancel']);

const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);

const inputModel = ref(props.inputValue ?? '');
const showOwnerModel = ref(typeof props.showOwner === 'undefined' ? true : props.showOwner);

const input = ref<HTMLInputElement|null>(null);

onMounted(() => {
    input.value?.focus();
});

useEvent('keydown', (e: KeyboardEvent) => {
    if (e.code !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey)
        return;

    emit('confirm', { title: inputModel.value, showOwner: showOwnerModel.value });
});

</script>