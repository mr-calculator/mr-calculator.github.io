<template>
    <div class="battle-animated-icon-container">
        <Tex
            class="bg"
            image="heroBattlePortraitBg"
            color="#000"

            width="300px"
            height="300px"
        />

        <Tex
            class="border"
            :image="frame
                ? (frame == 'colonel'
                    ? 'heroBattlePortraitBorderPurple'
                    : 'heroBattlePortraitBorderGold'
                )
                : 'heroBattlePortraitBorder'"

            width="300px"
            height="300px"
        />

        <Tex
            class="deco-left"
            :image="frame
                ? (frame == 'colonel'
                    ? 'heroBattlePortraitDecoLeftPurple'
                    : 'heroBattlePortraitDecoLeftGold'
                )
                : 'heroBattlePortraitDecoLeft'"

            width="300px"
            height="300px"
        />
        <Tex
            class="deco-right"
            :image="frame
                ? (frame == 'colonel'
                    ? 'heroBattlePortraitDecoRightPurple'
                    : 'heroBattlePortraitDecoRightGold'
                )
                : 'heroBattlePortraitDecoRight'"

            width="300px"
            height="300px"
        />

        <div class="animated-icon-wrapper">
            <UiAnimatedIcon
                v-if="reward.iconAnimation"
                class="animated-icon"
                :reward="reward"
                :size="300"
            />
            <img
                v-else
                class="icon"
                :src="reward.icon"
                :alt="`${reward.name} Icon`"
                draggable="false"
            />
        </div>

        <Tex
            v-if="badge"
            class="corner"
            :image="frame
                ? (frame == 'colonel'
                    ? 'heroBattlePortraitCornerPurple'
                    : 'heroBattlePortraitCornerGold'
                )
                : 'heroBattlePortraitCorner'"

            width="300px"
            height="300px"
        />

        <img
            v-if="badge"
            class="badge"
            :src="BADGES[badge]"
            alt="Proficiency Badge"
            draggable="false"
        />
    </div>
</template>

<style lang="sass" scoped>
.battle-animated-icon-container
    position: relative
    width: 300px
    height: 300px

    z-index: 2

    .bg,
    .border,
    .deco-right,
    .deco-left,
    .corner
        position: absolute
        left: 0
        bottom: 0

        width: 300px
        height: 300px
                

    .animated-icon-wrapper
        position: absolute
        bottom: 0
        width: 100%
        height: 100%

        mask-image: var(--tex-heroBattlePortraitMask)
        mask-repeat: no-repeat
        mask-size: 100% 100%
        mask-position: center

        overflow: clip

        .animated-icon
            position: absolute
            bottom: 20px
            left: 7px

        .icon
            position: absolute
            width: 255px
            bottom: 91px
            left: 58px

            object-fit: contain


    .badge
        position: absolute
        bottom: 110px
        left: 110px
        width: 60px

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
import { ROLE_ICONS, type HeroRole, type Reward } from '~/assets/data/common';
import { texUrl } from '~/assets/data/textures';

type BadgeRank = 'count'|'warrior'|'guardian'|'champion';
const BADGES: Record<BadgeRank, string> = {
    count: '/img/common-rewards/count-badge.webp',
    warrior: '/img/common-rewards/warrior-badge.webp',
    guardian: '/img/common-rewards/guardian-badge.webp',
    champion: '/img/common-rewards/champion-badge.webp',
}

const props = withDefaults(defineProps<{
    reward: Reward,
    heroRole?: HeroRole,

    frame?: null|'colonel'|'elite',
    badge?: null|BadgeRank
}>(), {
    shine: true,
    frame: 'elite',
    badge: 'champion'
});
</script>