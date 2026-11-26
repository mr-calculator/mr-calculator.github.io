<template>
    <div class="modal season-banner-selector">
        <div class="container">
            <h2 v-if="title" v-html="title"/>
            <p v-if="message" class="modal-subtitle" v-html="message" />
            <UiSeparator class="separator" />

            <HorizontalScrollContainer
                ref="scrollContainer"
            >
                <div class="banners">
                    <div
                        v-for="(season, index) in SEASONS"
                        class="banner"

                        :ref="el => bannerRefs[index] = el"
                    >
                        <div class="image" @click="selectedSeason = season.number">
                            <div v-if="selectedSeason == season.number" class="selected">
                                <Tex
                                    image="checkCorner"

                                    width="50px"
                                    height="50px"
                                />
                            </div>
                            <img :src="seasonToImg(season)" :alt="`${season.name} Banner`" draggable="false" />
                        </div>
                        <div class="title">
                            {{ season.name }}
                        </div>
                    </div>
                </div>
            </HorizontalScrollContainer>
        </div>

        <div class="buttons">
            <FormButton size="small" @click="$emit('confirm', selectedSeason)">
                Confirm
            </FormButton>
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Cancel</FormButton>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.season-banner-selector
    padding-top: 0

    +media-mobile
        padding-bottom: 0

    .container
        padding-top: 20px
        
        width: 100%
        mask: var(--tex-modalBackgroundMask) no-repeat
        mask-position: center 0%
        mask-size: 150% 100%

        display: flex
        flex-direction: column
        align-items: center
        gap: 10px

        +media-mobile
            padding-bottom: 85px + 10px

            +mediaIOS
                padding-bottom: calc(85px + 10px + env(safe-area-inset-bottom))

        +media-tablet
            mask-size: 120% 100%

        +media-desktop
            mask-size: 100% calc(100% + 85px + 20px + 10px)
    
    .scroll-container
        max-width: 870px
        overflow: visible

        +media-desktop
            padding-bottom: 20px

        ::v-deep(.scroll-content)
            +media-mobile
                display: flex
                flex-direction: row
                justify-content: center
                transform: none !important

        .banners
            position: relative
            display: flex
            align-items: center
            gap: 50px
            padding: 0 120px

            user-select: none

            +media-mobile
                gap: 10px
                padding: 0 20px 60px 20px

                display: grid
                grid-template-columns: 1fr 1fr
                grid-auto-rows: auto

            .banner
                display: flex
                align-items: center
                flex-direction: column
                gap: 10px

                .image
                    position: relative
                    margin-top: 20px
                    width: 200px
                    height: auto

                    cursor: pointer
                    overflow: clip

                    +media-mobile
                        width: 120px
                        height: 280px

                    .selected
                        position: absolute
                        top: 0
                        right: 0

                    img
                        width: 100%
                        height: 100%

                        object-fit: cover
                        object-position: center

                .title
                    width: 200px
                    height: auto

                    font-size: 20px
                    font-family: $font-bold
                    text-transform: uppercase
                    text-align: center
                    line-height: 100%

                    +media-mobile
                        width: 120px
</style>

<script setup lang="ts">
import { SEASONS, DEFAULT_PROFILE_STORE, ProfileStoreSchema, seasonToImg } from '~/assets/data/common';
import HorizontalScrollContainer from '../panel/HorizontalScrollContainer.vue';

const props = defineProps<{
    title: string,
    message?: string,
}>();

const emit = defineEmits(['confirm', 'cancel']);
const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);
const selectedSeason = ref(profile.value.selectedSeasonBanner);

const bannerRefs = ref<(Element|ComponentPublicInstance|null)[]>([]);



useEvent('keydown', (e: KeyboardEvent) => {
    if (e.code !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey)
        return;

    emit('confirm', selectedSeason.value);
});

</script>