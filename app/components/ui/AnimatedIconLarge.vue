<template>
    <div class="large-animated-icon-container">
        <Tex
            class="frame-bg"
            image="heroSelectFrameGold"

            width="350px"
            height="150px"
        />
        <Tex
            v-if="frame"
            class="frame-right"
            :image="frame == 'colonel' ? 'heroSelectFrameRightPurple' : 'heroSelectFrameRightGold'"

            width="350px"
            height="150px"
        />
        <Tex
            v-if="shine"
            class="shine"
            image="star"

            width="80px"
            height="80px"
        />
        <div class="animated-icon-wrapper">
            <UiAnimatedIcon
                v-if="reward.iconAnimation"
                class="animated-icon"
                :style="{
                    '--mask-url': `url('${iconMask ?? DEFAULT_ANIMATED_ICON_LARGE_MASK}')`
                }"
                :reward="reward"
                :size="350"
            />
            <img
                v-else
                class="icon"
                :src="reward.icon"
                :alt="`${reward.name} Icon`"
                draggable="false"

                :style="{
                    '--mask-url': `url('${iconMask ?? DEFAULT_ANIMATED_ICON_LARGE_MASK}')`
                }"
            />
        </div>
        <Tex
            v-if="frame"
            class="frame-left"
            :image="frame == 'colonel' ? 'heroSelectFrameLeftPurple' : 'heroSelectFrameLeftGold'"

            width="350px"
            height="150px"
        />
        <Tex
            v-else-if="badge"
            class="frame-left"
            image="heroSelectFrameForBadge"

            width="350px"
            height="150px"
        />

        <img
            v-if="badge"
            class="badge"
            :src="BADGES[badge]"
            alt="Proficiency Badge"
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

        > img
            position: absolute
            width: 350px
            height: 350px
            bottom: -85px
            left: -20px

            object-fit: contain
            object-position: 0 15px

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

type BadgeRank = 'count'|'warrior'|'guardian'|'champion';
const BADGES: Record<BadgeRank, string> = {
    count: '/img/common-rewards/count-badge.webp',
    warrior: '/img/common-rewards/warrior-badge.webp',
    guardian: '/img/common-rewards/guardian-badge.webp',
    champion: '/img/common-rewards/champion-badge.webp',
}

const props = withDefaults(defineProps<{
    iconMask?: string,
    reward: Reward,
    heroRole?: HeroRole,

    shine?: boolean,
    frame?: null|'colonel'|'elite',
    badge?: null|BadgeRank
}>(), {
    shine: true,
    frame: 'elite',
    badge: 'champion'
});
</script>