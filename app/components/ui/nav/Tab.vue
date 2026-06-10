<template>
    <component
        ref="tab"
        :is="!!link ? NuxtLink : 'li'"

        :class="{
            tabItem: 1,

            'warning-wrapper': isMarkedAs('warning-bubble'),
            new: isMarkedAs('new'),
            selected,
            special: isMarkedAs('special'),
        }"

        :to="link"
        draggable="false"

        @mouseenter="onHover"
        @mouseleave="onUnhover"
        
        @click.capture="mobileTapSelected"
        
        v-bind="$attrs"
    >
        <!-- ANIMATION (SPECIAL) -->
        <div
            v-if="isMarkedAs('special') && !selected"
            class="special-animation"
        />

        <!-- NEW? -->
        <ClientOnly>
            <span
                v-if="isMarkedAs('new')"
                class="new">
                NEW
            </span>
        </ClientOnly>

        <slot />

        <!-- EXCLAMATION MARK -->
        <ClientOnly>
            <Tex
                v-if="isMarkedAs('warning-bubble')"
                class="warning-bubble"
                image="redDotExcl"

                object-fit="contain"
            />
        </ClientOnly>

        <!-- ANIMATION (CLICK) -->
        <div
            v-if="(typeof animationTask !== 'undefined')"
            class="active-animation"
        />
    </component>
    <!-- SUBMENU -->
    <div
        v-if="selected && submenuSlots"
        ref="submenu"
        :class="{
            [breakpointBreak ? 'navbar-submenu' : 'inner-submenu']: 1,
            'full-width': fullWidth,
            'show': scrollShow || hoverCounter >= 1 || mobileTapShow,
            'opaque-bg': hoverCounter >= 1 || mobileTapShow
        }"
        :style="{
            '--tab-left': tabLeft
        }"

        @mouseenter="onHover(true)"
        @mouseleave="onUnhover(true)"
    >
        <Tab
            v-for="{ slotName, slotId, selected, marks } in submenuSlots"
            :key="slotName"
            class="submenu-item"

            :link="link ? (linkMap?.[slotName] ?? (trimLast('/', link) + '/' + slotId)) : undefined"
            :marks="marks"
            :selected="selected"

            @click="$emit('submenuTabClick', slotName, $event)"
        >
            <slot :name="slotName" />
        </Tab>
    </div>
</template>

<style src="@/assets/style/components/nav-bar.sass" scoped></style>

<script setup lang="ts">
import { NuxtLink } from '#components';
import type { ComponentInstance } from 'vue';
import type { BarMark, MarkType, SubmenuTab } from './Bar.vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
    linkMap?: Record<string, string>,
    link?: string,
    marks?: BarMark,
    selected: boolean,

    submenuSlots?: SubmenuTab[],
    fullWidth?: boolean,
    breakpointBreak?: boolean
}>();

const emits = defineEmits<{
    submenuTabClick: [ slotName: string, event: PointerEvent ]
}>();

const touchDevice = isTouchDevice();

function isMarkedAs(as: MarkType) {
    if (!props.marks || props.marks == 'none')
        return false;

    if (Array.isArray(props.marks))
        return props.marks.includes(as);

    return props.marks == as;
}

const tab = useTemplateRef<HTMLElement|ComponentInstance<typeof NuxtLink>>('tab');
const tabRect = ref({
    width: 0,
    left: 0
});
function getTabRect() {
    const rect = (tab.value as HTMLElement)?.getBoundingClientRect?.()
        || ((tab.value as ComponentInstance<typeof NuxtLink>)?.$el as HTMLElement)?.getBoundingClientRect?.();
    return { width: rect?.width ?? 0, left: rect?.left ?? 0 };
}

onMounted(() => window?.setTimeout(() => tabRect.value = getTabRect(), 100));
useEvent('resize', () => tabRect.value = getTabRect());

const submenu = useTemplateRef('submenu');

const scrollShow = ref(true);
useEvent('scroll', () => {
    if (!props.breakpointBreak)
        return;

    const scrollY = window?.scrollY ?? 0;

    if (scrollY > 50)
        scrollShow.value = false;
    else
        scrollShow.value = true;
});

const hoverCounter = ref(0);
function onHover(fromSubmenu = false) {
    if (touchDevice.value)
        return;
    
    if (!props.breakpointBreak)
        return;

    if (!props.breakpointBreak && fromSubmenu)
        return;
    
    hoverCounter.value += 1;
}

function onUnhover(fromSubmenu = false) {
    if (touchDevice.value)
        return;

    if (!props.breakpointBreak)
        return;

    if (!props.breakpointBreak && fromSubmenu)
        return;

    hoverCounter.value -= 1;
}

const mobileTapShow = ref(false);
function mobileTapSelected(e: PointerEvent, set = true) {
    if (!props.selected)
        return;
    if (!touchDevice.value)
        return;

    if (set)
        mobileTapShow.value = !mobileTapShow.value;

    e.preventDefault();
    e.stopImmediatePropagation();
}

// @ts-ignore
onClickOutside(tab, (e) => {
    const target = e.target as HTMLElement;
    if (submenu.value?.contains(target))
        return;

    mobileTapShow.value = false;
})

useEvent('touchmove', () => {
    if (!props.breakpointBreak)
        return;

    hoverCounter.value = 0;
    mobileTapShow.value = false;
})

const tabLeft = computed(() => {
    let left = tabRect.value.left + tabRect.value.width / 2;

    if (left < 100)
        left = 100;

    return left + 'px';
})

const animationTask = ref<number|undefined>();

watch(() => props.selected, (selected, newSelected) => {
    if (selected == newSelected || !selected)
        return;

    clearTimeout(animationTask.value);
    animationTask.value = window?.setTimeout(() => {
        animationTask.value = undefined;
    }, 450);
});

onUnmounted(() => clearTimeout(animationTask.value));

</script>