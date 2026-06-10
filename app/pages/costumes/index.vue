<template>
    <div class="costumes-page simple-page">
        <div class="bg-panes" />
        
        <div :class="{'mobile-title': 1, dark: 1, small: mode == 'collection'}">
            <h1>
                Costumes
            </h1>
        </div>
        <UiSeparator v-if="mode != 'collection'" class="mobile-separator with-spacing" dark />

        <div class="container">
            <ClientOnly>
                <div
                    v-if="mode !== 'collection'"
                    ref="cosmeticsControls"
                    class="cosmetics-controls"
                >
                    <p class="owned-count">
                        <ClientOnly>
                            <span class="owned">{{ ownedCostumesCount }}</span>/<span class="total">{{ costumes.length }} OWNED</span>
                        </ClientOnly>
                    </p>

                    <div class="search-sort">
                        <FormSearchBox
                            ref="searchBox"
                            v-model="searchText"
                        />

                        <div class="dropdown-like" @click="toggleFiltersVisible">
                            <div class="content">
                                {{ filtersVisible ? 'HIDE FILTERS' : 'SHOW FILTERS' }}
                            </div>
                            <div :class="{icon: 1, up: filtersVisible}" />
                        </div>

                        <div class="options">
                            <FormDropdown
                                :class="{breakHidden: !filtersVisible}"
                                ref="sort-dropdown"

                                :options="sortDropdownOptions"
                                v-model="costumeSort"
                                small
                            />
                            <FormCheckbox
                                :class="{breakHidden: !filtersVisible}"

                                v-model="filterOwned"

                                size="medium"
                                color-scheme="dark"
                            >
                                OWNED
                            </FormCheckbox>
                        </div>
                    </div>

                    <div :class="{ filters: 1, breakHidden: !filtersVisible }">
                        <FormDropdown
                            ref="filter-dropdown"
                            v-for="({active, options, placeholder, props}) in dropdowns"

                            :options="options.value"
                            :placeholder="placeholder"

                            :model-value="active.value"
                            @update:model-value="active.value = ($event as string[]) ?? []"

                            small

                            v-bind="props"
                        />

                        <div
                            v-if="mode == 'default'"
                            class="dropdown-like"
                            @click="mode = 'make-collection'"
                        >
                            <div class="content">
                                MAKE COLLECTION
                            </div>
                            <Tex
                                image="plus"
                                color="#fff"

                                width="20px"
                                height="20px"
                            />
                        </div>
                    </div>

                    <div v-if="mode == 'make-collection'" class="make-collection">
                        <FormCheckbox
                            v-model="previewCollection"

                            size="medium"
                            color-scheme="dark"
                        >
                            PREVIEW
                        </FormCheckbox>
                        <div class="buttons">
                            <div
                                class="dropdown-like fit-content"
                                @click="cancelCollection"
                            >
                                <div class="content">
                                    CANCEL
                                </div>
                                <Tex
                                    image="close"
                                    color="#fff"

                                    width="20px"
                                    height="20px"
                                />
                            </div>
                            <div
                                class="dropdown-like fit-content"
                                @click="makeCollection"
                            >
                                <div class="content">
                                    DONE
                                </div>
                                <Tex
                                    image="dropdownCheck"
                                    color="#fff"

                                    width="20px"
                                    height="20px"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="mode == 'collection' && collection" class="collection-title dark">
                    <p>
                        <span>{{ collectionOwnerPossesive }}</span> Collection
                    </p>
                    <h2>
                        {{ collection.title }}
                    </h2>
                    <FormDropdown
                        class="settings"
                        :options="settingsOptions"
                        :placeholder="{
                            leftIcon: {
                                key: 'cog',
                                size: 30,
                            }
                        }"

                        :model-value="''"
                        @update:model-value="selectOption($event as 'add'|'edit'|'delete')"

                        small
                        square
                    />
                    <UiSeparator class="with-spacing" dark />
                </div>
            </ClientOnly>
            <div v-if="sortedCostumes.length" class="list">
                <UiVirtualizedScroll
                    :items="sortedCostumes"
                    key-field-id="id"
                    :item-size="{ width: 200, height: 300}"

                    v-slot="{ item: costume }"
                >
                    <PanelCostumeCard
                        :name="costume.name"
                        :src="`/img/heroes/data/${costume.hero.id}/costumes/${costume.id}_200.webp`"
                        :rarity="costume.rarity"
                        :checked="mode == 'make-collection' ? collectionItems.has(costume.id) : costumeOwned(costume)"
                        :display-checkbox="mode != 'make-collection'"
                        :color="costume.hero.color"

                        @toggle="toggleCostumeOwned(costume.heroId, costume.id)"
                        @click="itemClick(costume)"
                    />
                </UiVirtualizedScroll>
            </div>
            <div v-else class="no-results">
                <template
                    v-if="mode !='make-collection'"
                >
                    <p>No costumes match your filters</p>
                    <FormButton
                        size="tiny"
                        @click="resetFilters"
                    >
                        Reset filters
                    </FormButton>
                </template>
                <template v-else>
                    <p>You have no items in your collection.</p>
                </template>
            </div>
        </div>
    </div>
</template>

<style src="@/assets/style/pages/costumes.sass" scoped></style>

<script setup lang="ts">
import { DEFAULT_PREFERENCES_STORE, DEFAULT_PROFILE_STORE, PreferencesStoreSchema, ProfileStoreSchema, type HeroData, type PreferencesStore } from '~/assets/data/common';
import { CostumeCollectionStoreSchema, getAllCategories, getAllSources, getAllThemes, getCategoryIcon, getCostumesAsList, RARITY_ORDER, type Costume, type CostumeCollection } from '~/assets/data/cosmetics/costumes/costumes';
import { HERO_LIST } from '~/assets/data/heroes';
import { type TextureKey } from '~/assets/data/textures';
import type { Option, Placeholder } from '~/components/form/Dropdown.vue';
import CollectionSetupModal from '~/components/modals/CollectionSetupModal.vue';
import ConfirmModal from '~/components/modals/ConfirmModal.vue';
import CostumeDetailModal from '~/components/modals/CostumeDetailModal.vue';

const title = `Costumes | MR Proficiency Calculator`
const description = `View and search all costumes, see details, and track your owned costumes.`
const image = useAbsoluteUrl('/img/seo/og-image-costumes.webp');
const imageAlt = `${title} — ${description}`;
useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogUrl: useCanonicalUrl('costumes'),
    ogImage: image,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: imageAlt,

    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: imageAlt,
});

useHead({
    link: [
        {
            rel: "canonical",
            href: useCanonicalUrl('costumes')
        }
    ]
})

const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);
onMounted(() => {
    preferences.value.sawCostumesPage = true;
});

const { openModal } = useModalManager();
const { notify } = useNotificationManager();

const route = useRoute();
const router = useRouter();

const collectionsStore = useLocalStorage('costume_collections', [], CostumeCollectionStoreSchema);
const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);

const cosmeticsControls = useTemplateRef('cosmeticsControls');
const filterDropdowns = useTemplateRef('filter-dropdown');
const sortDropdown = useTemplateRef('sort-dropdown');

const filtersVisible = ref(false);
const blockStickyHide = ref(0);
function toggleFiltersVisible() {
    blockStickyHide.value = 10;
    filtersVisible.value = !filtersVisible.value;
}

function setupStickyBar() {
    return useStickyBar(cosmeticsControls, {
        topOffset: -65,
        scrollToTopOnInit: true,
        blockHideRef: blockStickyHide,
        forceShowTrigger: { start: '135px 0%', showClass: 'sticky-force-show' },
        onScrollDownWhileSticky: () => {
            filterDropdowns.value?.forEach(d => {
                if (!d?.mobileOverlayEnabled)
                    d?.setExpanded(false);
            });

            sortDropdown.value?.setExpanded(false);
        },
    })
}

setupStickyBar();
onUpdated(() =>
    setupStickyBar()
)

const mode = ref<'make-collection'|'collection'|'default'>('default');

const collection = ref<CostumeCollection|null>();
const collectionOwnerPossesive = computed(() => {
    if (!collection.value || !collection.value.owner)
        return null;

    return `${collection.value.owner}${collection.value.owner.endsWith('s') ? '\'' : '\'s'}`;
})
const isOwnCollection = computed(() =>
    !!collection.value?.id && collectionsStore.value.find(c => c.id == collection.value?.id)
);

const settingsOptions = computed<Option[]>(() => {
    if (!isOwnCollection.value)
        return [
            {
                label: 'Add to your collections',
                value: 'add',
                leftIcon: {
                    key: 'plus',
                    size: 20
                }
            }
        ];
    
    return [
        {
            label: 'Edit',
            value: 'edit',
            leftIcon: {
                key: 'edit',
                size: 28
            }
        },
        {
            label: 'Delete',
            value: 'delete',
            leftIcon: {
                key: 'delete',
                size: 28
            }
        }
    ];
});

function selectOption(option: 'add'|'edit'|'delete') {
    if (option == 'add') {
        // clone collection
        const newCollection = cloneObjectRefAsRaw<CostumeCollection>(collection)!;
        // give own id
        newCollection.id = crypto.randomUUID();
        // give own name (even if it didn't exist)
        newCollection.owner = profile.value.name;

        // add to own collections
        collectionsStore.value.push(newCollection);

        // move user to own collection type page
        const ownCollectionBase64 = toBase64(JSON.stringify(newCollection));
        router.push({
            query: {
                collection: ownCollectionBase64
            }
        });

        notify(
            `Collection ${newCollection.title!} was imported successfully.`,
            3000,
            { image: 'check', color: '#458a14' }
        );
    }

    if (option == 'delete') {
        if (!collection.value?.id)
            return;

        // ask to confirm
        openModal(ConfirmModal, {
            title: `Are you sure you want to delete this collection?`,
            message: `This action is irreversible!`
        })
        .promise
        .then(() => {
            // delete collection
            const collectionIdx = collectionsStore.value.findIndex(c => c.id == collection.value!.id);
            collectionsStore.value.splice(collectionIdx, 1);

            // take user back to collections
            router.push({
                path: '/costumes/collections'
            });
        })
        .catch(() => null);
    }

    if (option == 'edit') {
        if (!collection.value?.id)
            return;

        router.push({
            query: {
                'edit-collection': collection.value.id
            }
        });

        collectionItems.value = new Set(collection.value?.items);
    }
}


function decodeCollection(collectionB64: string|undefined) {
    if (!collectionB64) {
        collection.value = null;
        mode.value = 'default';

        return;
    }
    
    mode.value = 'collection';
    collection.value = JSON.parse(fromBase64(collectionB64 as string));
}
watch(() => route.query.collection,
      (collectionB64) => decodeCollection(collectionB64 as string|undefined)
);
onMounted(() => {
    // only parse the collection query param after vue has safely hydrated the dom
    decodeCollection(route.query.collection as string|undefined);
});


const collectionItems = ref<Set<string>>(new Set());
const previewCollection = ref(false);

const checkCreateCollection = () => {
    if (route.query['create-collection'] || route.query['edit-collection']) {
        mode.value = 'make-collection';

        setTimeout(() => {
            const { 'create-collection': _, ...rest } = route.query;

            router.push({
                query: rest
            });
        }, 100);

        // set up collection items if there are none (meaning this is coming from navigation)
        if (route.query['edit-collection'] && !collectionItems.value.size) {
            const existingCollection = collectionsStore.value.find(c => c.id == route.query['edit-collection']);
            if (existingCollection)
                collectionItems.value = new Set(existingCollection.items)
        }
    }
}
watch([
    () => route.query['create-collection'],
    () => route.query['edit-collection']
], checkCreateCollection);
onMounted(checkCreateCollection);

async function makeCollection() {
    if (!collectionItems.value.size) {
        notify(
            `Your collection doesn't contain any costumes!`,
            3000,
            { image: 'warning', color: '#c94f36' }
        );

        return;
    }

    const collection: Partial<CostumeCollection> = {};
    try {
        // check if collection exists
        const editCollectionId = route.query['edit-collection'];
        let existingCollection = null;
        if (editCollectionId)
            existingCollection = collectionsStore.value.find(c => c.id == editCollectionId);

        const { title, showOwner } = await openModal(CollectionSetupModal, {
            title: `Give your collection a title`,
            inputPlaceholder: `Collection title...`,

            inputValue: existingCollection?.title ?? undefined,
            showOwner: typeof existingCollection?.owner === 'undefined'
                ? false
                : undefined
        })
        .promise as { title: string, showOwner: boolean };

        if ((title.length ?? 0) < 3 || (title.length ?? 0) > 50) {
            notify(
                `Your collection's name must be between 3 and 50 characters!`,
                3000,
                { image: 'warning', color: '#c94f36' }
            );

            return;
        }

        collection.id = existingCollection?.id ? existingCollection.id : crypto.randomUUID();
        collection.title = title;
        if (showOwner)
            collection.owner = profile.value.name;
        collection.items = Array.from(collectionItems.value);

        // remove collection if it exists and replace it
        if (existingCollection) {
            const collectionIdx = collectionsStore.value.findIndex(c => c.id == collection.id);
            collectionsStore.value.splice(collectionIdx, 1);
        }

        // add collection to local storage
        collectionsStore.value.push(cloneObjectRefAsRaw<CostumeCollection>(collection)!);
        notify(
            existingCollection
            ? `Collection ${collection.title!} was modified successfully.`
            : `Collection ${collection.title!} was created successfully.`,
            5000,
            { image: 'check', color: '#458a14' }
        );

        // create an own base64 string to show collection as own
        const ownCollectionBase64 = toBase64(JSON.stringify(collection));


        // create share link without id
        delete collection.id;
        const collectionBase64 = toBase64(JSON.stringify(collection));
        setClipboard(`${config.domainHttp}/costumes?collection=${collectionBase64}`);

        notify(
            `${collection.title!}'s shareable link was copied to your clipboard.`,
            5000,
            { image: 'check', color: '#458a14' }
        );

        // navigate to new own collection
        router.push({
            query: {
                collection: ownCollectionBase64
            }
        });
    }
    catch { }
}

function cancelCollection() {
    // if user was editing a collection, take them back to collections page
    if (route.query['edit-collection']) {
        router.push({
            path: '/costumes/collections'
        });

        return;
    }


    mode.value = 'default';
    previewCollection.value = false;
    collectionItems.value.clear();

    const { 'edit-collection': _, ...rest } = route.query;

    router.push({
        query: rest
    });
}


const ownedCostumes: Record<string, Ref<string[]>> = {};
HERO_LIST.forEach(h => 
    ownedCostumes[h.id] = useLocalStorage<string[]>(() => `cosmetics_owned_${h.id}`, [])
);
const ownedCostumesCount = computed(() => 
    Object.values(ownedCostumes).reduce((sum, current) => sum + current.value.length, 0)
)
function costumeOwned(costume: Costume) {
    return ownedCostumes[costume.heroId]?.value.includes(costume.id) ?? false;
}

const costumes = getCostumesAsList();

const costumeSort = ref('date-desc');
const sortDropdownOptions: Option[] = [
    {
        value: 'date-desc',
        label: 'SORT BY NEWEST',
        leftIcon: {
            key: 'filterTimeUp',
            size: 35
        }
    },
    {
        value: 'name-asc',
        label: 'SORT BY NAME A-Z',
        leftIcon: {
            key: 'sortAZ',
            size: 35
        }
    },
    {
        value: 'name-desc',
        label: 'SORT BY NAME Z-A',
        leftIcon: {
            key: 'sortZA',
            size: 35
        }
    },
    {
        value: 'rarity',
        label: 'SORT BY RARITY',
        leftIcon: {
            key: 'filterRaritySortUp',
            size: 35
        }
    },
    {
        value: 'date-asc',
        label: 'SORT BY OLDEST',
        leftIcon: {
            key: 'filterTimeDown',
            size: 35
        }
    },
];

const filterOwned = ref(false);

const searchText = ref('');

const favouriteHeroes = useLocalStorage<HeroData['id'][]>(`favourite_heroes`, []);

const activeHeroesFilters = ref<string[]>([]);
const heroesFilterDropdownOptions = ref<Option[]>(HERO_LIST
    .toSorted((a,b) => a.name.localeCompare(b.name))
    .map<Option>(h => {
        // not computed, since favourite heroes cannot be changed while this page is mounted
        const isFav = favouriteHeroes.value.includes(h.id);
        return {
            leftIcon: {
                url: `${h.dataDir}head.webp`,
                size: 30
            },
            rightIcon: isFav ? 'favourite' as TextureKey : undefined,

            value: h.id,
            label: h.name,

            whenSelected: { showOnlyLeftIcon: true }
        }
    })
    .sort(({ value: a }, { value: b }) => {
        const aIsFav = favouriteHeroes.value.includes(a!);
        const bIsFav = favouriteHeroes.value.includes(b!);

        if (aIsFav && !bIsFav)
            return -1;
        if (!aIsFav && bIsFav)
            return 1;

        return 0;
    })
);

const activeRarityFilters = ref<string[]>([]);
const rarityFilterDropdownOptions = ref<Option[]>([
    {
        leftIcon: {
            key: 'rarityLegendary',
            size: 20
        },

        label: `LEGENDARY`,
        value: 'legendary',

        whenSelected: { showOnlyLeftIcon: true }
    },
    {
        leftIcon: {
            key: 'rarityEpic',
            size: 20
        },

        label: `EPIC`,
        value: 'epic',

        whenSelected: { showOnlyLeftIcon: true }
    },
    {
        leftIcon: {
            key: 'rarityRare',
            size: 20
        },

        label: `RARE`,
        value: 'rare',

        whenSelected: { showOnlyLeftIcon: true }
    },
]);

const activeCategoriesFilters = ref<string[]>([]);
const originalCategories = getAllCategories();
const categoriesFilterDropdownOptions = ref<Option[]>(originalCategories.map(c => ({
    leftIcon: {
        url: getCategoryIcon(c),
        size: 30
    },

    value: c,
    label: c,

    whenSelected: { showOnlyLeftIcon: true }
})));

const activeSourcesFilters = ref<string[]>([]);
const sourcesFiltersDropdownOptions = ref<Option[]>(getAllSources()
    .toSorted((a,b) => a.localeCompare(b))
    .map(s => ({
        value: s,
        label: s
    }))
);

const activeThemesFilters = ref<string[]>([]);
const sourcesThemesDropdownOptions = ref<Option[]>(getAllThemes()
    .toSorted((a,b) => a.localeCompare(b))
    .map(t => ({
        leftIcon: {
            url: `/img/cosmetics/themes/${toKebabCase(t)}.webp`,
            size: 23
        },

        value: t,
        label: t,

        whenSelected: { showOnlyLeftIcon: true }
    }))
);

useReactiveQueryProps({
    search: {
        ref: searchText,
        default: '',
        converter: RouteConverter.string,
        debounceDelay: 500
    },
    owned: {
        ref: filterOwned,
        default: false,
        converter: RouteConverter.boolean
    },
    sort: {
        ref: costumeSort,
        default: 'date-desc',
        converter: RouteConverter.string
    },
    heroes: {
        ref: activeHeroesFilters,
        converter: RouteConverter.stringArray
    },
    rarity: {
        ref: activeRarityFilters,
        converter: RouteConverter.stringArray
    },
    categories: {
        ref: activeCategoriesFilters,
        converter: RouteConverter.stringArray
    },
    sources: {
        ref: activeSourcesFilters,
        converter: RouteConverter.stringArray
    },
    themes: {
        ref: activeThemesFilters,
        converter: RouteConverter.stringArray
    },
});


const dropdowns = computed<{
    active: Ref<string[]>,
    options: Ref<Option[]>,
    placeholder: string|Placeholder,
    props?: any
}[]>(() => [
    {
        active: activeHeroesFilters,
        options: heroesFilterDropdownOptions,
        placeholder: {
            label: 'ALL HEROES',
            leftIcon: {
                key: 'filterHero',
                size: 35
            }
        },
        props: {
            search: true,
            mobileOverlay: true,
            concatenateSelectedOptions: 3,
            pushCheckedToTop: true
        }
    },
    {
        active: activeRarityFilters,
        options: rarityFilterDropdownOptions,
        placeholder: {
            label: 'ALL RARITIES',
            leftIcon: {
                key: 'filterRarity',
                size: 35
            }
        },
        props: {
            concatenateSelectedOptions: true }
    },
    {
        active: activeCategoriesFilters,
        options: categoriesFilterDropdownOptions,
        placeholder: {
            label: 'ALL CATEGORIES',
            leftIcon: {
                key: 'filterCategories',
                size: 35
            }
        },
        props: {
            search: true,
            mobileOverlay: true,
            concatenateSelectedOptions: 3,
            pushCheckedToTop: true
        }
    },
    {
        active: activeSourcesFilters,
        options: sourcesFiltersDropdownOptions,
        placeholder: {
            label: 'ALL SOURCES',
            leftIcon: {
                key: 'filterSource',
                size: 35
            }
        },
        props: {
            search: true,
            mobileOverlay: true,
            pushCheckedToTop: true
        }
    },
    {
        active: activeThemesFilters,
        options: sourcesThemesDropdownOptions,
        placeholder: {
            label: 'ALL THEMES',
            leftIcon: {
                key: 'filterTheme',
                size: 35
            }
        },
        props: {
            search: true,
            mobileOverlay: true,
            concatenateSelectedOptions: 3,
            pushCheckedToTop: true
        }
    },
]);

function resetFilters() {
    filterOwned.value = false;
    searchText.value = '';
    activeHeroesFilters.value = [];
    activeRarityFilters.value = [];
    activeCategoriesFilters.value = [];
    activeSourcesFilters.value = [];
    activeThemesFilters.value = [];
}

type ListCostume = Costume & { hero: HeroData };
const sortedCostumes = computed<ListCostume[]>(() => {
    let list = costumes.slice();

    if (filterOwned.value)
        list = list.filter(c => costumeOwned(c));

    if (mode.value != 'collection' && !previewCollection.value) {
        list = list.filter(c => {
            const checks: (() => boolean)[] = [
                () => {
                    if (!searchText.value)
                        return true;

                    const searchLower = searchText.value.toLowerCase()

                    const hero = c.heroId ? HERO_LIST.find(h => h.id == c.heroId) : null;

                    return c.name.toLowerCase().includes(searchLower)
                        || c.category.toLowerCase().includes(searchLower)
                        || !!c.source?.toLowerCase().includes(searchLower)
                        || !!c.theme?.toLowerCase().includes(searchLower)
                        || (
                            !!hero
                        && (
                                hero.name.toLowerCase().includes(searchLower)
                            || !!hero.aliases?.some(a => a.toLowerCase().includes(searchLower))
                            )
                        );
                },
                () => activeHeroesFilters.value.length ? activeHeroesFilters.value.includes(c.heroId) : true,
                () => activeRarityFilters.value.length ? activeRarityFilters.value.includes(c.rarity) : true,
                () => activeCategoriesFilters.value.length ? activeCategoriesFilters.value.includes(c.category) : true,
                () => activeSourcesFilters.value.length ? activeSourcesFilters.value.includes(c.source ?? '') : true,
                () => activeThemesFilters.value.length ? activeThemesFilters.value.includes(c.theme ?? '') : true,
            ]

            for (const check of checks) {
                const allowed = check();
                if (!allowed)
                    return false;
            }

            return true;
        });
    }

    if (previewCollection.value)
        list = list.filter(i => collectionItems.value.has(i.id));
    if (mode.value == 'collection' && collection.value)
        list = list.filter(i => collection.value!.items.includes(i.id));

    list.sort((a, b) => {
        if (costumeSort.value === 'rarity')
            return (RARITY_ORDER.indexOf(a.rarity) ?? 3) - (RARITY_ORDER.indexOf(b.rarity) ?? 3);

        if (costumeSort.value === 'name-asc')
            return a.name.localeCompare(b.name);
        if (costumeSort.value === 'name-desc')
            return b.name.localeCompare(a.name);

        const da = a.releaseDate ?? '';
        const db = b.releaseDate ?? '';
        return costumeSort.value === 'date-asc' ? da.localeCompare(db) : db.localeCompare(da);
    });

    return list.map(c => ({
        ...c,
        hero: HERO_LIST.find(h => h.id == c.heroId)!
    }));
});

watch(sortedCostumes, () => {
    nextTick(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    });
})



function toggleCostumeOwned(heroId: string, id: string) {
    const index = ownedCostumes[heroId]?.value.indexOf(id) ?? -1;
    if (index === -1)
        ownedCostumes[heroId]?.value.push(id);
    else
        ownedCostumes[heroId]?.value.splice(index, 1);
}

function openCostumeDetail(costume: ListCostume) {
    openModal(CostumeDetailModal, {
        costume,
        heroId: costume.hero.id,
        heroColor: costume.hero.color,
    })
    .promise
    .catch(() => null);
}

function itemClick(costume: ListCostume) {
    if (mode.value == 'default' || mode.value == 'collection') {
        openCostumeDetail(costume);
        return;
    }

    if (mode.value == 'make-collection') {
        if (collectionItems.value.has(costume.id))
            collectionItems.value.delete(costume.id);
        else
            collectionItems.value.add(costume.id);
    }
}
</script>