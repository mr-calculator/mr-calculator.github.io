<template>
    <div class="item-list-wrapper">
        <div ref="tools" :class="{header: 1, mobile}">
            <div class="owned-count">
                <ClientOnly>
                    {{ ownedCount }}/{{ currentItemCount }}
                    <template #fallback>
                        — / {{ currentItemCount }}
                    </template>
                </ClientOnly>
            </div>

            <div class="filters">
                <div
                    v-if="hasAnyGroupSortFilter"
                    ref="panel-button"
                    class="panel-button"

                    @click="filterWindowOpen = !filterWindowOpen"

                    v-tooltip="({
                        text: `GROUP/SORT${filterSections?.length ? '/FILTER' : ''}`
                    } satisfies TooltipBinding)"
                >
                    <div
                        v-if="grouping.default != '__def__none'"
                        :class="{
                            'selected-option': 1,
                            modified: groupBy != grouping.default
                        }"
                    >
                        <Tex
                            :image="(grouping.items[groupBy]!.icon as TextureKey)"
                            color="#fff"

                            width="40px"
                            height="40px"
                        />
                    </div>
                    <div
                        v-if="sorting.default != '__def__none'"
                        :class="{
                            'selected-option': 1,
                            modified: sortBy != sorting.default
                        }"
                    >
                        <Tex
                            :image="(sorting.items[sortBy]!.icon as TextureKey)"
                            color="#fff"

                            width="40px"
                            height="40px"
                        />
                    </div>
                    <div
                        v-if="filterSections?.length"
                        :class="{
                            'selected-option': 1,
                        }"
                    >
                        <Tex
                            :image="filterBy.length ? 'filter' : 'filterNone'"
                            :state="filterBy.length ? 'active' : 'default'"

                            width="40px"
                            height="40px"
                        />
                    </div>
                    <div
                        v-if="search"
                        :class="{
                            'selected-option': 1,
                            modified: searchText,
                            last: 1
                        }"
                    >
                        <Tex
                            :image="searchText ? 'filterSearch' : 'filterNoSearch'"
                            color="#fff"

                            width="40px"
                            height="40px"
                        />
                    </div>

                    <Tex
                        image="dropdownCaret"

                        width="15px"
                        height="15px"
                    />
                </div>
                <div v-if="filterOwned" class="owned">
                    <FormCheckbox
                        v-model="filterByOwned"

                        size="medium"
                        color-scheme="dark"
                    >
                        OWNED
                    </FormCheckbox>
                </div>
            </div>
        </div>

        <PanelCosmeticsList
            v-if="hasItems"
            class="item-list"
            ref="item-list"
            :display="display"
            :items="processedItems"
            :checked-items="equippedItem ? [equippedItem] : []"

            :marked-items="ownedItems"
            mark-name="Owned"

            show-count
            hide-name

            v-model="selected"
            @item-click="$emit('itemClick', $event)"
            @item-rick-click="$emit('itemRickClick', $event)"
        />
        <div v-else class="no-results">
            <slot
                name="empty-state"
                :resetFilters="resetFilters"
            />
        </div>

        <Teleport to="body">
            <div
                v-if="filterWindowOpen"
                class="filter-window"
                ref="filter-window"
                :style="filterWindowPosition"
            >
                <div class="search">
                    <Tex
                        class="close"
                        image="cross"

                        color="#fff"
                        hover="color"
                        hover-color="var(--light-blue)"

                        clickable

                        width="40px"
                        height="40px"

                        @click="filterWindowOpen = false"
                    />
                    <FormSearchBox
                        v-if="search"
                        small
                        v-model="searchText"
                    />

                    <FormDropdown
                        v-if="filterSections?.length"
                        ref="filter-dropdown"

                        :options="filterOptions"
                        v-model="filterBy"
                        :placeholder="{
                            label: 'FILTER',
                            leftIcon: {
                                key: 'filter',
                                size: 35
                            }
                        }"
                        small
                        search
                        push-checked-to-top
                        mobile-overlay
                        :concatenate-selected-options="shouldConcatenateSelectedFilters"
                    />
                </div>

                <ul class="listed">
                    <li
                        v-for="opt in GROUP_SORT_OPTS"
                    >
                        <h3>
                            {{ opt.title }}
                        </h3>
                        <ul>
                            <li
                                v-for="[id, item] in Object.entries(opt.opts.items)"
                                :key="item.name"
                                :class="{ checked: opt.ref.value == id }"

                                @click="opt.ref.value = (id as any)"
                            >
                                <div class="item-info">
                                    <Tex
                                        :image="(item.icon as TextureKey)"
                                        color="#fff"

                                        width="40px"
                                        height="40px"
                                    />
                                    <h4>{{ item.name }}</h4>
                                </div>

                                <Tex
                                    v-if="opt.ref.value == id"
                                    image="check"
                                    color="#fff"

                                    width="20px"
                                    height="20px"
                                />
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </Teleport>
    </div>
</template>

<style src="@/assets/style/components/cosmetics/list-view.sass" scoped></style>

<script lang="ts">
export type CosmeticItem = {
    id: string
    name: string
    rarity: Rarity
    image: string

    // arbitrary extra fields the caller wants filterable/groupable
    [key: string]: any
}

// Describes one group-by option
export type GroupingConfig = {
    default: string
    items: Record<string, {
        /** By what to group */
        name: string
        icon: TextureKey

        groupCategoryOptions?: Pick<
            CosmeticsList.Category<any>,
            'collapsible'|'showCount'|'hideName'|'hideImage'
        >

        // how to derive a category key from an item
        groupKey: (item: CosmeticItem) => string
        // how to get display name of a group from its key
        groupName?: (key: string) => string,

        sortGroup?: (
            a: { id: string, name: string },
            b: { id: string, name: string }
        ) => number
    }>
}

// Describes one sort option
export type SortingConfig = {
    default: string
    items: Record<string, {
        name: string
        icon: TextureKey
        compareFn: (a: CosmeticItem, b: CosmeticItem) => number
    }>
}

// Each filter section: "rarity", "category", "source", etc.
// The component renders these as dropdown sections
export type FilterSection = {
    key: string  // used as prefix in filterBy values
    category: Option
    /** Options without filter section key in value */
    options: Option[]
    // how to test an item against the active filter values for this section
    test: (item: CosmeticItem, activeValues: string[]) => boolean
}
</script>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import type { ComponentInstance } from 'vue';
import { type Rarity } from '~/assets/data/common';
import type { TextureKey } from '~/assets/data/textures';
import type { Option } from '~/components/form/Dropdown.vue';
import type { CategorizedCosmeticItemRecord, CosmeticItem as ListCosmeticItem } from '~/components/panel/cosmetics/List.vue';
import type { TooltipBinding } from '~/directives/tooltip';
import * as CosmeticsList from '~/components/panel/cosmetics/List.vue';

const props = withDefaults(defineProps<{
    display?: 'list'|'grid'

    items: CosmeticItem[]
    grouping?: GroupingConfig
    sorting?: SortingConfig
    filterSections?: FilterSection[],
    search?: (item: CosmeticItem, searchText: string) => boolean
    filterOwned?: boolean,
    ownedItems: string[],
    equippedItem: string|undefined
}>(), {
    display: 'grid',
    grouping: () => ({
        default: '__def__none',
        items: {
            __def__none: {
                name: 'No Grouping',
                icon: 'none',

                groupKey: () => '__def__none',
                groupName: () => 'All'
            },
        }
    }),
    sorting: () => ({
        default: '__def__none',
        items: {
            __def__none: {
                name: 'No Sorting',
                icon: 'none',
                compareFn: () => 0
            },
        }
    })
});

const emit = defineEmits<{
    itemClick: [item: CosmeticItem],
    itemRickClick: [item: CosmeticItem]
}>()

const selected = defineModel<string>({ required: true });

const mobile = isMobile();
const tools = useTemplateRef('tools');

useStickyBar(tools, {
    topOffset: -65,
    showClass: 'sticky-mobile-show',
    mobileOnly: true,
    scrollToTopOnInit: true
});

const itemList = useTemplateRef('item-list');

const panelButton = useTemplateRef('panel-button');
const panelButtonRect = ref<DOMRect>();
function setPanelButtonRect() {
    if (!panelButton.value)
        return;

    panelButtonRect.value = panelButton.value.getBoundingClientRect();
}
onMounted(setPanelButtonRect)
useEvent('resize', setPanelButtonRect);

const filterWindowOpen = ref(false);
const filterWindow = useTemplateRef('filter-window');
const filterWindowPosition = computed(() => {
    props.grouping.default != '__def__none';
    props.sorting.default != '__def__none';
    props.filterSections?.length;
    props.search;

    if (!panelButtonRect.value)
        return {
            '--top': '40px',
            '--left': '50px'
        }

    return {
        '--top': (panelButtonRect.value.top + panelButtonRect.value.height) + 'px',
        '--left': panelButtonRect.value.left + 'px'
    }
});
onClickOutside(filterWindow, e => {
    const target = e.target as HTMLElement;

    if (panelButton.value?.contains(target))
        return;

    function hasDropdownOverlayParent(el: HTMLElement) {
        if (!el.parentElement)
            return false;
        
        const is = el.parentElement?.classList.contains('dropdown-mobile-overlay-wrapper');
        if (is)
            return true;

        return hasDropdownOverlayParent(el.parentElement);
    }
    if (target.classList.contains('dropdown-mobile-overlay-wrapper') || hasDropdownOverlayParent(target))
        return;
    
    filterWindowOpen.value = false;
});


const hasAnyGroupSortFilter = computed(() => 
       props.grouping.default != '__def__none'
    || props.sorting.default != '__def__none'
    || props.filterSections?.length
    || props.search
)

const groupBy = ref<string>(props.grouping.default);
const sortBy = ref<string>(props.sorting.default);
const GROUP_SORT_OPTS = computed(() => {
    const opts: {
        title: string,
        opts: GroupingConfig|SortingConfig,
        ref: Ref<string>
    }[] = [];
    
    if (props.grouping.default != '__def__none')
        opts.push({
            title: 'Group by',
            opts: props.grouping,
            ref: groupBy
        });

    if (props.sorting.default != '__def__none')
        opts.push({
            title: 'Sort by',
            opts: props.sorting,
            ref: sortBy
        });

    return opts;
});

const filterOptions = computed<Option[]>(() => 
    props.filterSections?.map(sect => 
        [
            sect.category,
            ...sect.options.map(opt => ({
                ...opt,
                value: `${sect.key}:${opt.value}`
            }))
        ]
    ).flat() ?? []
);
function shouldConcatenateSelectedFilters(selected: Option[]) {
    return {
        enabled: selected.every(opt => 
            (opt.whenSelected && (opt.whenSelected as { showOnlyLeftIcon: boolean }).showOnlyLeftIcon)
         && opt.leftIcon),
        max: 3
    }
}

const filterBy = ref<string[]>([]);
const filterByOwned = ref(false);

const searchText = ref('');
const filterSearchText = ref('');

const setSearchTextDebounced = useDebounceFn((text: string) => {
    filterSearchText.value = text;
}, 200)
watch(searchText, text => setSearchTextDebounced(text));

useReactiveQueryProps({
    group: {
        ref: groupBy,
        default: props.grouping.default,
        converter: RouteConverter.string
    },
    sort: {
        ref: sortBy,
        default: props.sorting.default,
        converter: RouteConverter.string
    },
    search: {
        ref: searchText,
        default: '',
        converter: RouteConverter.string,
        debounceDelay: 500
    },
    filter: {
        ref: filterBy,
        converter: RouteConverter.stringArray
    },
    owned: {
        ref: filterByOwned,
        default: false,
        converter: RouteConverter.boolean
    },
});

const processedItems = computed(() => {
    let filtered = props.items.filter(item => {
        // search
        if (props.search && filterSearchText.value && !props.search(item, filterSearchText.value))
            return false;

        // owned
        if (props.filterOwned && filterByOwned.value && !props.ownedItems.includes(item.id))
            return false;

        // each filter section
        for (const section of props.filterSections ?? []) {
            const activeForSection = filterBy.value
                .filter(v => v.startsWith(`${section.key}:`))
                .map(v => v.slice(section.key.length + 1));

            if (activeForSection.length && !section.test(item, activeForSection))
                return false;
        }

        return true;
    });

    const groupingConfig = props.grouping.items[groupBy.value]!;
    let groups: CategorizedCosmeticItemRecord<CosmeticItem> = {};
    filtered.forEach(item => {
        const groupKey = groupingConfig.groupKey(item);
        const groupName = groupingConfig.groupName?.(groupKey) ?? groupKey;

        if (!groups[groupKey])
            groups[groupKey] = {
                name: groupName,
                ...groupingConfig.groupCategoryOptions,

                items: []
            };

        groups[groupKey].items.push(item);
    });

    groups = Object.fromEntries(
        // not neccessary to filter out empty groups since they are made from the items
        Object.entries(groups).toSorted((a,b) =>
            groupingConfig.sortGroup?.({
                id: a[0],
                name: a[1].name
            }, {
                id: b[0],
                name: b[1].name
            }) ?? 0
        )
    );

    const sortingConfig = props.sorting.items[sortBy.value]!;
    Object.values(groups).forEach(group =>
        group.items.sort(sortingConfig.compareFn)
    );

    const groupsKeys = Object.keys(groups);
    if (groupsKeys.length == 1) {
        const key = ['__all', '__def__none'].find(k => k == groupsKeys[0])
        if (key)
            return groups[key]!.items;
    }

    return groups;
});

watch([ groupBy, sortBy, filterBy, searchText ], () => {
    ((itemList.value as ComponentInstance<typeof CosmeticsList>)?.$el as HTMLElement)?.scrollTo({
        top: 0,
        behavior: 'instant'
    })
})

const hasItems = computed(() => {
    if (!processedItems.value)
        return false;

    if (Array.isArray(processedItems.value))
        return !!processedItems.value.length;

    return !!Object.values(processedItems.value).flatMap(cat => cat.items).length;
})
function resetFilters() {
    filterBy.value = [];
    searchText.value = '';
}

const currentItemCount = computed(() => {
    if (Array.isArray(processedItems.value))
        return processedItems.value.length;

    return Object.values(processedItems.value).reduce((sum, current) => sum + current.items.length, 0);
});

const ownedCount = computed(() => {
    if (!processedItems.value)
        return 0;

    let itemsFlat: ListCosmeticItem[] = [];
    if (Array.isArray(processedItems.value))
        itemsFlat = processedItems.value;
    else
        itemsFlat = Object.values(processedItems.value).flatMap(cat => cat.items);

    return itemsFlat.filter(np => props.ownedItems.includes(np.id)).length;
})



onMounted(() => {
    document.querySelector(`[data-item-id="${selected.value}"]`)?.scrollIntoView({
        behavior: 'instant',
        block: 'center'
    })
})
</script>