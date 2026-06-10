<template>
    <div class="hero-list">
        <div v-if="!listViewDisabled" class="view-bar">
            <ul>
                <li
                    :class="{ selected: view === 'gallery' }"
                    @click="viewStore = 'gallery'"
                >
                    GALLERY
                    <span class="view-label">VIEW</span>
                </li>
                <li
                    :class="{ selected: view === 'list' }"
                    @click="viewStore = 'list'"
                >
                    LIST
                    <span class="view-label">VIEW</span>
                </li>
            </ul>
        </div>
        <div
            ref="tools"
            :class="{ tools: 1, embedded, mobile }"
        >
            <FormSearchBox
                ref="searchBox"
                v-model="searchText"
                :small="mobile"
            />
            <div class="filters">
                <FormCheckbox v-model="filterFavourites" :size="mobile ? 'medium' : 'large'">
                    FAVOURITES
                </FormCheckbox>
                <FormDropdown
                    ref="rolesDropdown"
                    :options="roleDropdownOptions"
                    v-model="filterByRole"
                    :small="mobile"
                />
            </div>
        </div>
        <template v-if="view === 'list' && sortedHeroData.length">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable" @click="setSort('name')">
                                HERO
                                <span
                                    v-if="sortKey === 'name'"
                                    class="caret"
                                >
                                    {{ sortDir === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th class="sortable center role-col" @click="setSort('role')">
                                ROLE
                                <span
                                    v-if="sortKey === 'role'"
                                    class="caret"
                                >
                                    {{ sortDir === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th class="sortable center" @click="setSort('rank')">
                                RANK
                                <span
                                    v-if="sortKey === 'rank'"
                                    class="caret"
                                >
                                    {{ sortDir === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th class="sortable center" @click="setSort('level')">
                                LEVEL
                                <span
                                    v-if="sortKey === 'level'"
                                    class="caret"
                                >
                                    {{ sortDir === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th class="no-left-pad sortable center" @click="setSort('current-xp')">
                                CURRENT POINTS
                                <span
                                    v-if="sortKey === 'current-xp'"
                                    class="caret"
                                >
                                    {{ sortDir === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th class="sortable num" @click="setSort('xp')">
                                <span class="label-full">TOTAL </span>POINTS
                                <span
                                    v-if="sortKey === 'xp'"
                                    class="caret"
                                >
                                    {{ sortDir === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="entry in sortedHeroData"
                            :key="entry.hero.id"

                            :class="{ 'hero-row': 1, favourite: favourites.includes(entry.hero.id) }"
                            :style="{
                                '--rank-color': entry.rankData.color
                            }"

                            @click="router.push(`/heroes/${entry.hero.id}`)"
                            @contextmenu.prevent="favouriteHero(entry.hero.id)"

                            v-tooltip="({
                                text: favourites.includes(entry.hero.id) ?
                                    '<b>Remove</b> from favorites'
                                    :
                                    '<b>Add</b> to favorites',
                                icon: 'mouseRight'
                            } satisfies TooltipBinding)"
                        >
                            <td class="name-cell">
                                <Tex
                                    v-if="favourites.includes(entry.hero.id)"
                                    class="favourite-check"
                                    image="favouriteCornerLeft"

                                    width="30px"
                                    height="30px"
                                />
                                <img
                                    class="portrait"
                                    :src="entry.hero.dataDir + 'story.webp'"
                                    :alt="`${entry.hero.name} Story Portrait`"
                                    draggable="false"
                                />
                                <NuxtLink
                                    :to="`/heroes/${entry.hero.id}`"
                                    @click.stop
                                >
                                    {{ entry.hero.name }}
                                </NuxtLink>
                            </td>
                            <td class="role-cell">
                                <div>
                                    <img
                                        v-for="role in heroRolesAsArray(entry.hero.roles)"
                                        :key="role"

                                        class="role-icon"
                                        :src="ROLE_ICONS[role]"
                                        :alt="`${role} Icon`"
                                        draggable="false"
                                    />
                                </div>
                            </td>
                            <td class="rank-cell">
                                <div>
                                    <img
                                        :src="entry.rankData.icon"
                                        class="rank-icon"
                                        :alt="`${entry.rankData.name} Icon`"
                                        draggable="false"
                                    />
                                    <span>{{ entry.rankData.name }}</span>
                                </div>
                            </td>
                            <td class="num-cell">{{ entry.storedLevel.level }}</td>
                            <td class="progress-cell">
                                <div class="progress-bar">
                                    <div
                                        class="fill"
                                        :style="{
                                            width: `${Math.round((entry.storedLevel.points / entry.rankData.xpPerLevel) * 100)}%`
                                        }"
                                    />
                                    <span class="xp-label">
                                        {{ entry.storedLevel.points.toLocaleString() }} / {{ entry.rankData.xpPerLevel.toLocaleString() }}
                                    </span>
                                </div>
                            </td>
                            <td class="num-cell xp">{{ entry.totalXp.toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="hero-cards">
                <div class="cards-controls">
                    <span class="sort-label">Sort by:</span>
                    <div class="sort-row">
                        <FormDropdown
                            :options="cardSortOptions"
                            v-model="sortKey"
                        />
                        <button
                            class="dir-toggle"
                            @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'"
                        >
                            {{ sortDir === 'asc' ? 'ASC ▲' : 'DESC ▼' }}
                        </button>
                    </div>
                </div>
                <div
                    v-for="entry in sortedHeroData"
                    :key="entry.hero.id"
                    
                    :class="{ 'hero-card': 1, favourite: favourites.includes(entry.hero.id) }"
                    :style="{
                        '--rank-color': entry.rankData.color
                    }"

                    @click="router.push(`/heroes/${entry.hero.id}`)"
                    @contextmenu.prevent="favouriteHero(entry.hero.id)"

                    v-tooltip="({
                        text: favourites.includes(entry.hero.id)
                            ? '<b>Remove</b> from favorites'
                            : '<b>Add</b> to favorites',
                        icon: 'mouseRight'
                    } satisfies TooltipBinding)"
                >
                    <div class="card-top">
                        <img
                            :src="entry.hero.dataDir + 'story.webp'"
                            class="portrait"
                            :alt="`${entry.hero.name} Story Portrait`"
                            draggable="false"
                        />
                        <div class="card-identity">
                            <NuxtLink
                                :to="`/heroes/${entry.hero.id}`"
                                @click.stop
                            >
                                {{ entry.hero.name }}
                            </NuxtLink>
                            <div class="card-role">
                                <img
                                    v-for="role in heroRolesAsArray(entry.hero.roles)"
                                    :key="role"

                                    class="role-icon"
                                    :src="ROLE_ICONS[role]"
                                    :alt="`${role} Icon`"
                                    draggable="false"
                                />
                            </div>
                        </div>
                        <div class="card-rank">
                            <img
                                :src="entry.rankData.icon"
                                class="rank-icon"
                                :alt="`${entry.rankData.name} Icon`"
                                draggable="false"
                            />
                            <span>{{ entry.rankData.name }}</span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div
                            class="fill"
                            :style="{
                                width: `${Math.round((entry.storedLevel.points / entry.rankData.xpPerLevel) * 100)}%`
                            }"
                        />
                        <span class="xp-label">
                            Current Points: {{ entry.storedLevel.points.toLocaleString() }} / {{ entry.rankData.xpPerLevel.toLocaleString() }}
                        </span>
                    </div>
                    <div class="card-stats">
                        <span class="level">
                            Level: {{ entry.storedLevel.level }}
                        </span>
                        <span class="xp">
                            Total Points: {{ entry.totalXp.toLocaleString() }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <component
            v-if="view === 'gallery' && !!featuredHero"
            :is="links ? NuxtLink : 'div'"
            class="featured-hero"

            :style="{
                '--hero-color': featuredHero.hero.color
            }"

            :to="`/heroes/${featuredHero.hero.id}`"
            @click="clickHero(featuredHero.hero.id)"

            v-tooltip="{
                text: favourites.includes(featuredHero.hero.id) ?
                    '<b>Remove</b> from favorites'
                    :
                    '<b>Add</b> to favorites',
                icon: 'mouseRight'
            }"

            @contextmenu.prevent="favouriteHero(featuredHero.hero.id)"
        >
            <div class="color-mask" />

            <div class="new">
                NEW
            </div>
            <div
                class="prestige"
                :style="{
                    '--prestige-image': `url(${featuredHero.hero.dataDir}prestige.webp)`,
                }"
            >
                <div class="stroke" />
                <img
                    :src="`${featuredHero.hero.dataDir}prestige.webp`"
                    :alt="`${featuredHero.hero.name} Prestige Image`"
                    draggable="false"
                />
            </div>

            <div class="info">
                <h3 class="name">
                    {{ featuredHero.hero.name }}
                </h3>
            </div>

            <div v-if="featuredHeroIsFavourite || featuredHeroIsChecked" class="check">
                <Tex
                    class="check-tex"
                    :image="featuredHeroIsChecked ? 'checkCorner' : 'favouriteCorner'"

                    width="45px"
                    height="45px"
                />
            </div>

            <div class="bar">
                <div class="rank-icon-wrapper">
                    <img
                        v-if="featuredHeroRankDetails"
                        :src="featuredHeroRankDetails.icon"
                        :alt="`${featuredHeroRankDetails.name} Icon`"
                        draggable="false"
                    />
                </div>
                <p class="role">
                    <span v-if="heroRolesAsArray(featuredHero.hero.roles).length == 1">
                        {{ heroRolesAsArray(featuredHero.hero.roles)[0] }}
                    </span>
                    <Tex
                        v-for="role in heroRolesAsArray(featuredHero.hero.roles)"
                        :src="ROLE_ICONS[role]"
                        color="#fff"

                        width="30px"
                        height="30px"
                    />
                </p>
            </div>
        </component>
        <ul v-if="view === 'gallery' && heroList.length" class="list">
            <li v-if="addHeroEnabled && filterByRole == 'all-roles' && !filterFavourites && !searchText">
                <component
                    :is="links ? NuxtLink : 'div'"
                    to="/heroes/new"

                    @click="clickHero('new')"
                >
                    <PanelHeroCard
                        id="new"
                        name="Add missing"
                        :roles="[]"
                        color="#ccc"
                        :portrait="tex('allHeroes')"

                        :is-favourite="false"
                        rank="agent"
                    />
                </component>
            </li>
            <li
                v-for="{hero, level} in heroList"
                :key="hero.id"

                v-tooltip="({
                    text: favourites.includes(hero.id) ?
                        '<b>Remove</b> from favorites'
                        :
                        '<b>Add</b> to favorites',
                    icon: 'mouseRight'
                } satisfies TooltipBinding)"

                @contextmenu.prevent="favouriteHero(hero.id)"
            >
                <component
                    :is="links ? NuxtLink : 'div'"
                    :to="`/heroes/${hero.id}`"

                    @click="clickHero(hero.id)"
                >
                    <PanelHeroCard
                        :id="hero.id"
                        :name="hero.name"
                        :roles="hero.roles"
                        :color="hero.color"
                        :portrait="`${hero.dataDir}portrait.webp`"

                        :is-favourite="favourites.includes(hero.id)"
                        :is-checked="selectedHero == hero.id"
                        :rank="level.rank"
                    />
                </component>
            </li>
        </ul>

        <div
            v-if="(
                    view == 'gallery'
                 && !heroList.length
                 && !featuredHero
                )
                || !sortedHeroData.length
            "
            class="no-results"
        >
            <p>No results</p>
            <FormButton size="tiny" color-scheme="white" @click="resetSearch">
                Reset search
            </FormButton>
        </div>
    </div>
</template>

<style src="@/assets/style/components/hero-list.sass" scoped></style>

<script setup lang="ts">
import { NuxtLink } from '#components';
import { calcTotalXp, DEFAULT_HERO_STORE, DEFAULT_PREFERENCES_STORE, PlayerHeroStoreSchema, PreferencesStoreSchema, PROFICIENCY_RANKS, ROLE_ICONS, type HeroData, type HeroRole, type PlayerHeroStore, type PreferencesStore } from '~/assets/data/common';
import { getFeaturedHero, HERO_LIST, heroRolesAsArray } from '~/assets/data/heroes';
import { tex, texUrl } from '~/assets/data/textures';
import type { TooltipBinding } from '~/directives/tooltip';
import type { Option } from '../form/Dropdown.vue';

const props = withDefaults(defineProps<{
    embedded?: boolean,
    selectedHero?: string,

    backButton?: string,

    links?: boolean,
    addHeroEnabled?: boolean,
    showUnknownHeroes?: boolean,

    sortHeroes?: (a: HeroData, b: HeroData) => number,

    listViewDisabled?: boolean,
}>(), {
    links: true,
    addHeroEnabled: true,
    showUnknownHeroes: true,
    sortHeroes: (a,b) => a.name.localeCompare(b.name),
    view: 'gallery',
});

const emit = defineEmits<{
    clickHero: [ heroId: string ]
}>();

const roleDropdownOptions: Option[] = [
    {
        leftIcon: {
            url: `/img/heroes/roles/all-roles.webp`,
        },

        label: `ALL ROLES`,
        value: 'all-roles' 
    },
    {
        leftIcon: {
            url: `/img/heroes/roles/vanguard.webp`,
        },

        label: `VANGUARD`,
        value: 'vanguard' 
    },
    {
        leftIcon: {
            url: `/img/heroes/roles/duelist.webp`,
        },

        label: `DUELIST`,
        value: 'duelist' 
    },
    {
        leftIcon: {
            url: `/img/heroes/roles/strategist.webp`,
        },

        label: `STRATEGIST`,
        value: 'strategist' 
    },
    {
        leftIcon: {
            key: 'favourite'
        },

        label: `FAVOURITES`,
        value: 'favourite'
    }
];

const mobile = isMobile();

const tools = useTemplateRef('tools');
const searchBox = useTemplateRef('searchBox');
const rolesDropdown = useTemplateRef('rolesDropdown');

useStickyBar(tools, {
    showClass: 'sticky-mobile-show',
    mobileOnly: true,
    onScrollDownWhileSticky: () => rolesDropdown.value?.setExpanded(false),
})

// stores
const preferences = useLocalStorage('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);
const viewStore = computed({
    get: () => preferences.value.heroList.view,
    set: (value) => preferences.value.heroList.view = value
});
const view = computed(() => props.listViewDisabled ? 'gallery' : viewStore.value);

const filterByRole = computed({
    get: () => preferences.value.heroList.filterRole,
    set: (value) => preferences.value.heroList.filterRole = value
});
const filterFavourites = computed({
    get: () => preferences.value.heroList.filterFavourites,
    set: (value) => preferences.value.heroList.filterFavourites = value
});


const unknownHeroes = useLocalStorage<HeroData[]>('unknown_heroes', []);
const favourites = useLocalStorage<HeroData['id'][]>(`favourite_heroes`, []);

const searchText = ref('');

function filterHeroList(list: HeroData[]) {
    if (filterByRole.value != 'all-roles' && filterByRole.value != 'favourite')
        list = list.filter(h => 
            h.roles == filterByRole.value 
         || (
                Array.isArray(h.roles) 
            && h.roles.includes(filterByRole.value as HeroRole)
            )
        );

    if (filterByRole.value == 'favourite' || filterFavourites.value)
        list = list.filter(h => favourites.value.includes(h.id));

    if (searchText.value)
        list = list.filter(h => 
            h.name.toLowerCase().includes(searchText.value.toLowerCase())
         || h.aliases?.find(a => a.toLowerCase().includes(searchText.value.toLowerCase()))
        );

    list.sort(props.sortHeroes);

    const output = list.map(hero => {
        const storedLevel = useLocalStorage<PlayerHeroStore>(`hero_${hero.id}`, DEFAULT_HERO_STORE(), PlayerHeroStoreSchema);
        
        return { hero, level: storedLevel.value };
    });

    return output;
}

const featuredHero = computed(() => {
    const featured = getFeaturedHero();
    if (!featured)
        return null;

    const filtered = filterHeroList([featured]);
    if (filtered.length == 0)
        return null;

    return filtered[0]!;
});

const featuredHeroRankDetails = computed(() => {
    if (!featuredHero.value?.level.rank)
        return null;

    return PROFICIENCY_RANKS[featuredHero.value.level.rank];
});

const featuredHeroIsFavourite = computed(() => 
    featuredHero.value ? favourites.value.includes(featuredHero.value.hero.id) : false
);
const featuredHeroIsChecked = computed(() => props.selectedHero == featuredHero.value?.hero.id);

const heroList = computed<{ hero: HeroData, level: PlayerHeroStore }[]>(() => {
    let list = [...HERO_LIST, ...(props.showUnknownHeroes ? unknownHeroes.value : [])];

    // remove featured hero from the list
    if (featuredHero.value) {
        const featuredIndex = list.findIndex(h => h.id == featuredHero.value!.hero.id);
        list.splice(featuredIndex, 1);
    }

    return filterHeroList(list);
});

function clickHero(heroId: string) {
    if (props.links)
        return;

    emit('clickHero', heroId);
}

function favouriteHero(heroId: string) {
    const idx = favourites.value.indexOf(heroId);
    if (idx !== -1)
        favourites.value.splice(idx, 1);
    else
        favourites.value.push(heroId);
}

// List view — summary table logic
const router = useRouter();

const RANK_ORDER = Object.keys(PROFICIENCY_RANKS);



const heroData = computed(() => {
    return [...HERO_LIST, ...unknownHeroes.value].map(hero => {
        const stored = useLocalStorage<PlayerHeroStore>(`hero_${hero.id}`, DEFAULT_HERO_STORE(), PlayerHeroStoreSchema);
        const rankData = PROFICIENCY_RANKS[stored.value.rank] ?? PROFICIENCY_RANKS.agent!;
        const totalXp = calcTotalXp(stored.value.level, stored.value.points);
        return {
            hero,
            storedLevel: stored.value,
            rankData,
            totalXp
        };
    });
});

type SortKey = 'name'|'role'|'rank'|'level'|'xp'|'current-xp';
const sortKey = computed({
    get: () => preferences.value.heroList.listSortKey,
    set: (value) => preferences.value.heroList.listSortKey = value
});
const sortDir = computed({
    get: () => preferences.value.heroList.listSortDirection,
    set: (value) => preferences.value.heroList.listSortDirection = value
});

const cardSortOptions = [
    { label: 'NAME',        value: 'name' },
    { label: 'ROLE',        value: 'role' },
    { label: 'RANK',        value: 'rank' },
    { label: 'LEVEL',       value: 'level' },
    { label: 'CURRENT XP',  value: 'current-xp' },
    { label: 'TOTAL XP',    value: 'xp' },
];

const ROLE_ORDER = ['vanguard', 'duelist', 'strategist'];

const sortedHeroData = computed(() => {
    const search = searchText.value; // listSearch.value;
    const role = filterByRole.value; // listRole.value;
    const favOnly = filterFavourites.value; // listFavs.value;
    const favs = favourites.value;

    let data = [...heroData.value];

    if (role !== 'all-roles' && role !== 'favourite')
        data = data.filter(e =>
            e.hero.roles === role ||
            (Array.isArray(e.hero.roles) && e.hero.roles.includes(role as HeroRole))
        );

    if (role === 'favourite' || favOnly)
        data = data.filter(e => favs.includes(e.hero.id));

    if (search)
        data = data.filter(e =>
            e.hero.name.toLowerCase().includes(search.toLowerCase()) ||
            e.hero.aliases?.find(a => a.toLowerCase().includes(search.toLowerCase()))
        );

    return data.sort((a, b) => {
        let cmp = 0;
        switch (sortKey.value) {
            case 'name':
                cmp = a.hero.name.localeCompare(b.hero.name);
                break;

            case 'role':
                const heroRoleA = heroRolesAsArray(a.hero.roles)[0]!;
                const heroRoleB = heroRolesAsArray(b.hero.roles)[0]!;
                cmp = ROLE_ORDER.indexOf(heroRoleA) - ROLE_ORDER.indexOf(heroRoleB);
                break;

            case 'rank': 
                cmp = RANK_ORDER.indexOf(a.rankData.id) - RANK_ORDER.indexOf(b.rankData.id);
                break;

            case 'level':
                cmp = a.storedLevel.level - b.storedLevel.level;
                break;

            case 'xp':
                cmp = a.totalXp - b.totalXp;
                break;

            case 'current-xp':
                cmp = (a.storedLevel.points / a.rankData.xpPerLevel) - (b.storedLevel.points / b.rankData.xpPerLevel);
                break;
        }

        return sortDir.value === 'asc' ? cmp : -cmp;
    });
});

function setSort(key: SortKey) {
    if (sortKey.value === key)
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    else {
        sortKey.value = key;
        sortDir.value = key === 'name' || key === 'role' ? 'asc' : 'desc';
    }
}

function resetSearch() {
    searchText.value = '';
    filterByRole.value = 'all-roles';
    filterFavourites.value = false;
}

useEvent('keydown', (e: KeyboardEvent) => {
    // listen for key a-z key presses to automatically focus the search bar
    if (e.key.match(/[a-zA-Z]{1}/g)?.length === 1)
        searchBox.value?.focus();

    // listen for enter key to automatically go to the first result
    if (e.code === 'Enter' && !(e.shiftKey || e.ctrlKey || e.altKey)) {
        if (!(searchBox.value?.$el as HTMLElement)?.contains(document.activeElement))
            return;

        if (
            (view.value == 'list' && !sortedHeroData.value.length)
         || (view.value == 'gallery' && !heroList.value.length)
        )
            return;

        e.preventDefault();
        e.stopPropagation();

        if (view.value == 'list') {
            if (props.links)
                router.push({
                    path: `/heroes/${sortedHeroData.value[0]!.hero.id}`
                });
            else
                clickHero(sortedHeroData.value[0]!.hero.id);
        }

        if (view.value == 'gallery') {
            if (props.links)
                router.push({
                    path: `/heroes/${heroList.value[0]!.hero.id}`
                });
            else
                clickHero(heroList.value[0]!.hero.id);
        }
    }
});

defineExpose({ searchText, filterByRole, filterFavourites });
</script>