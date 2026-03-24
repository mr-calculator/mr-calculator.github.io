<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <UiSeparator class="separator" />
        
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
import type { HeroData } from '~/assets/data/common';

const props = defineProps<{
    title: string,
    hero: HeroData,
    showAllLevels?: boolean,
    currentLevel?: number
}>();

const selectedLevel = ref(props.currentLevel ?? undefined);

onMounted(() => {
    setTimeout(() => {
        const selectedItemId = `${btoa(props.title)}__level_${selectedLevel.value}`;
        const selectedItem = document.getElementById(selectedItemId);
        selectedItem?.scrollIntoView();
    }, 100);
});

</script>