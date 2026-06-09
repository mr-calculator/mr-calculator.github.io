<template>
    <div class="cosmetics-list-page simple-page no-navbar">
        <div class="bg-panes" />

        <div class="mobile-title dark">
            <h1>
                Customize <b>Frame</b>
            </h1>
        </div>
        <UiSeparator class="mobile-separator with-spacing" dark />

        <main>
            <PanelCosmeticsListView
                :class="{'show-mobile': showListMobile}"

                display="grid"
                :items="framesAsItems"
                :grouping="GROUPING"
                :sorting="SORTING"
                :filter-sections="FILTER_SECTIONS"
                :search="searchFrame"
                filterOwned
                :ownedItems="ownedFrames"
                :equippedItem="profile.frame"

                v-model="selectedFrameId"
                @item-click="frameClick"
                @item-rick-click="toggleFrameOwned($event.id)"
            >
                <template #empty-state="{ resetFilters }">
                    <p>No frames match your filters</p>
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
                    <div class="frame-container">
                        <ClientOnly>
                            <div class="nameplate">
                                <img
                                    v-if="equippedNameplate.type == 'normal'"
                                    :src="`/img/cosmetics/items/nameplates/${equippedNameplate.id}.webp`"
                                    width="500px"
                                    :alt="equippedNameplate.name"
                                    draggable="false"
                                />
                                <img
                                    v-else-if="equippedNameplate.type == 'animated'"
                                    :src="`/img/cosmetics/items/nameplates/${equippedNameplate.id}_animated.webp`"
                                    width="500px"
                                    :alt="equippedNameplate.name"
                                    draggable="false"
                                />
                            </div>

                            <img
                                :src="frameToCosmeticItem(selectedFrame, true).image"
                                width="500px"
                                :alt="selectedFrame.name"
                                draggable="false"
                            />

                            <div class="profile-info">
                                <div class="level-name">
                                    <p class="with-separator">{{ profile.level }}</p>
                                    <p>{{ profile.name }}</p>
                                </div>
                                <div v-if="profile.title" class="title">
                                    <p>{{ profile.title }}</p>
                                    <!-- TODO this should be an id, not the plain text -->
                                </div>
                            </div>
                        </ClientOnly>
                    </div>
                </div>
                <ClientOnly>
                    <PanelCosmeticsItemDetails
                        ref="details-panel"
                        :selected-item="frameToCosmeticItem(selectedFrame)"
                        :owned-items="ownedFrames"

                        equippable
                        unequippable
                        :equipped="selectedFrame.id == profile.frame"

                        @toggle-owned="toggleFrameOwned"
                        @toggle-equipped="toggleProfileFrame"
                    />
                </ClientOnly>
            </div>
        </main>
    </div>
</template>

<style src="@/assets/style/pages/customize/template.sass" scoped></style>

<style lang="sass" scoped>
.cosmetics-list-page
    ::v-deep(.cosmetics-items) li
        padding: 5px

        +hover
            padding: 3px

.frame-container
    position: relative
    width: 100%
    max-width: 625px

    display: flex
    justify-content: center
    align-items: center

    +media-2k-desktop
        max-width: 725px

    .nameplate
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%

        display: flex
        justify-content: center
        align-items: start
        padding: 4px 5px 0 5px

        mask: var(--tex-profileCardMask) no-repeat
        mask-size: 100% 100%
        mask-position: calc(50% + 2px) 50%

        img
            width: 100% - 6.4%

    > img
        position: relative
        display: block

        width: 100%
        height: auto
        user-select: none
        -webkit-user-drag: none

        z-index: 2

    .profile-info
        position: absolute
        left: 0
        bottom: 2.9%
        width: 100%
        height: 18%

        padding: 0 10.7% 0 5.7%

        display: flex
        justify-content: space-between
        align-items: center
        gap: 10px

        font-family: $font-body
        font-size: 23px
        font-weight: 600
        letter-spacing: .5px
        color: #bebfcb

        z-index: 3

        +media($minmax: 'max', $size: 1250px)
            font-size: 20px
        +media($minmax: 'max', $size: 1050px)
            font-size: 18px

        +media-mobile
            font-size: 24px

        +media($minmax: 'max', $size: 630px)
            font-size: 20px
        +media($minmax: 'max', $size: 520px)
            font-size: 18px
        +media($minmax: 'max', $size: 450px)
            font-size: 17px
        +media($minmax: 'max', $size: 400px)
            font-size: 16px
        +media($minmax: 'max', $size: 390px)
            font-size: 15px
        +media($minmax: 'max', $size: 365px)
            font-size: 14px
        +media($minmax: 'max', $size: 350px)
            font-size: 13px
        +media($minmax: 'max', $size: 335px)
            font-size: 12px

        .level-name
            height: 100%

            display: flex
            justify-content: start
            align-items: center
            gap: 14px

            overflow-x: clip
            white-space: nowrap
            text-overflow: clip

            p.with-separator
                position: relative

                &::after
                    content: ""
                    position: absolute
                    top: 50%
                    right: -7px
                    transform: translateY(-50%)

                    width: 0px
                    height: 40%
                    border: 1px solid #a5a6b17a

        .title
            font-family: $font-bold

            overflow-x: clip
            white-space: nowrap
            text-overflow: clip

            +media($minmax: 'max', $size: 550px)
                display: none
</style>

<script setup lang="ts">
import { DEFAULT_PREFERENCES_STORE, DEFAULT_PROFILE_STORE, FILTER_RARITY_OPTS, PreferencesStoreSchema, ProfileStoreSchema, RARITY_DATA, type PreferencesStore } from '~/assets/data/common';
import type { CosmeticItem, FilterSection, GroupingConfig, SortingConfig } from '~/components/panel/cosmetics/ListView.vue';
import { FRAMES, getAllPropertyValues, type Frame } from '~/assets/data/cosmetics/frames/frames';
import { NAMEPLATES } from '~/assets/data/cosmetics/nameplates/nameplates';

const title = `Frames | MR Proficiency Calculator`
const description = `View all nameplate and icon frames in the game. Equip your preferred frame.`
useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogUrl: useCanonicalUrl('profile', 'frame'),

    twitterTitle: title,
    twitterDescription: description,
});

useHead({
    link: [
        {
            rel: "canonical",
            href: useCanonicalUrl('profile', 'frame')
        }
    ]
})

definePageMeta({
    layout: 'profile-layout'
});

const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);
onMounted(() => {
    preferences.value.sawFramesPage = true;
});

const frames = FRAMES();
const framesById = Object.fromEntries(frames.map(f => [ f.id, f ]));

const ownedFrames = useLocalStorage<string[]>('frames_owned', []);
function toggleFrameOwned(id: string) {
    const index = ownedFrames.value.indexOf(id);
    if (index === -1)
        ownedFrames.value.push(id);
    else
        ownedFrames.value.splice(index, 1);
}

const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);
function toggleProfileFrame(id: string) {
    if (profile.value.frame === id)
        profile.value.frame = undefined;
    else
        profile.value.frame = id;
}

function frameToCosmeticItem(f: Frame, large = false) {
    const name = large ? 'img_nameplateframe_' : 'img_playerheadframe_';

    const owned = ownedFrames.value.includes(f.id);

    return {
        ...f,
        image: `/img/cosmetics/items/frames/${large ? 'nameplate' : 'icon'}/${name}${f.id}.png`,
        tooltip: {
            text: `${owned ? 'Unmark' : 'Mark'} as <b>owned</b>`,
            icon: 'mouseRight'
        }
    }
}

const framesAsItems = computed<CosmeticItem[]>(() => frames.map(f => frameToCosmeticItem(f)));

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
    default: 'none',
    items: {
        none: {
            name: 'No Grouping',
            icon: 'filterNoGroup',

            groupKey: () => '__all',
            groupName: () => 'All'
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


const frameCategories = getAllPropertyValues('category');
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
        options: frameCategories.map(c => ({
            value: c,
            label: c,
        })),
        test: (item, values) => values.includes(item.category ?? '')
    }
]);

const searchFrame = (item: CosmeticItem, searchText: string) => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
 || !!item.category?.toLowerCase().includes(searchText.toLowerCase())
 || !!item.source?.toLowerCase().includes(searchText.toLowerCase())


const selectedWrapper = useTemplateRef('selected-wrapper');
const detailsPanel = useTemplateRef('details-panel');

const lastFrame = frames.at(-2); // since default sorting is by date, last item gets placed (visually) at length - 2
const selectedFrameId = ref(profile.value.frame ?? lastFrame!.id);
const selectedFrame = computed(() => framesById[selectedFrameId.value]!);

const showListMobile = ref(true);

function frameClick() {
    selectedWrapper.value?.scrollTo({ top: 0, behavior: 'instant' });
    detailsPanel.value?.scrollInfoContainer({ top: 0, behavior: 'instant' });

    showListMobile.value = false;
}


const nameplates = NAMEPLATES();
const equippedNameplate = computed(() => nameplates.find(np => profile.value.nameplate == np.id)!);

</script>