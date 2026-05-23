<template>
    <div class="costume-list">
        <div
            ref="cosmeticsControls"
            :class="{ 'cosmetics-controls': 1, mobile }"
        >
            <p class="owned-count">
                <ClientOnly>
                    <span class="owned">{{ ownedCostumes.length }}</span>/<span class="total">{{ cosmeticsTotal }} OWNED</span>
                </ClientOnly>
            </p>
            <FormDropdown
                :options="filterOptions"
                v-model="activeFilters"
                placeholder="FILTER"
                multi
                small
            />
            <FormDropdown
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
                :src="`/img/heroes/data/${hero.id}/costumes/${costume.id}.webp`"
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
            font-family: MarvelRivalsBold
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
        flex-direction: column
        flex-wrap: nowrap
        align-items: center
        gap: 20px

        +media-tablet
            display: grid
            grid-template-columns: repeat(auto-fill, 200px)
            justify-content: center

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
            font-family: MarvelRivalsHeavy
            font-size: 22px
            text-transform: uppercase
            text-align: center
            color: $blue
</style>

<script setup lang="ts">
import type { HeroData } from '~/assets/data/common';
import { getAllCategories, getAllSources, getAllThemes, getHeroCostumes, type Costume } from '~/assets/data/costumes';
import CostumeDetailModal from '../modals/CostumeDetailModal.vue';

const props = defineProps<{
    hero: HeroData
}>();

const { openModal } = useModalManager();

const cosmeticsControls = useTemplateRef('cosmeticsControls');
const scroller = ref<Window|HTMLElement>();
const mobile = isMobile();

function findScroller() {
    scroller.value = getScrollParent(cosmeticsControls.value);
    if ((scroller.value as HTMLElement).tagName === 'BODY')
        scroller.value = window;
}

await useGsap(({ scrollTrigger }) => {
    nextTick(() => {
        findScroller();

        scrollTrigger.create({
            trigger: cosmeticsControls.value,
            scroller: scroller.value,
            start: 'top 0%',
            onEnter: () => cosmeticsControls.value?.classList.add('sticky'),
            onLeaveBack: () => cosmeticsControls.value?.classList.remove('sticky'),
        });
    });

    let lastKnownScrollY = 0;
    useEvent('scroll', () => {
        if (!mobile.value)
            return;

        const scrollY = (scroller.value as HTMLElement).scrollTop ?? (scroller.value as Window).scrollY;
        const deltaY = scrollY - lastKnownScrollY;
        lastKnownScrollY = scrollY;

        // scrolling down
        if (deltaY > 0)
            cosmeticsControls.value?.classList.remove('sticky-mobile-show');
        else
            cosmeticsControls.value?.classList.add('sticky-mobile-show');
    }, scroller.value);
});

const ownedCostumes = useLocalStorage<string[]>(() => `cosmetics_owned_${props.hero.id}`, []);
const heroCostumes = computed(() => getHeroCostumes(props.hero.id));
const cosmeticsTotal = computed(() => heroCostumes.value.length);

const activeFilters = ref<string[]>([]);
const costumeSort = ref('rarity');

const FILTER_RARITY_OPTS = [
    {
        label: `<div class="icon" style="--img-bg:var(--tex-rarityLegendary); --width:20px"></div> LEGENDARY`,
        value: 'legendary'
    },
    {
        label: `<div class="icon" style="--img-bg:var(--tex-rarityEpic); --width:20px"></div> EPIC`,
        value: 'epic'
    },
    {
        label: `<div class="icon" style="--img-bg:var(--tex-rarityRare); --width:20px"></div> RARE`,
        value: 'rare'
    },
]

const HERO_COSTUME_CATEGORIES = computed(() => getAllCategories(props.hero.id));
const HERO_COSTUME_SOURCES = computed(() => getAllSources(props.hero.id));
const HERO_COSTUME_THEMES = computed(() => getAllThemes(props.hero.id));

const filterOptions = [
    { label: 'Rarity', separator: true },
    ...FILTER_RARITY_OPTS,
    { label: 'Categories', separator: true },
    ...HERO_COSTUME_CATEGORIES.value.map(c => ({
        value: c,
        label: c
    })),
    { label: 'Sources', separator: !!HERO_COSTUME_SOURCES.value.length },
    ...HERO_COSTUME_SOURCES.value.map(s => ({
        value: s,
        label: s
    })),
    { label: 'Themes', separator: !!HERO_COSTUME_THEMES.value.length },
    ...HERO_COSTUME_THEMES.value.map(t => ({
        value: t,
        label: `<div class="icon" style="--img-bg:url('${`/img/heroes/costume-themes/${toKebabCase(t)}.webp`}'); --width:23px"></div> ${t}`,
    })),
];
const sortDropdownOptions = [
    { value: 'rarity',    label: 'SORT BY RARITY' },
    { value: 'date-desc', label: 'SORT BY NEWEST' },
    { value: 'date-asc',  label: 'SORT BY OLDEST' },
];

const RARITY_VALUES = new Set(['legendary', 'epic', 'rare']);

const RARITY_ORDER: Record<string, number> = { legendary: 0, epic: 1, rare: 2 };
const sortedCostumes = computed(() => {
    let list = heroCostumes.value.slice();

    const rarityFilters = activeFilters.value.filter(f => RARITY_VALUES.has(f));
    const categoryFilters = activeFilters.value.filter(f => HERO_COSTUME_CATEGORIES.value.includes(f));
    const sourceFilters = activeFilters.value.filter(f => HERO_COSTUME_SOURCES.value.includes(f));
    const themeFilters = activeFilters.value.filter(f => HERO_COSTUME_THEMES.value.includes(f));

    if (rarityFilters.length)
        list = list.filter(c => rarityFilters.includes(c.rarity));
    if (categoryFilters.length)
        list = list.filter(c => categoryFilters.includes(c.category));
    if (sourceFilters.length)
        list = list.filter(c => sourceFilters.includes(c.source ?? ''));
    if (themeFilters.length)
        list = list.filter(c => themeFilters.includes(c.theme ?? ''));

    list.sort((a, b) => {
        if (costumeSort.value === 'rarity') {
            return (RARITY_ORDER[a.rarity] ?? 3) - (RARITY_ORDER[b.rarity] ?? 3);
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