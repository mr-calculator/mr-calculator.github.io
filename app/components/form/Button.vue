<template>
    <NuxtLink :href="to" :class="['button', size, colorScheme]">
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

    font-family: RefrigeratorDeluxeHeavy, sans-serif
    font-size: 32px

    text-transform: uppercase

    cursor: pointer

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

        font-family: RefrigeratorDeluxeBold, sans-serif
        font-size: 28px

    &.yellow
        background: var(--tex-button) no-repeat
        background-size: 100% 100%

        &:hover
            background: var(--tex-button-hover) no-repeat
            background-size: 100% 100%

    &.white
        background: var(--tex-buttonWhite) no-repeat
        background-size: 100% 100%

        &:hover
            background: var(--tex-buttonWhite-hover) no-repeat
            background-size: 100% 100%

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

    size?: 'large'|'small',
    colorScheme?: 'yellow'|'white'
}>(), {
    size: 'large',
    colorScheme: 'yellow'
})

</script>