<template>
    <div class="achievements-page simple-page">
        <div class="bg-panes" />
        
        <div class="mobile-title dark">
            <h1>
                Achievements
            </h1>
        </div>
        <UiSeparator class="mobile-separator with-spacing" dark />

        <div class="container">
            <aside>
                <div class="categories-list">
                    <div
                        v-for="category in ACHIEVEMENT_CATEGORIES"
                        :class="{category: 1, selected: selectedCategory == category.id}"

                        @click="selectedCategory = category.id"
                    >
                        <div class="icon">
                            <Tex
                                :image="category.icon()"
                                :color="selectedCategory == category.id ?
                                    '#000'
                                    :
                                    '#fff'
                                "

                                width="64px"
                                height="64px"
                            />
                        </div>
                        <div class="name">
                            <h4>
                                {{ category.name }}
                            </h4>
                        </div>
                    </div>
                </div>

                <div class="filters">
                    <FormSearchBox
                        ref="searchBox"
                        v-model="searchText"
                    />

                    <div class="dropdowns">
                        <FormDropdown
                            :options="rarityFilterOptions"
                            v-model="activeRarityFilters"

                            :placeholder="{
                                label: 'RARITY',
                                leftIcon: {
                                    key: 'filterRarity',
                                    size: 35
                                }
                            }"
                            small

                            concatenate-selected-options
                        />
                        <FormDropdown
                            :options="sortByOptions"
                            v-model="activeSortBy"

                            :placeholder="{
                                label: 'SORT BY',
                                leftIcon: {
                                    key: 'filterSortDesc',
                                    size: 35
                                }
                            }"
                            small
                        />
                    </div>
                </div>
            </aside>
            <main>
                <PanelAchievements
                    :category="selectedCategory"
                    :achievements="achievementsList"
                    
                    :filter="filterAchievements"
                    :sort="activeSortBy.length ? sortAchievements : undefined"

                    display-hero-owner

                    @reset-filters="resetFilters"
                />
            </main>
        </div>
    </div>
</template>

<style src="@/assets/style/pages/achievements.sass" scoped></style>

<script setup lang="ts">
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_ICONS, ACHIEVEMENT_RARITY_NAMES, getAchievements, type AchievementType, type AchievementTypeCategory, type AchievementTypeRarity } from '~/assets/data/achievements/achievements';
import { PreferencesStoreSchema, type PreferencesStore, DEFAULT_PREFERENCES_STORE } from '~/assets/data/common';
import type { Option } from '~/components/form/Dropdown.vue';
import type { AchievementWithState } from '~/components/panel/Achievements.vue';

const route = useRoute();
const router = useRouter();

const category = computed(() => {
    const catId = route.params.slug?.[0] ?? 'galacta-guide';

    if (!ACHIEVEMENT_CATEGORIES.find(c => c.id == catId))
        throw createError({ status: 404 });

    return catId as AchievementTypeCategory;
});

const title = `Achievements | MR Proficiency Calculator`
const description = `See all achievements in the game and track your progress.`
const image = useAbsoluteUrl('/img/seo/og-image-achievements.webp');
const imageAlt = `${title} - ${description}`;
useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogUrl: useCanonicalUrl('achievements'),
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
            href: useCanonicalUrl('achievements')
        }
    ]
})

const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);
onMounted(() => {
    preferences.value.sawAchievementsPage = true;
});

const selectedCategory = ref<AchievementTypeCategory>(category.value);
watch(category, (newCategory, oldCategory) => {
    if (newCategory == oldCategory)
        return;

    selectedCategory.value = newCategory;
});

watch(selectedCategory, cat => {
    router.push({
        path: `/achievements/${cat}`,
        query: route.query
    })
});

const achievementsList = computed(() => getAchievements(selectedCategory.value));

const searchText = ref('');

const rarityFilterOptions = computed<Option[]>(() => [
    ...objectEntries(ACHIEVEMENT_ICONS[selectedCategory.value])
        .filter(([key]) => key !== 'normal')
        .map(([key, icon]) => {
            const name = ACHIEVEMENT_RARITY_NAMES[key as AchievementTypeRarity].toUpperCase();

            return {
                leftIcon: {
                    key: icon,
                    size: 29
                },

                value: key,
                label: name,

                whenSelected: { showOnlyLeftIcon: true }
            }
        })
]);
const activeRarityFilters = ref<string[]>([]);

const sortByOptions: Option[] = [
    {
        label: 'COMPLETED',
        value: 'completed',
        leftIcon: {
            key: 'filterChecked',
            size: 35
        }
    },
    {
        label: 'A-Z',
        value: 'az',
        leftIcon: {
            key: 'sortAZ',
            size: 35
        }
    },
    {
        label: 'Z-A',
        value: 'za',
        leftIcon: {
            key: 'sortZA',
            size: 35
        }
    },
];
const activeSortBy = ref<string[]>([]);

watch(activeSortBy, (sortBy, prevSortBy) => {
    if (sortBy.includes('az') && sortBy.includes('za')) {
        if (prevSortBy.includes('az'))
            sortBy.splice(sortBy.indexOf('az'), 1);
        else if (prevSortBy.includes('za'))
            sortBy.splice(sortBy.indexOf('za'), 1);
    }
});

function filterAchievements(achievement: AchievementWithState) {
    let searchTextMatch = true;
    if (!!searchText.value)
        searchTextMatch = achievement.title.toLowerCase().includes(searchText.value.toLowerCase())
                       || achievement.description.toLowerCase().includes(searchText.value.toLowerCase())

    let rarityMatch = true;
    if (activeRarityFilters.value.length)
        rarityMatch = activeRarityFilters.value.includes(achievement.rarity);

    return searchTextMatch && rarityMatch;
}
function sortAchievements(a: AchievementWithState, b: AchievementWithState) {
    const az = activeSortBy.value.includes('az');
    const za = activeSortBy.value.includes('za');

    if (activeSortBy.value.includes('completed')) {
        if (a.completed && !b.completed)
            return -1;
        else if (!a.completed && b.completed)
            return 1;
        else {
            if (az)
                return a.title.localeCompare(b.title);
            if (za)
                return a.title.localeCompare(b.title) * -1;

            // no sorting if no az or za
            return 0;
        }
    }

    if (az)
        return a.title.localeCompare(b.title)
    if (za)
        return a.title.localeCompare(b.title) * -1;

    return 0;
}

useReactiveQueryProps({
    search: {
        ref: searchText,
        default: '',
        converter: RouteConverter.string,
        debounceDelay: 500
    },
    sort: {
        ref: activeSortBy,
        converter: RouteConverter.stringArray
    },
    rarity: {
        ref: activeRarityFilters,
        converter: RouteConverter.stringArray
    },
});

function resetFilters() {
    searchText.value = '';
    activeRarityFilters.value = [];
}
</script>