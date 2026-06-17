<template>
    <div class="large-animated-icon-container">
        <Tex
            class="frame-bg"
            image="heroSelectFrameGold"

            width="350px"
            height="150px"
        />
        <Tex
            class="frame-right"
            image="heroSelectFrameRightGold"

            width="350px"
            height="150px"
        />
        <Tex
            class="shine"
            image="star"

            width="80px"
            height="80px"
        />
        <div class="animated-icon-wrapper">
            <UiAnimatedIcon
                class="animated-icon"
                :style="{
                    '--mask-url': `url('${iconMask ?? DEFAULT_ANIMATED_ICON_LARGE_MASK}')`
                }"
                :reward="reward"
                :size="350"
            />
        </div>
        <Tex
            class="frame-left"
            image="heroSelectFrameLeftGold"

            width="350px"
            height="150px"
        />

        <img
            class="badge"
            src="/img/common-rewards/champion-badge.webp"
            alt="Champion Icon"
            draggable="false"
        />
        <img
            v-if="heroRole"
            class="role"
            :src="ROLE_ICONS[heroRole]"
            alt="Hero Role Icon"
            draggable="false"
        >
    </div>
</template>

<style lang="sass" scoped>
.large-animated-icon-container
    position: relative
    width: 350px
    height: 150px

    z-index: 2

    .frame-bg,
    .frame-right,
    .frame-left
        position: absolute
        left: 0
        bottom: 0

        width: 350px
        height: 150px

    .shine
        position: absolute
        top: 0
        right: 0

        animation: pulsate 3s cubic-bezier(1,-0.01,0,.99) 0s infinite

        @keyframes pulsate
            0%
                opacity: 0
                filter: brightness(1) blur(0px)
                transform: rotate(0deg)
            50%
                opacity: 1
                filter: brightness(1.2) blur(1px)
                transform: rotate(90deg)
            100%
                opacity: 0
                filter: brightness(1) blur(0px)
                transform: rotate(90deg)
                

    .animated-icon-wrapper
        position: absolute
        bottom: 0
        width: 100%
        height: 200px

        overflow: clip

        .animated-icon
            position: absolute
            bottom: -85px
            left: -20px

            mask-image: var(--mask-url)
            mask-repeat: no-repeat
            mask-size: 360px 220px
            mask-position: -10px 28px

    .badge
        position: absolute
        bottom: 25px
        left: 38px
        width: 80px

        transform: translate(-50%, 50%)
        user-select: none
        -webkit-user-drag: none

    .role
        position: absolute
        top: 42px
        right: 42px
        width: 40px

        filter: invert(1)
        opacity: .64
        user-select: none
        -webkit-user-drag: none
</style>

<script setup lang="ts">
import { DEFAULT_ANIMATED_ICON_LARGE_MASK, ROLE_ICONS, type HeroData, type HeroRole, type Reward } from '~/assets/data/common';

const props = defineProps<{
    iconMask?: string,
    reward: Reward,
    heroRole?: HeroRole,
}>();
</script>