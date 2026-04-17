<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <UiSeparator class="separator" />
        
        <div class="input-level">
            <FormAdvancedInput
                input-placeholder="Level..."
                :number-input="{
                    step: 5,
                    min: 0,
                    max: Object.values(PROFICIENCY_RANKS).at(-1)?.levelEnd ?? 70
                }"

                :model-value="`${selectedLevel}`"
                @update:model-value="selectedLevel = parseInt($event) || 0"
            />
        </div>

        <div ref="listWrapper" class="list-wrapper">
            <PanelHeroProficiencyRewardList
                :hero="hero"
                :selected-item="selectedLevel"
                :show-all-levels="showAllLevels"

                :contrast-mode="true"
                :id-prefix="title"

                @reward-click="selectedLevel = $event"
            />
        </div>

        <div class="buttons">
            <FormButton size="small" @click="$emit('confirm', selectedLevel)">
                Confirm
            </FormButton>
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Cancel</FormButton>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.input-level
    margin-bottom: 30px

.list-wrapper
    width: 100%
    max-width: 920px
    height: 100%

    padding: 0 20px

    overflow-x: hidden
    overflow-y: auto
    +scrollbar($background: transparent, $thumb: $light-blue, $active: $color)

    ::v-deep(.rewards)
        padding: 0
</style>

<script setup lang="ts">
import { PROFICIENCY_RANKS, type HeroData } from '~/assets/data/common';

const props = defineProps<{
    title: string,
    hero: HeroData,
    showAllLevels?: boolean,
    currentLevel?: number
}>();

const emit = defineEmits(['confirm', 'cancel'])

const selectedLevel = ref(props.currentLevel ?? undefined);
watch(selectedLevel, lvl => lvl ? scrollItemIntoView(lvl, true) : null);

function scrollItemIntoView(level: number, smooth?: boolean) {
    const selectedItemId = `${btoa(props.title)}__level_${level}`;
    const selectedItem = document.getElementById(selectedItemId);
    selectedItem?.scrollIntoView({
        behavior: smooth ? 'smooth' : 'instant'
    });
}

onMounted(() => {
    if (!selectedLevel.value)
        return;

    setTimeout(() => {
        if (!selectedLevel.value)
            return;

        scrollItemIntoView(selectedLevel.value);
    }, 100);
});

useEvent('keyup', (e: KeyboardEvent) => {
    if (e.code !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey)
        return;

    emit('confirm', selectedLevel.value);
});

</script>