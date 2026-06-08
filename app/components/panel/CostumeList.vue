<template>
    <div class="costume-list">
        <div
            ref="cosmeticsControls"
            :class="{ 'cosmetics-controls': 1, mobile }"
        >
            <p class="owned-count">
                <ClientOnly>
                    <span class="owned">{{ ownedCostumes.length }}</span>/<span class="total">{{ heroCostumes.length }} OWNED</span>
                </ClientOnly>
            </p>
            <FormDropdown
                ref="filter-dropdown"

                :options="filterOptions"
                v-model="activeFilters"
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
            <FormDropdown
                ref="sort-dropdown"

                :options="sortDropdownOptions"
                v-model="costumeSort"
                small
            />
        </div>
        <div v-if="sortedCostumes.length" class="list">
            <PanelCostumeCard
                v-for="costume in sortedCostumes"
                :key="costume.id"

                :name="costume.name"
                :src="`/img/heroes/data/${hero.id}/costumes/${costume.id}_200.webp`"
                :rarity="costume.rarity"
                :owned="ownedCostumes.includes(costume.id)"
                :color="hero.color"

                @toggle="toggleCostumeOwned(costume.id)"
                @click="openCostumeDetail(costume)"
            />
        </div>
        <div v-else class="no-results">
            <p>No costumes match your filters</p>
            <FormButton
                size="tiny"
                @click="activeFilters = []"
            >
                Reset filters
            </FormButton>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.costume-list
    padding: 0
    width: 100%
    height: 100%

    +media-desktop
        overflow-x: hidden
        overflow-y: scroll

        +scrollbar($thickness: 8px, $background: $light, $thumb: $light-blue, $active: $color)

    .cosmetics-controls
        position: sticky
        top: 65px

        padding: 20px
        padding-left: 28px // center bcs of scrollbar always on

        display: grid
        grid-template-columns: 1fr 1fr
        justify-items: center
        align-items: center
        gap: 10px

        z-index: 10

        transition: .1s ease

        +media($size: 460px, $minmax: 'max')
            grid-template-columns: 1fr
            padding-left: 20px

        +media-tablet
            display: flex
            flex-wrap: wrap
            gap: 20px

        +media-desktop
            top: 0

        &.sticky
            background: $blue-gray
            padding: 10px 20px

            padding-left: 28px // center bcs of scrollbar always on

            +media($size: 460px, $minmax: 'max')
                padding-left: 20px

            &.mobile
                transform: translateY(calc(-100% - 20px))
                transition: transform .2s ease

                &.sticky-mobile-show
                    transform: translateY(0%)

            .owned-count
                color: $light
                font-size: 22px

                +media-phone
                    font-size: 18px

        > *:not(.owned-count)
            width: 200px

            +media($size: 460px, $minmax: 'min')
                width: 100%
                max-width: 300px

            +media-tablet
                width: 200px

            +media-ml-desktop
                width: 250px

        .owned-count
            grid-column: 1 / -1
            font-family: $font-bold
            font-size: 22px
            text-transform: uppercase
            color: $light-blue-highlight

            +media-phone
                font-size: 18px

            +media-tablet
                margin-right: auto
                font-size: 24px

    .list
        width: 100%
        padding: 20px
        padding-bottom: 45px

        display: flex
        justify-content: center
        align-items: center
        flex-wrap: wrap
        gap: 20px

        +media-tablet
            display: grid
            grid-template-columns: repeat(auto-fill, 200px)

    .no-results
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        gap: 25px

        padding-top: 20px

        +media-mobile
            min-height: 80vh

        p
            font-family: $font-heavy
            font-size: 22px
            text-transform: uppercase
            text-align: center
            color: $blue
</style>

<script setup lang="ts">
import type { HeroData } from '~/assets/data/common';
import { getAllCategories, getAllSources, getAllThemes, getCategoryIcon, getHeroCostumes, RARITY_ORDER, type Costume } from '~/assets/data/cosmetics/costumes/costumes';
import CostumeDetailModal from '../modals/CostumeDetailModal.vue';
import type { Option } from '../form/Dropdown.vue';

const props = defineProps<{
    hero: HeroData,
}>();

const activeFilters = defineModel<string[]>({ required: true });

const { openModal } = useModalManager();

const cosmeticsControls = useTemplateRef('cosmeticsControls');
const filterDropdown = useTemplateRef('filter-dropdown');
const sortDropdown = useTemplateRef('sort-dropdown');
const mobile = isMobile();

useStickyBar(cosmeticsControls, {
    topOffset: () => mobile.value ? -65 : 0,
    scrollToTopOnInit: true,
    showClass: 'sticky-mobile-show',
    mobileOnly: true,
    onScrollDownWhileSticky: () => {
        if (!filterDropdown.value?.mobileOverlayEnabled)
            filterDropdown.value?.setExpanded(false);

        sortDropdown.value?.setExpanded(false);
    },
});

const ownedCostumes = useLocalStorage<string[]>(() => `cosmetics_owned_${props.hero.id}`, []);
const heroCostumes = computed(() => getHeroCostumes(props.hero.id));

const costumeSort = ref('rarity');

const FILTER_RARITY_OPTS: Option[] = [
    {
        leftIcon: {
            key: 'rarityLegendary',
            size: 20
        },

        label: `LEGENDARY`,
        value: '__rarity_legendary',

        whenSelected: { showOnlyLeftIcon: true }
    },
    {
        leftIcon: {
            key: 'rarityEpic',
            size: 20
        },

        label: `EPIC`,
        value: '__rarity_epic',

        whenSelected: { showOnlyLeftIcon: true }
    },
    {
        leftIcon: {
            key: 'rarityRare',
            size: 20
        },

        label: `RARE`,
        value: '__rarity_rare',

        whenSelected: { showOnlyLeftIcon: true }
    },
];
const HERO_COSTUME_CATEGORIES = computed(() => getAllCategories(props.hero.id));
const HERO_COSTUME_SOURCES = computed(() => getAllSources(props.hero.id));
const HERO_COSTUME_THEMES = computed(() => getAllThemes(props.hero.id));

const filterOptions = computed<Option[]>(() => [
    { label: 'Rarity', separator: true, pushCheckedToTop: false },
    ...FILTER_RARITY_OPTS,
    { label: 'Categories', separator: 'collapsible' },
    ...HERO_COSTUME_CATEGORIES.value.map(c => ({
        leftIcon: {
            url: getCategoryIcon(c),
            size: 30
        },
        whenSelected: { showOnlyLeftIcon: true },

        value: `__category_${c}`,
        label: c,
    })),
    { label: 'Sources', separator: !!HERO_COSTUME_SOURCES.value.length ? 'collapsible' : false},
    ...HERO_COSTUME_SOURCES.value.map(s => ({
        value: `__source_${s}`,
        label: s
    })),
    { label: 'Themes', separator: !!HERO_COSTUME_THEMES.value.length ? 'collapsible' : false },
    ...HERO_COSTUME_THEMES.value.map(t => ({
        leftIcon: {
            url: `/img/cosmetics/themes/${toKebabCase(t)}.webp`,
            size: 23
        },
        whenSelected: { showOnlyLeftIcon: true },

        value: `__theme_${t}`,
        label: t,
    })),
]);
function shouldConcatenateSelectedFilters(selected: Option[]) {
    return {
        enabled: selected.every(opt => 
            (opt.whenSelected && (opt.whenSelected as { showOnlyLeftIcon: boolean }).showOnlyLeftIcon)
         && opt.leftIcon),
        max: 4
    }
}

const sortDropdownOptions = [
    { value: 'rarity',    label: 'SORT BY RARITY' },
    { value: 'date-desc', label: 'SORT BY NEWEST' },
    { value: 'date-asc',  label: 'SORT BY OLDEST' },
];

const sortedCostumes = computed(() => {
    let list = heroCostumes.value.slice();

    const rarityFilters = activeFilters.value.filter(f => f.startsWith('__rarity_'))
                                            .map(f => f.substring('__rarity_'.length));
    const categoryFilters = activeFilters.value.filter(f => f.startsWith('__category_'))
                                            .map(f => f.substring('__category_'.length));
    const sourceFilters = activeFilters.value.filter(f => f.startsWith('__source_'))
                                            .map(f => f.substring('__source_'.length));
    const themeFilters = activeFilters.value.filter(f => f.startsWith('__theme_'))
                                            .map(f => f.substring('__theme_'.length));

    list = list.filter(c => {
        const checks: (() => boolean)[] = [
            () => rarityFilters.length ? rarityFilters.includes(c.rarity) : true,
            () => categoryFilters.length ? categoryFilters.includes(c.category) : true,
            () => sourceFilters.length ? sourceFilters.includes(c.source ?? '') : true,
            () => themeFilters.length ? themeFilters.includes(c.theme ?? '') : true,
        ]

        for (const check of checks) {
            const allowed = check();
            if (!allowed)
                return false;
        }

        return true;
    });

    list.sort((a, b) => {
        if (costumeSort.value === 'rarity') {
            return (RARITY_ORDER.indexOf(a.rarity) ?? 3) - (RARITY_ORDER.indexOf(b.rarity) ?? 3);
        }

        const da = a.releaseDate ?? '';
        const db = b.releaseDate ?? '';
        return costumeSort.value === 'date-asc' ? da.localeCompare(db) : db.localeCompare(da);
    });

    return list;
});

function toggleCostumeOwned(id: string) {
    const index = ownedCostumes.value.indexOf(id);
    if (index === -1)
        ownedCostumes.value.push(id);
    else
        ownedCostumes.value.splice(index, 1);
}

function openCostumeDetail(costume: Costume) {
    openModal(CostumeDetailModal, {
        costume,
        heroId: props.hero.id,
        heroColor: props.hero.color,
    })
    .promise
    .catch(() => null);
}
</script>