<template>
    <div
        :class="{
            texture: 1,
            'tex-clickable': clickable,
            [`tex-mode-${mode}`]: 1,
            'tex-hover': isHovering,
            'tex-square': square,
            'tex-inline': inline
        }"
        @mouseenter="onHover"
        @mouseleave="onUnhover"

        :style="{
            '--tex-color': color,
            '--tex-hover-color': hoverColor,

            '--tex-background-image': `url('/img/tex/${squareButton.default}')`,
            '--tex-background-image-hover': `url('/img/tex/${squareButton.hover}')`
        }"
    >
        <div v-if="$slots.prepend" class="tex-slot">
            <slot name="prepend" />
        </div>

        <img
            v-if="mode == 'image'"
            :src="imgSrc"
            :alt="imgSrcRel.split(/(?=[A-Z])/).join(' ')"

            :style="{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,

                objectFit,
            }"
        />
        <div
            v-else
            class="tex-image"
            :style="{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                
                '--tex-image': `url('${imgSrc}')`,
                maskSize: objectFit
            }"
        />

        <div v-if="$slots.default" class="tex-slot">
            <slot />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.texture

    &.tex-clickable
        cursor: pointer

    &.tex-mode-image

        img
            display: block
            width: 100%
            height: 100%

            user-select: none
            -webkit-user-drag: none

    &.tex-mode-mask

        &.tex-hover
            .tex-image
                background: var(--tex-hover-color, $color)

        .tex-image
            width: 100%
            height: 100%
            background: var(--tex-color, $light)

            mask-image: var(--tex-image)
            mask-repeat: no-repeat
            mask-size: 100% 100%
            mask-position: center

    &.tex-square
        background-image: var(--tex-background-image)
        background-repeat: no-repeat
        background-size: 100% 100%

        &.tex-mode-mask
            .tex-image
                mask-size: calc(100% - 6px) calc(100% - 6px)

        &.tex-mode-image
            padding: 3px

        &.tex-hover
            background-image: var(--tex-background-image-hover)

    &.tex-inline
        display: inline-block

</style>

<script lang="ts">
export interface TexProps {
    image?: TextureKey,
    src?: string,
    state?: keyof Texture,
    hover?: 'auto'|'color'|TextureKey,

    color?: 'auto'|string,
    hoverColor?: 'auto'|string,
    hoverState?: keyof Texture,

    square?: boolean,
    clickable?: boolean,

    width?: 'auto'|string|number,
    height?: 'auto'|string|number,
    objectFit?: 'cover'|'contain',

    inline?: boolean
}
</script>

<script setup lang="ts">
import { TEX, type Texture, type TextureKey } from '~/assets/data/textures';

const props = withDefaults(defineProps<TexProps>(), {
    imageType: 'key',
    state: 'default',
    hoverState: 'default',
    square: false,
    clickable: false,

    width: '100%',
    height: '100%',
});

const mode = computed(() => props.hover == 'color' || props.color ? 'mask' : 'image')
const image = computed(() => !props.src ? TEX[props.image!] : { default: props.src });
const imgSrcRel = ref(image.value[props.state] ?? image.value.default);
const imgSrc = computed(() => !props.src ? '/img/tex/' + imgSrcRel.value : imgSrcRel.value)

const isHovering = ref(false);

const squareButton = TEX.squareButton;

watch(() => props.image, () => {
    imgSrcRel.value = image.value[props.state] ?? image.value.default;
})

watch(() => props.state, (state) => {
    imgSrcRel.value = image.value[state] ?? image.value.default;
})

function onHover() {
    if (!props.hover)
        return;

    if (props.hover != 'color') {
        if (props.hover == 'auto' && image.value.hover)
            imgSrcRel.value = image.value.hover;
        else
            imgSrcRel.value = TEX[props.hover as TextureKey][props.hoverState] 
                                ?? image.value[props.state] 
                                ?? image.value.default;
    }

    isHovering.value = true;
}
function onUnhover() {
    if (!props.hover)
        return;

    if (props.hover != 'color')
        imgSrcRel.value = image.value[props.state] ?? image.value.default;

    isHovering.value = false;
}
</script>