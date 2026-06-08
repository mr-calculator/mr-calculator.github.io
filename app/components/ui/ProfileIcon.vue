<template>
    <component
        :is="link ? NuxtLink : 'div'"

        class="profile-icon"

        to="/profile"
        active-class="selected"
    >
        <div class="icon-container">
            <ClientOnly>
                <img
                    class="icon"
                    :src="`/img/cosmetics/items/icons/${profile.nameplate}.webp`"
                    draggable="false"
                />
                <img
                    v-if="profile.frame"
                    class="frame"
                    :src="`/img/cosmetics/items/frames/icon/img_playerheadframe_${profile.frame}.png`"
                    draggable="false"
                />
                <div v-else class="frame" />
            </ClientOnly>
        </div>

        <div class="level-border-wrapper">
            <Tex
                class="level-border"
                image="playerLevelBackground"

                width="40px"
            />
            <ClientOnly>
                <span>{{ profile.level }}</span>
                <template #fallback>
                    —
                </template>
            </ClientOnly>
        </div>
    </component>
</template>

<style lang="sass" scoped>
.profile-icon
    display: block
    flex-shrink: 0
    
    position: relative
    width: 65px
    height: 65px

    cursor: pointer

    &:not(.selected)
        +hover
            .icon-container .icon
                transform: translate(-50%, -50%) scale(1.07)
                filter: contrast(50%) brightness(135%)

                clip-path: polygon(5% 5%, 95% 5%, 95% 95%, 5% 95%)
                

    &.selected
        .icon-container
            .frame
                filter: brightness(135%)

    .icon-container
        position: relative
        width: 100%
        height: 100%

        .frame,
        .icon
            position: absolute
            top: 50%
            left: 50%
            transform: translate(-50%, -50%)

            width: 100%
            height: 100%

            user-select: none
            -webkit-user-drag: none

        img.frame
            width: 145%
            height: 145%
        
        div.frame
            border: 3px solid #9ea6b8

    .level-border-wrapper
        position: absolute
        left: 50%
        bottom: 0
        transform: translate(-50%, 50%)

        width: 40px
        height: 22px

        display: flex
        justify-content: center
        align-items: center

        .level-border
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%

        span
            position: relative
            font-family: $font-bold
            font-size: 19px
            color: #9ea6b8

            z-index: 2
</style>

<script setup lang="ts">
import { NuxtLink } from '#components';
import { DEFAULT_PROFILE_STORE, ProfileStoreSchema } from '~/assets/data/common';

const props = withDefaults(defineProps<{
    link?: boolean
}>(), {
    link: true
});

const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);

</script>