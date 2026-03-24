<template>
    <div class="animated-icon-container" :style="{
        width: props.size + 'px',
        height: props.size + 'px'
    }">
        <div
            class="animated-icon"
            :style="animatedIconStyle"
        />
    </div>
</template>

<style lang="sass" scoped>
.animated-icon-container
    position: relative

    overflow: hidden
    user-select: none

    .animated-icon
        display: block

        position: absolute
        top: 50%
        left: 50%
        transform: translate(calc(-50% + var(--offset-x)), calc(-50% + var(--offset-y)))

        width: var(--size)
        height: var(--size)

        transition: transform .1s ease

        pointer-events: none

        background-repeat: no-repeat;
        background-size: var(--sheet-width) auto
</style>

<script setup lang="ts">
import type { Reward } from '~/assets/data/common';

const DEFAULT_SIZE = 240;

const props = withDefaults(defineProps<{
    reward: Reward,
    size?: number
}>(), {
    size: DEFAULT_SIZE
});

interface AnimatedIcon {
    icon: string,
    iconAnimation: Reward['iconAnimation']

    totalFrames: number,
    frameSize: [width: number, height: number],
    sheetWidth: number,
    intervalTask: any,
    offset?: [x: number, y: number],

    currentFrame: number
}

function computeFrameValues(reward: Reward): AnimatedIcon|null {
    const iconAnimation = reward.iconAnimation;
    if (!iconAnimation)
        return null;

    const totalFrames = iconAnimation.columns * iconAnimation.rows;
    const frameWidth = iconAnimation.size[0] / iconAnimation.columns;
    const frameHeight = iconAnimation.size[1] / iconAnimation.rows;

    // calc proportionate sizes
    const scale = props.size / frameWidth;

    const sheetWidth = iconAnimation.size[0] * scale;

    const scaledFrameWidth = props.size;
    const scaledFrameHeight = frameHeight * scale;

    return {
        icon: reward.icon,
        iconAnimation: reward.iconAnimation,

        totalFrames,
        frameSize: [scaledFrameWidth, scaledFrameHeight],
        sheetWidth,
        intervalTask: window?.setInterval(() => 
            advanceIconAnimationTime(),
            1000 / reward.iconAnimation!.fps
        ),
        offset: reward.iconAnimation!.offset,

        currentFrame: 0
    }
}

const animatedIcon = ref<AnimatedIcon|null>(computeFrameValues(props.reward));
watch(() => props.reward, (reward) => {
    clearInterval(animatedIcon.value?.intervalTask);
    animatedIcon.value = computeFrameValues(reward);
}, { deep: true });

const animatedIconStyle = computed(() => {
    const icon = animatedIcon.value;

    if (!icon)
        return {};

    // determine column and row
    const col = icon.currentFrame % icon.iconAnimation!.columns;
    const row = Math.floor(icon.currentFrame / icon.iconAnimation!.columns);

    const offsetX = ((icon.offset?.[0] ?? 0) * props.size) / DEFAULT_SIZE;
    const offsetY = ((icon.offset?.[1] ?? 0) * props.size) / DEFAULT_SIZE;

    return {
        '--size': props.size + 'px',
        '--sheet-width': icon.sheetWidth + 'px',
        '--offset-x': (offsetX * -1) + 'px',
        '--offset-y': (offsetY * -1) + 'px',
        backgroundImage: `url(${icon.icon})`,
        backgroundPosition: `-${col * icon.frameSize[0]}px -${row * icon.frameSize[1]}px`
    };
});

function advanceIconAnimationTime() {
    if (!animatedIcon.value)
        return;

    animatedIcon.value.currentFrame++;
    if (animatedIcon.value.currentFrame >= animatedIcon.value.totalFrames)
        animatedIcon.value.currentFrame = 0;
}

onUnmounted(() => clearInterval(animatedIcon.value?.intervalTask))

</script>