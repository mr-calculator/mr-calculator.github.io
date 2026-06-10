<template>
    <nav
        :class="{
            navBar: 1,
            transparent,
            fullWidth
        }"

        :data-nav-id="navId"
    >
        <div v-if="!breakpointBreak || !!$slots.prepend" class="prepend-container">
            <div v-if="!breakpointBreak && !$slots.prepend" />

            <slot name="prepend" />

            <div
                class="menu warning-wrapper"
                @click="menuOpen = !menuOpen"
            >
                <Tex
                    :image="menuOpen ? 'cross' : 'hamburger'"
                    color="#fff"
                    hover="color"
                    hover-color="var(--color)"

                    clickable
                    :width="menuOpen ? 25 : 28"
                    height="25px"
                />

                <ClientOnly>
                    <Tex
                        v-if="hasAnyMarks && !menuOpen"
                        class="warning-bubble"
                        image="redDotExcl"

                        object-fit="contain"
                    />
                </ClientOnly>
            </div>
        </div>

        <component
            :is="links ? 'div' : 'ul'"
            :class="{tabList: 1, visible: menuOpen}"
        >
            <UiNavTab
                v-for="[tabId] in filteredSlots"
                :key="tabId"

                :link-map="linkMap"
                :link="links ? linkMap[tabId] ?? `/${tabId}` : undefined"
                :marks="marks[tabId]"
                :selected="selectedTab == tabId || selectedTabFromSubmenu == tabId"
                
                :submenu-slots="submenuSlots[tabId]"
                :full-width="fullWidth"
                :breakpoint-break="breakpointBreak"

                @click="tabClick(tabId)"
                @submenu-tab-click="tabClick($event)"
            >
                <slot :name="tabId" />

                <template
                    v-for="{ slotName } in submenuSlots[tabId]"
                    #[slotName]
                >
                    <slot :name="slotName" />
                </template>
            </UiNavTab>

            <component
                v-if="$slots.append"
                :is="links ? 'div' : 'li'"
                class="append-container"
            >
                <slot name="append" />
            </component>
        </component>
    </nav>
</template>

<style src="@/assets/style/components/nav-bar.sass" scoped></style>

<script lang="ts">
export type MarkType = 'new'|'warning-bubble'|'special';
export type BarMark = 'none'|MarkType|MarkType[];
export type NavBarMarks = Record<string, BarMark>;

export type SubmenuTab = {
    slotName: string,
    slotId: string,
    selected: boolean,
    marks?: BarMark,
}
</script>

<script setup lang="ts">
import breakpointCss from '@/assets/style/components/navbar-break.css?raw';

const props = withDefaults(defineProps<{
    marks?: NavBarMarks,
    selected?: string|null,

    breakpoint?: number,

    transparent?: boolean,
    fullWidth?: boolean,

    closeMobileMenuOnClick?: boolean,
    links?: boolean,
    linkMap?: Record<string, string>
}>(), {
    closeMobileMenuOnClick: true,
    marks: () => ({}),
    breakpoint: 991,
    linkMap: () => ({}),
});

if (props.breakpoint < 991 && !props.fullWidth)
    throw createError('When not full width, the breakpoint cannot be smaller than 991 as that is the breakpoint for tablets!')

const navId = useId();
useHead({
    style: [{
        innerHTML: breakpointCss.replaceAll('%breakpoint_min%', `${props.breakpoint}`)
                                .replaceAll('%breakpoint_max%', `${props.breakpoint - 1}`)
                                .replaceAll('%nav_id%', navId)
    }]
});

const emit = defineEmits<{
    tabClick: [ tabId: string ]
}>()

const slots = useSlots();
if (!Object.keys(slots).length)
    throw createError('NavBar doesn\'t have any named slots!');

const filteredSlots = computed(() => 
    Object.entries(slots)
        .filter(([key]) => 
            !key.startsWith('_')
         && !(['default', 'prepend', 'append'].includes(key))
        )
)

const submenuSlots = computed(() => {
    const keyedSubmenuSlots: Record<string, SubmenuTab[]> = {};

    Object.entries(slots).forEach(([key]) => {
        if (!key.startsWith('_'))
            return;

        const components = key.split('_').filter(Boolean);
        if (components.length != 2)
            throw createError({
                message: 'Submenu slots must have the id format of: "_<tabId>_<subTabId>"!'
            });

        const tabId = components[0]!;
        if (!keyedSubmenuSlots[tabId])
            keyedSubmenuSlots[tabId] = [];

        keyedSubmenuSlots[tabId].push({
            slotName: key,
            slotId: components[1]!,
            selected: selectedTab.value == key,
            marks: props.marks[key]
        });
    });

    return keyedSubmenuSlots;
})

const breakpointBreak = ref(false);
function checkBreakpoint() {
    if (!props.breakpoint) {
        breakpointBreak.value = true;
        return;
    }

    breakpointBreak.value = (window?.innerWidth ?? 0) >= props.breakpoint;
}
onMounted(checkBreakpoint);
useEvent('resize', checkBreakpoint);

const menuOpen = ref(false);
const selectedTab = ref<string|null>(
    typeof props.selected === 'undefined' ?
        filteredSlots.value[0]![0]
        :
        props.selected
);
watch(() => props.selected, (newSelected) => 
    typeof newSelected === 'undefined' ?
        filteredSlots.value[0]![0]
        :
        selectedTab.value = newSelected
);

const isSubmenu = computed(() => selectedTab.value?.startsWith('_'));
const selectedTabFromSubmenu = computed(() => {
    if (!isSubmenu.value || !selectedTab.value)
        return null;

    const components = selectedTab.value.split('_').filter(Boolean);
    return components[0];
})

const hasAnyMarks = computed(() => 
    Object.values(props.marks).some(mark => mark !== 'none' && mark !== 'special')
);

function tabClick(tabId: string) {
    selectedTab.value = tabId;
    if (props.closeMobileMenuOnClick && !submenuSlots.value[selectedTab.value])
        menuOpen.value = false;

    emit('tabClick', tabId);
}

defineExpose({
    closeMenu() {
        menuOpen.value = false;
    }
})

</script>