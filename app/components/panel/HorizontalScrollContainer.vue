<template>
    <div
        ref="container"
        class="scroll-container"
        @wheel="onWheel"
        @mousedown="onPointerDown"
        @mousemove="onPointerMove"
        @mouseup="onPointerUp"
        @mouseleave="onPointerUp"
        @touchstart.passive="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onPointerUp"
    >
       <div ref="content" class="scroll-content" :style="{ transform: `translateX(${-scrollX}px)` }">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="sass">
.scroll-container
    overflow: hidden
    width: 100%
    cursor: grab
    touch-action: pan-y

    &:active
        cursor: grabbing

    .scroll-content
        display: flex
        gap: 10px
        will-change: transform

        ::v-deep(img)
            -webkit-user-drag: none
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits(['scrollInteract']);
function scrollInteract() {
    simulatedScrollSmooth = DEFAULT_SCROLL_SMOOTH;
    emit('scrollInteract');
}

const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

const scrollX = ref(0);
let targetX = 0;
let maxScroll = 0;

let dragging = false;
let startX = 0;
let startY = 0;
let startScroll = 0;

const DEFAULT_SCROLL_SMOOTH = 0.15;
let simulatedScrollSmooth = DEFAULT_SCROLL_SMOOTH;

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(v, max));
}

function updateBounds() {
    if (!container.value || !content.value) return;

    const containerWidth = container.value.clientWidth;
    const contentWidth = content.value.scrollWidth;

    maxScroll = Math.max(0, contentWidth - containerWidth);
    targetX = clamp(targetX, 0, maxScroll);
}

function animate() {
    scrollX.value += (targetX - scrollX.value) * simulatedScrollSmooth;

    if (scrollX.value > targetX - 0.5)
        simulatedScrollSmooth = DEFAULT_SCROLL_SMOOTH;

    requestAnimationFrame(animate);
}

function onWheel(e: WheelEvent) {
    targetX = clamp(targetX + e.deltaY, 0, maxScroll);

    if (!(targetX > maxScroll - 0.5 || targetX < 0.5))
        e.preventDefault();

    scrollInteract();
}

function onPointerDown(e: MouseEvent) {
    dragging = true;
    startX = e.clientX;
    startScroll = targetX;

    scrollInteract();
}

function onPointerMove(e: MouseEvent) {
    if (!dragging) return;

    const delta = e.clientX - startX;
    targetX = clamp(startScroll - delta, 0, maxScroll);
}

function onPointerUp() {
    dragging = false;
}

function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    dragging = true;
    startX = touch!.clientX;
    startY = touch!.clientY;
    startScroll = targetX;

    scrollInteract();
}

function onTouchMove(e: TouchEvent) {
    if (!dragging) return;

    const touch = e.touches[0];
    const deltaX = touch!.clientX - startX;
    const deltaY = touch!.clientY - startY;

    if (Math.abs(deltaY) > Math.abs(deltaX))
        return;

    targetX = clamp(startScroll - deltaX, 0, maxScroll);

    if (!(targetX > maxScroll - 0.5 || targetX < 0.5))
        e.preventDefault();
}

function scrollToElement(el: HTMLElement, smoothing = DEFAULT_SCROLL_SMOOTH) {
    targetX = Math.max(
        0,
        Math.min(el.offsetLeft, maxScroll)
    );

    simulatedScrollSmooth = smoothing;
}

function scrollTo(x: number, smoothing = DEFAULT_SCROLL_SMOOTH) {
    targetX = Math.min(x, maxScroll);
    simulatedScrollSmooth = smoothing;
}

defineExpose({
    maxScroll() {
        return maxScroll;
    },
    scrollTo,
    scrollToElement,
    updateBounds
})

useEvent('resize', updateBounds);

onMounted(() => {
    updateBounds();
    setTimeout(updateBounds, 100);
    animate();
});
</script>