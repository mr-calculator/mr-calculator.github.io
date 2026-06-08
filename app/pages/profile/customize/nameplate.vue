<template>
    <div class="cosmetics-list-page simple-page no-navbar">
        <div class="bg-panes" />
        
        <div class="mobile-title dark">
            <h1>
                Customize <b>Nameplate</b>
            </h1>
        </div>
        <UiSeparator class="mobile-separator with-spacing" dark />

        <main>
            <PanelCosmeticsListView
                :class="{'show-mobile': showListMobile}"

                display="grid"
                :items="nameplatesAsItems"
                :grouping="GROUPING"
                :sorting="SORTING"
                :filter-sections="FILTER_SECTIONS"
                :search="searchNameplate"
                filterOwned
                :ownedItems="ownedNameplates"
                :equippedItem="profile.nameplate"

                v-model="selectedNameplateId"
                @item-click="nameplateClick"
                @item-rick-click="toggleNameplateOwned($event.id)"
            >
                <template #empty-state="{ resetFilters }">
                    <p>No nameplates match your filters</p>
                    <FormButton
                        size="tiny"
                        @click="resetFilters"
                    >
                        Reset filters
                    </FormButton>
                </template>
            </PanelCosmeticsListView>
            <div
                ref="selected-wrapper"
                :class="{'selected-wrapper': 1, 'show-mobile': !showListMobile}"
            >
                <div class="back" @click="showListMobile = true">
                    <Tex
                        image="arrowLeft"
                        color="var(--light-blue)"

                        width="20px"
                        height="20px"
                    />
                    BACK TO NAMEPLATES
                </div>

                <div class="showcase-wrapper">
                    <div class="nameplate-container">
                        <ClientOnly>
                            <img
                                v-if="selectedNameplate.type == 'normal'"
                                :src="`/img/cosmetics/items/nameplates/${selectedNameplate.id}.webp`"
                                width="500px"
                                :alt="selectedNameplate.name"
                                draggable="false"
                            />
                            <img
                                v-else-if="selectedNameplate.type == 'animated'"
                                :src="`/img/cosmetics/items/nameplates/${selectedNameplate.id}_animated.webp`"
                                width="500px"
                                :alt="selectedNameplate.name"
                                draggable="false"
                            />
                            <template #fallback>
                                <img
                                    :src="`/img/cosmetics/items/nameplates/${DEFAULT_NAMEPLATE_ID}.webp`"
                                    width="500px"
                                    alt="Nameplate Preview"
                                    draggable="false"
                                />
                            </template>
                        </ClientOnly>
                    </div>
                </div>
                <ClientOnly>
                    <PanelCosmeticsItemDetails
                        ref="details-panel"
                        :selected-item="nameplateToCosmeticItem(selectedNameplate)"
                        :owned-items="ownedNameplates"

                        :get-hero-for-item="id => heroByInternalId[id.slice(1, 5)]"

                        equippable
                        :equipped="selectedNameplate.id == profile.nameplate"

                        @toggle-owned="toggleNameplateOwned"
                        @toggle-equipped="equipProfileNameplate"
                    />
                </ClientOnly>
            </div>
        </main>
    </div>
</template>

<style src="@/assets/style/pages/customize/template.sass" scoped></style>

<style lang="sass" scoped>
.nameplate-container
    width: 100%
    max-width: 525px
    padding: 7.5px 12.5px

    background: var(--tex-nameplateBackground) no-repeat
    background-size: 100% 100%
    background-position: center

    display: flex
    justify-content: center
    align-items: center

    +media-2k-desktop
        max-width: 725px

    img
        display: block

        width: 100%
        height: auto
        user-select: none
        -webkit-user-drag: none
</style>

<script setup lang="ts">
import { DEFAULT_PREFERENCES_STORE, DEFAULT_PROFILE_STORE, FILTER_RARITY_OPTS, PreferencesStoreSchema, ProfileStoreSchema, RARITY_DATA, type PreferencesStore } from '~/assets/data/common';
import { HERO_LIST } from '~/assets/data/heroes';
import { DEFAULT_NAMEPLATE_ID, getAllPropertyValues, getCategoryIcon, NAMEPLATES, type Nameplate} from '~/assets/data/cosmetics/nameplates/nameplates';
import type { CosmeticItem, FilterSection, GroupingConfig, SortingConfig } from '~/components/panel/cosmetics/ListView.vue';

const title = `Nameplates | MR Proficiency Calculator`
const description = `View all nameplates and icons in the game. Equip your preferred icon.`
useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogUrl: useCanonicalUrl('profile', 'nameplate'),

    twitterTitle: title,
    twitterDescription: description,
});
useHead({
    link: [
        {
            rel: "canonical",
            href: useCanonicalUrl('profile', 'nameplate')
        }
    ]
});

definePageMeta({
    layout: 'profile-layout'
});

const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);
onMounted(() => {
    preferences.value.sawNameplatesPage = true;
});

const nameplates = NAMEPLATES();
const nameplatesById = Object.fromEntries(nameplates.map(np => [ np.id, np ]));

const ownedNameplates = useLocalStorage<string[]>('nameplates_owned', [DEFAULT_NAMEPLATE_ID]);
function toggleNameplateOwned(id: string) {
    const index = ownedNameplates.value.indexOf(id);
    if (index === -1)
        ownedNameplates.value.push(id);
    else
        ownedNameplates.value.splice(index, 1);
}
const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);
function equipProfileNameplate(id: string) {
    profile.value.nameplate = id;
}

function nameplateToCosmeticItem(np: Nameplate) {
    const owned = ownedNameplates.value.includes(np.id);

    return {
        ...np,
        image: `/img/cosmetics/items/icons/${np.id}.webp`,
        tooltip: {
            text: `${owned ? 'Unmark' : 'Mark'} as <b>owned</b>`,
            icon: 'mouseRight'
        }
    }
}

const nameplatesAsItems = computed<CosmeticItem[]>(() => nameplates.map(nameplateToCosmeticItem));

const heroByInternalId = Object.fromEntries(HERO_LIST.map(hero => [ hero.internalId!, hero ]));

function sortGroup(
    a: { id: string, name: string },
    b: { id: string, name: string }
) {
    if (a.id === '__misc')
        return 1;
    if (b.id === '__misc')
        return -1;

    return a.name.localeCompare(b.name);
}

const GROUPING: GroupingConfig = {
    default: 'hero',
    items: {
        none: {
            name: 'No Grouping',
            icon: 'filterNoGroup',

            groupKey: () => '__all',
            groupName: () => 'All'
        },
        hero: {
            name: 'Hero',
            icon: 'filterHero',

            groupCategoryOptions: {
                collapsible: true,
                showCount: true,
                hideName: true,
            },

            groupKey: (item) => {
                const heroId = item.id.slice(1, 5);
                return heroByInternalId[heroId] ? `id_${heroId}` : '__misc';
            },
            groupName: (key) => heroByInternalId[key.slice(3, 7)]?.name ?? 'Other',

            sortGroup
        },
        category: {
            name: 'Category',
            icon: 'filterCategories',

            groupCategoryOptions: {
                collapsible: true,
                showCount: true,
                hideName: true,
            },

            groupKey: (item) => item.category ?? '__misc',
            groupName: (key) => key === '__misc' ? 'Other' : key,
        },
        source: {
            name: 'Source',
            icon: 'filterSource',

            groupCategoryOptions: {
                collapsible: true,
                showCount: true,
                hideName: true,
            },

            groupKey: (item) => item.source ?? '__misc',
            groupName: (key) => key === '__misc' ? 'Other' : key,

            sortGroup
        },
        theme: {
            name: 'Theme',
            icon: 'filterTheme',

            groupCategoryOptions: {
                collapsible: true,
                showCount: true,
                hideName: true,
            },

            groupKey: (item) => item.theme ?? '__misc',
            groupName: (key) => key === '__misc' ? 'Other' : key,

            sortGroup
        }
    }
}


function sortByDate(a: CosmeticItem, b: CosmeticItem, direction: -1|1) {
    const aTime = a.releaseDate ? new Date(a.releaseDate + 'T00:00:00').getTime() : null;
    const bTime = b.releaseDate ? new Date(b.releaseDate + 'T00:00:00').getTime() : null;

    if (!aTime)
        return 1;
    if (!bTime)
        return -1;

    return (aTime - bTime) * direction;
}
function sortByRarity(a: CosmeticItem, b: CosmeticItem, direction: -1|1) {
    const sort = RARITY_DATA[a.rarity].order - RARITY_DATA[b.rarity].order;
    if (sort == 0)
        return a.name.localeCompare(b.name) * direction;

    return sort * direction;
}
function sortByName(a: CosmeticItem, b: CosmeticItem, direction: -1|1) {
    return a.name.localeCompare(b.name) * direction;
}

const SORTING: SortingConfig = {
    default: 'date_desc',
    items: {
        date_asc: {
            name: 'Released Asc',
            icon: 'filterTimeDown',
            compareFn: (a, b) => sortByDate(a, b, 1)
        },
        date_desc: {
            name: 'Released Desc',
            icon: 'filterTimeUp',
            compareFn: (a, b) => sortByDate(a, b, -1)
        },
        rarity_asc: {
            name: 'Rarity Asc',
            icon: 'filterRaritySortDown',
            compareFn: (a, b) => sortByRarity(a, b, 1)
        },
        rarity_desc: {
            name: 'Rarity Desc',
            icon: 'filterRaritySortUp',
            compareFn: (a, b) => sortByRarity(a, b, -1)
        },
        name_asc: {
            name: 'A-Z',
            icon: 'sortAZ',
            compareFn: (a, b) => sortByName(a, b, 1)
        },
        name_desc: {
            name: 'Z-A',
            icon: 'sortZA',
            compareFn: (a, b) => sortByName(a, b, -1)
        },
    }
}


const nameplateCategories = getAllPropertyValues('category');
const nameplateSources = getAllPropertyValues('source');
const nameplateThemes = getAllPropertyValues('theme');
const FILTER_SECTIONS = computed<FilterSection[]>(() => [
    {
        key: 'rarity',
        category: { 
            label: 'Rarity', separator: true, pushCheckedToTop: false
        },
        options: FILTER_RARITY_OPTS(),
        test: (item, values) => values.includes(item.rarity)
    },
    {
        key: 'category',
        category: {
            label: 'Categories', separator: 'collapsible'
        },
        options: nameplateCategories.map(c => ({
            leftIcon: {
                url: getCategoryIcon(c),
                size: 30
            },
            whenSelected: { showOnlyLeftIcon: true },

            value: c,
            label: c,
        })),
        test: (item, values) => values.includes(item.category ?? '')
    },
    {
        key: 'source',
        category: {
            label: 'Sources', separator: nameplateSources.length ? 'collapsible' : false
        },
        options: nameplateSources
            .toSorted((a,b) => a.localeCompare(b))
            .map(s => ({
                value: s,
                label: s
            })),
        test: (item, values) => values.includes(item.source ?? '')
    },
    {
        key: 'theme',
        category: {
            label: 'Themes', separator: nameplateThemes.length ? 'collapsible' : false
        },
        options: nameplateThemes
            .toSorted((a,b) => a.localeCompare(b))
            .map(t => ({
                leftIcon: {
                    url: `/img/cosmetics/themes/${toKebabCase(t)}.webp`,
                    size: 23
                },
                whenSelected: { showOnlyLeftIcon: true },

                value: t,
                label: t,
            })),
        test: (item, values) => values.includes(item.theme ?? '')
    },
    {
        key: 'hero',
        category: {
            label: 'Heroes', separator: 'collapsible'
        },
        options: HERO_LIST
            .toSorted((a,b) => a.name.localeCompare(b.name))
            .map(h => ({
                leftIcon: {
                    url: `${h.dataDir}head.webp`,
                    size: 30
                },
                whenSelected: { showOnlyLeftIcon: true },

                value: h.id,
                label: h.name,
            })),
        test: (item, values) => values.includes(heroByInternalId[item.id.slice(1, 5) ?? '']?.id ?? '')
    },
]);

const searchNameplate = (item: CosmeticItem, searchText: string) => {
    const hero = heroByInternalId[item.id.slice(1, 5)];

    if (item.name.toLowerCase().includes(searchText.toLowerCase())
     || item.category?.toLowerCase().includes(searchText.toLowerCase())
     || item.source?.toLowerCase().includes(searchText.toLowerCase())
     || item.sourceFull?.toLowerCase().includes(searchText.toLowerCase())
     || item.theme?.toLowerCase().includes(searchText.toLowerCase())
     || (hero && hero.name.toLowerCase().includes(searchText.toLowerCase()))
    )
        return true;

    return false;
};


const selectedWrapper = useTemplateRef('selected-wrapper');
const detailsPanel = useTemplateRef('details-panel');

const selectedNameplateId = ref(profile.value.nameplate ?? DEFAULT_NAMEPLATE_ID);
watch(() => profile.value.nameplate, (nameplate) => selectedNameplateId.value = nameplate ?? DEFAULT_NAMEPLATE_ID);
const selectedNameplate = computed(() => nameplatesById[selectedNameplateId.value] ?? nameplatesById[DEFAULT_NAMEPLATE_ID]!);

const showListMobile = ref(true);

function nameplateClick() {
    selectedWrapper.value?.scrollTo({ top: 0, behavior: 'instant' });
    detailsPanel.value?.scrollInfoContainer({ top: 0, behavior: 'instant' });

    showListMobile.value = false;
}


</script>