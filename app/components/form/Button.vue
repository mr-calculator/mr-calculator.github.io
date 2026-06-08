<template>
    <NuxtLink
        :href="to"
        :class="{
            button: 1, [size]: 1, [colorScheme]: 1, disabled
        }"

        @click="handleClick"
    >
        <slot />
    </NuxtLink>
</template>

<style lang="sass" scoped>
.button
    padding: 10px 30px

    display: flex
    justify-content: center
    align-items: center
    color: $dark

    background-repeat: no-repeat
    background-size: 100% 100%

    font-family: $font-heavy
    font-size: 32px
    text-align: center
    text-transform: uppercase

    cursor: pointer
    user-select: none

    &.disabled
        color: color-mix(in srgb, $dark 30%, transparent)
        cursor: default

        opacity: .85

    &.large
        min-width: 355px
        min-height: 70px

        +media-mobile
            min-width: unset
            font-size: 24px

            ::v-deep(img)
                height: 40px

    &.small
        width: 355px
        min-height: 55px

        font-family: $font-bold
        font-size: 28px

    &.tiny
        width: auto
        min-height: 35px

        font-family: $font-bold
        font-size: 22px

    &.yellow
        background-image: var(--tex-button)

        &:not(.disabled)
            +hover
                background-image: var(--tex-button-hover)

    &.white
        background-image: var(--tex-buttonWhite)

        &:not(.disabled)
            +hover
                background-image: var(--tex-buttonWhite-hover)

    &.dark
        background-image: var(--tex-buttonDark)
        color: #fff

        &:not(.disabled)
            +hover
                background-image: var(--tex-buttonDark-hover)

    &.read-more
        background-image: var(--tex-buttonReadMore)

        font-family: $font-bold
        padding-bottom: 15px

        &:not(.disabled)
            +hover
                background-image: var(--tex-buttonReadMore-hover)

    ::v-deep(.texture)
        margin: 0 10px

    > ::v-deep(img)
        display: block
        height: 50px
        
        margin: 0 10px

</style>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    to?: string,
    target?: '_blank'|'_self'|'_parent'|'_top',

    size?: 'large'|'small'|'tiny',
    colorScheme?: 'yellow'|'white'|'dark'|'read-more',
    disabled?: boolean
}>(), {
    size: 'large',
    colorScheme: 'yellow'
})

function handleClick(e: PointerEvent) {
    if (!props.disabled)
        return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}

</script>