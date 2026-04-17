<template>
    <NuxtLink
        class="featured-hero"
        :to="`/heroes/${hero.id}?from=/`"
    >
        <div
            class="prestige"
            :style="{
                '--prestige-image': `url(${hero.dataDir}prestige.webp)`,
                '--hero-color': hero.color
            }"
        >
            <div class="stroke" />
            <img :src="`${hero.dataDir}prestige.webp`" />
            <div class="shadow" />
        </div>
        <div class="bar">
            <div class="new">
                NEW
            </div>
            <div class="hero-info">
                <h3 class="name">
                    {{ hero.name }}
                </h3>
                <div class="role">
                    <Tex
                        v-for="role in heroRolesAsArray(hero.roles)"
                        :src="ROLE_ICONS[role]"
                        color="var(--color-highlight)"

                        width="30px"
                        height="30px"
                    />
                    <span v-if="heroRolesAsArray(hero.roles).length == 1">
                        {{ heroRolesAsArray(hero.roles)[0] }}
                    </span>
                </div>
            </div>

            <div class="hero-promo-cta">
                <Tex
                    image="arrowRight"
                    color="#fff"

                    width="45px"
                    height="35px"
                />
            </div>
        </div>
    </NuxtLink>
</template>

<style lang="sass" scoped>
.featured-hero
    position: relative

    &:hover
        .prestige
            .stroke
                left: -16px
                
                &::after
                    left: 8px
                    background: $color

        .bar
            background-image: var(--tex-promoFeaturedBar-active)

            .new
                filter: brightness(1.5)
                color: $blue

            .hero-info
                .name
                    color: $blue

                .role
                    color: $light-blue
            
                    .texture
                        --tex-color: #{$light-blue} !important

            .hero-promo-cta
                transform: translateX(10px)

                .texture
                    --tex-color: #{$blue} !important

    .prestige
        transform: translateX(-50px)
        width: 500px

        +media-mobile
            max-width: 500px
            width: 100%

        .stroke
            position: absolute
            left: -8px
            width: 100%
            height: 100%

            mask-image: var(--tex-heroPrestigeMask)
            mask-repeat: no-repeat
            mask-size: 105%
            mask-position: 50% 10%

            transition: left .05s ease-out

            &::before
                content: ""
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                mask-image: var(--prestige-image)
                mask-size: 100% 100%

                background: #fff

            &::after
                content: ""
                position: absolute
                left: 4px
                width: 100%
                height: 100%
                mask-image: var(--prestige-image)
                mask-size: 100% 100%

                background: var(--hero-color)

                transition: background .1s ease-out, left .05s ease-out

        img
            display: block
            width: 100%

            mask-image: var(--tex-heroPrestigeMask)
            mask-repeat: no-repeat
            mask-size: 105%
            mask-position: 50% 10%

            -webkit-user-drag: none
            user-select: none

        .shadow
            position: absolute
            top: 50%
            left: calc(50% + 50px)
            transform: translate(-50%, -50%)
            width: 1000px
            height: 1000px

            background: radial-gradient(ellipse 60% 100%,rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%) no-repeat

            z-index: -1
            pointer-events: none
            user-select: none


    .bar
        position: absolute
        bottom: 0
        left: 0
        width: 500px
        min-height: 100px

        padding: 10px 50px 10px 20px

        background: var(--tex-promoFeaturedBar) no-repeat
        background-size: 100% 100%

        display: grid
        grid-template-columns: 100px auto auto
        align-items: center
        gap: 20px

        user-select: none
        cursor: pointer

        z-index: 2

        transition: background .1s ease-out

        +media-max-tablet
            max-width: 500px
            width: 100%
            
            grid-template-columns: 65px auto auto
            gap: 10px

            padding: 10px 30px 10px 10px

        .new
            align-self: center
            display: inline-block
            padding: 10px 20px

            background: var(--tex-tab-active)
            background-size: 100% 100%

            display: flex
            justify-content: center
            align-items: center

            font-family: RefrigeratorDeluxeHeavy
            font-size: 30px
            color: $text-color

            +media-max-tablet
                font-size: 24px
                padding: 5px 10px

        .hero-info
            display: flex
            flex-direction: column
            // align-items: center

            +media-max-tablet
                gap: 3px

            .name
                font-size: 38px
                line-height: 36px
                font-style: italic
                text-transform: uppercase
                // text-align: center
                color: #fff

                +media-max-tablet
                    font-size: 28px
                    line-height: 24px

            .role
                display: flex
                align-items: center
                gap: 10px
                font-family: RefrigeratorDeluxeHeavy
                font-size: 22px
                text-transform: uppercase

                color: $color-highlight

                +media-max-tablet
                    font-size: 17px

        .hero-promo-cta
            transform: translateX(0px)
            transition: transform .1s ease-out

            ::v-deep(.texture .tex-image)
                +media-max-tablet
                    width: 35px !important
                    height: 25px !important
</style>

<script setup lang="ts">
import { ROLE_ICONS, type HeroData } from '~/assets/data/common';
import { heroRolesAsArray } from '~/assets/data/heroes';

defineProps<{
    hero: HeroData
}>();
</script>