<template>
    <Teleport to="body">
        <div class="info-modal-wrapper">
            <div :class="{'info-modal-content': 1, large}" v-bind="$attrs">
                <Tex
                    class="close"

                    image="cross"
                    clickable
                    hover="crossBlue"

                    width="30px"
                    height="30px"

                    @click="$emit('close')"
                />

                <h1 v-if="title" v-html="title" />
                <div class="slot">
                    <slot />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style lang="sass" scoped>
.info-modal-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: var(--u100vh)

    background: #17172cc8
    backdrop-filter: blur(10px)

    display: flex
    justify-content: center

    overscroll-behavior: contain

    z-index: 30

    +mediaIOS
        background: #121221e3

    .info-modal-content
        position: relative
        width: 100%
        padding: 60px 20px 40px 20px

        display: flex
        flex-direction: column

        color: $light

        +media-desktop
            width: 800px
            padding: 40px 20px + 55px

        &.large
            width: 100% !important

            .close
                +media-desktop
                    right: 20px + 55px

        .close
            position: absolute
            top: 20px
            right: 50%
            transform: translateX(50%)

            cursor: pointer

            +media-desktop
                top: 48px
                right: 20px
                transform: none

        h1
            font-size: 46px
            font-family: RefrigeratorDeluxeHeavy
            font-style: italic
            font-weight: normal
            text-transform: uppercase
            text-align: center
            color: #fff

            margin-bottom: 30px

        .slot
            width: 100%
            max-height: 100%

            padding: 0 20px

            overflow-x: hidden
            overflow-y: auto

            +scrollbar($background: transparent, $thumb: $light, $active: $blue)

            ::v-deep(p)
                font-size: 18px
                font-family: KelsonSans
                text-align: justify

                margin-bottom: 20px

            > ::v-deep(img)
                width: 100%
                margin-bottom: 20px

            ::v-deep(.button)
                max-width: 100%
                margin: 40px auto 20px auto

            ::v-deep(.monospace)
                font-family: monospace

                &.center
                    display: block
                    text-align: center
</style>

<script setup lang="ts">
defineProps<{
    title?: string,
    large?: boolean
}>();
defineEmits(['close']);
</script>