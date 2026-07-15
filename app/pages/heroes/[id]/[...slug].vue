<template>
    <div
        class="hero-page"
        :style="{
            '--hero-silhouette': `url(${useHeroImage('silhouette', hero).value})`,
            '--hero-color': hero.color,
        }"
    >
        <div class="silhouette" />

        <UiNavBar
            :marks="navBarMarks"
            :breakpoint="1450"

            :selected="page"

            links
            :link-map="{
                overview: `/heroes/${hero.id}/overview${backLinkQuery}`,
                customize: `/heroes/${hero.id}/customize${backLinkQuery}`,
                estimates: `/heroes/${hero.id}/estimates${backLinkQuery}`,
                planner: `/heroes/${hero.id}/planner${backLinkQuery}`,
                achievements: `/heroes/${hero.id}/achievements${backLinkQuery}`,
                costumes: `/heroes/${hero.id}/costumes${backLinkQuery}`,
            }"

            @tab-click="setPage($event as PageId)"
        >
            <template #prepend>
                <div class="head">
                    <NuxtLink class="back-arrow" :href="backLink">
                        <Tex
                            image="chevronLeft"
                            hover="color"
                            clickable

                            width="23px"
                            height="23px"
                            object-fit="contain"
                        />
                    </NuxtLink>

                    <div class="title">
                        <h1>{{ hero.name }}</h1>
                        <Tex
                            class="favourite"
                            image="favourite"
                            :state="isFavourite ? 'hover' : 'default'"
                            hover="auto"
                            clickable

                            width="45px"
                            height="45px"
                            object-fit="cover"

                            @click="toggleFavourite"

                            v-tooltip="({
                                text: isFavourite ? 
                                    `Remove from <b>favourites</b>`
                                    :
                                    `Add to <b>favourites</b>`,
                                icon: 'mouseLeft'
                            } satisfies TooltipBinding)"
                        />
                    </div>

                    <div class="mobile-spacer" />
                </div>
            </template>

            <template #overview>
                Overview
            </template>
            <template #customize>
                Customize
            </template>
            <template #estimates>
                Estimates
            </template>
            <template #planner>
                Planner
            </template>
            <template v-if="!isUnknownHero" #achievements>
                Achievements
            </template>
            <template #costumes>
                Costumes
            </template>
        </UiNavBar>

        <main>
            <div class="hero">
                <div class="prestige">
                    <div class="prestige-bg">
                        <Tex
                            class="prestige-bg-left"
                            image="prestigeLeftMask"
                            :color="changeColor(hero.color, 30)"

                            width="100%"
                            height="100%"
                        />
                        <Tex
                            class="prestige-bg-center"
                            image="prestigeBackgroundMask"
                            :color="`repeating-linear-gradient(-35deg, var(--hero-color-change), var(--hero-color-change) 4px, var(--hero-color) 4px, var(--hero-color) 8px)`"

                            width="100%"
                            height="100%"

                            :style="{
                                '--hero-color': hero.color,
                                '--hero-color-change': changeColor(hero.color, -6)
                            }"
                        />
                        <Tex
                            class="prestige-bg-right"
                            image="prestigeRightMask"
                            :color="changeColor(hero.color, -30)"

                            width="100%"
                            height="100%"
                        />
                    </div>

                    <img
                        class="logo"
                        :src="useHeroImage('logo', hero).value"
                        :alt="`${hero.name} Logo`"
                        draggable="false"
                    />

                    <div class="prestige-img-wrapper">
                        <img
                            class="prestige-img"
                            :src="useHeroImage('prestige', hero).value"
                            :alt="`${hero.name} Prestige`"
                            draggable="false"
                        />
                    </div>
                </div>

                <div v-if="page == 'achievements'" class="categories-list">
                    <div
                        v-for="category in availableAchievementCategories"
                        :class="{category: 1, selected: selectedAchievementsCategory == category.id}"

                        @click="selectedAchievementsCategory = category.id"
                    >
                        <div class="icon">
                            <Tex
                                :image="category.icon()"
                                :color="selectedAchievementsCategory == category.id ?
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
                <div v-else-if="page == 'costumes'" class="categories-list">
                    <div
                        v-for="category in costumeCategories"
                        :class="{
                            category: 1,
                            selected: selectedCostumesCategories.includes(`__category_${category}`)
                        }"

                        @click="toggleArrayItem(selectedCostumesCategories, `__category_${category}`)"
                    >
                        <div class="icon">
                            <Tex
                                class="icon-tex"
                                :src="getCategoryIcon(category)"

                                width="55px"
                                height="55px"
                            />
                        </div>
                        <div class="name">
                            <h4>
                                {{ category }}
                            </h4>
                        </div>
                    </div>
                </div>
                <div v-else class="player-options-wrapper">
                    <div v-if="isMultiRole && rolesWithAvgStats.length" class="role-select">
                        <ClientOnly>
                            <FormMultiToggle
                                class="toggle"
                                :model-value="storedLevel.lastViewingRole ?? 'all-roles'"
                                @update:model-value="storedLevel.lastViewingRole = $event == 'all-roles'
                                    ? undefined
                                    : ($event as HeroRole)
                                "
                                small
                            >
                                <template
                                    v-for="role in rolesWithAvgStats"
                                    :key="role"
                                    #[role]
                                >
                                    <Tex
                                        :src="`/img/heroes/roles/${role}.webp`"
                                        color="#fff"

                                        width="30px"
                                        height="30px"
                                    />
                                </template>
                            </FormMultiToggle>
                        </ClientOnly>
                            <div
                                v-if="rolesWithAvgStats.length < 4"
                                class="modify"
                                @click="editAvgStats()"
                            >
                                <Tex
                                    image="cog"

                                    width="30px"
                                    height="30px"
                                />
                            </div>
                        </div>
                    <div class="player-level">
                        <ClientOnly>
                            <div
                                v-if="showQuickEditPopup" 
                                class="popup"
                                :style="{
                                    backgroundImage: texUrl('popup')
                                }"
                            >
                                <div class="message">
                                    <p>
                                        <span>Change your rank</span> by pressing on the icon/name.
                                    </p>
                                    <p>
                                        Level up by pressing on &nbsp;<span>&#708; LV{{ currentRankComp.level }}</span>
                                    </p>
                                    <p>
                                        <span>Change your points</span> by pressing on the number or <span>dragging</span> the progress bar.
                                    </p>
                                </div>

                                <Tex
                                    class="close"
                                    image="crossBlue"
                                    color="var(--blue)"
                                    @click.stop="showQuickEditPopup = false"
                                />
                            </div>

                            <div
                                class="current"
                                @click="selectCurrentLevel()"

                                v-tooltip="({
                                    text: `Select <b>current level</b>`,
                                    icon: 'mouseLeft'
                                } satisfies TooltipBinding)"
                            >
                                <div class="rank">
                                    <div class="icon">
                                        <img
                                            :src="currentRankComp.rank.icon"
                                            :alt="`${currentRankComp.rank.name} Icon`"
                                            draggable="false"
                                        />
                                    </div>
                                    <h2>{{ currentRankComp.rank.name }}</h2>
                                </div>
                                <div
                                    :class="{ level: 1, 'can-level-up': canLevelUp.state }"
                                    @click.stop="levelUp"
                                    v-tooltip="canLevelUp.state ? ({
                                        text: `Level up`,
                                        icon: 'mouseLeft'
                                    } satisfies TooltipBinding) : undefined"
                                >
                                    <Tex
                                        v-if="canLevelUp.state"

                                        image="levelUp"

                                        color="var(--light-blue-highlight)"
                                        
                                        width="20px"
                                        height="20px"
                                    />
                                    LV{{ currentRankComp.level }}
                                </div>
                            </div>
                            <div class="bottom">
                                <div class="points">
                                    <Tex
                                        class="point-count"
                                        @click="editProficiencyPoints()"

                                        image="proficiency"
                                        hover="auto"
                                        clickable

                                        width="22px"
                                        height="22px"
                                        object-fit="contain"

                                        v-tooltip="({
                                            text: 'Set <b>proficiency points</b>',
                                            icon: 'mouseLeft'
                                        } satisfies TooltipBinding)"
                                    >
                                        <p>
                                            {{ pointsSliderModel ?? currentRankComp.points }}
                                            <span>/{{ currentRankComp.rank.xpPerLevel }}</span>
                                        </p>
                                    </Tex>
                                    <FormPointsSlider
                                        class="slider"
                                        :hero="hero"

                                        v-model="pointsSliderModel"
                                        @drag-end="storedLevel.points = $event"
                                    />
                                </div>
                                <div
                                    class="set warning-wrapper"
                                    @click="modifyHeroData"
                                    v-tooltip="({
                                        text: `${hero.name} <b>options</b>`,
                                        icon: 'mouseLeft'
                                    } satisfies TooltipBinding)"
                                >
                                    <Tex
                                        image="userCog"
                                        hover="auto"
                                        clickable

                                        width="40px"
                                        height="40px"
                                        object-fit="cover"
                                    />

                                    <Tex
                                        v-if="
                                            (!hasAvgStats && !hasAvgArcadeStats)
                                         || isLv1AndGoalLv1 || unknownHeroHasPossibleMatch
                                        "
                                        class="warning-bubble"
                                        image="redDotExcl"

                                        object-fit="contain"
                                    />

                                    <div
                                        v-if="showEditPopup"
                                        class="popup"
                                        :style="{
                                            backgroundImage: texUrl('popupGoldDownRight')
                                        }"
                                    >
                                        You can change your hero details from here too
                                        <Tex
                                            class="close"
                                            image="crossBlue"
                                            color="var(--blue)"
                                            @click.stop="showEditPopup = false"
                                        />
                                    </div>
                                </div>
                            </div>
                        </ClientOnly>
                    </div>
                </div>
            </div>

            <div
                v-if="page == 'overview'"
                class="content"
                ref="content"
            >
                <PanelTabbedContainer
                    :class="{'tabbed-container': 1, 'preview-reward': previewReward !== null}"
                    container-class="tab-container"
                    :slot-order="['rewards', 'missions', 'stats']"
                >
                    <template v-if="previewReward === null" #rewards>
                        <PanelHeroProficiencyRewardList
                            :hero="hero"
                            :checked="obtainedRewards"
                            :selectedItemSpecial="true"
                            :selected-item="storedLevel.goal"

                            :reward-tooltip="{
                                text: `Preview reward`,
                                icon: 'mouseLeft'
                            }"
                            :level-tooltip="{
                                text: `Set as <b>goal</b>`,
                                icon: 'mouseLeft'
                            }"

                            @reward-click="setPreviewReward"
                            @level-click="setGoal"
                        />

                        <p>(You can select your goal by clicking on an item)</p>

                        <FormButton color-scheme="yellow" size="small" @click="setPage('estimates')">
                            SEE YOUR ESTIMATES
                        </FormButton>
                    </template>
                    <template v-else #rewards>
                        <PanelRewardPreview
                            :hero="hero"
                            v-model="previewReward"

                            @close="previewReward = null"
                        />
                    </template>

                    <template #missions>
                        <PanelMissionTable
                            :hero="hero"
                            v-model="selectedRank"
                        />
                    </template>
                    <template #stats>
                        <PanelHeroStats
                            :hero="hero"
                            :estimates="timeEstimates"

                            @edit-avg-stats="editAvgStats()"
                        />
                    </template>
                </PanelTabbedContainer>
            </div>
            <div
                v-else-if="page == 'costumes'"
                class="content cosmetics-wrapper"
                ref="content"
            >
                <ClientOnly>
                    <PanelCostumeList
                        :hero="hero"
                        v-model="selectedCostumesCategories"
                    />
                </ClientOnly>
            </div>
            <div
                v-else-if="page == 'customize'"
                class="content update-stats"
                ref="content"
            >
                <ClientOnly>
                    <ModifyHeroData
                        class="update-stats-modal"
                        :hero="hero"
                        :is-unknown-hero="isUnknownHero"

                        headless
                        @confirm="openWhereModal($event, false)"
                    />
                </ClientOnly>
            </div>
            <div
                v-else-if="page == 'estimates'"
                class="content"
            >
                <ClientOnly>
                    <PanelTabbedContainer
                        class="tabbed-container"
                        container-class="tab-container"

                        :slot-labels="{
                            normal: 'QUICK/COMP',
                            arcade: 'ARCADE (18V18)'
                        }"
                    >
                        <template #normal>
                            <PanelCalculator
                                v-if="
                                    (hasAvgStats)
                                 && !isLv1AndGoalLv1 && !isIncorrectSelection
                                "

                                :hero="hero"
                                :level="storedLevel"
                                :time-estimates="timeEstimates.normal"
                                :time-estimates-arcade="timeEstimates.arcade"

                                :animate="!finishedAnimation"

                                @finished-animation="finishedAnimation = true"
                            />

                            <PanelSetupCalculator
                                v-else
                                :hero="hero"
                                :level="storedLevel"
                                :has-avg-stats="hasAvgStats"
                                :is-lv1-and-goal-lv1="isLv1AndGoalLv1"
                                :is-incorrect-selection="isIncorrectSelection"

                                @open-stats-menu="editAvgStats()"
                                @open-goal-menu="selectLevelGoal(tryShowEditPopup, true)"
                                @open-level-menu="selectCurrentLevel()"
                            />
                        </template>
                        <template #arcade>
                            <PanelCalculator
                                v-if="
                                    (hasAvgArcadeStats)
                                 && !isLv1AndGoalLv1 && !isIncorrectSelection
                                "

                                :hero="hero"
                                :level="storedLevel"
                                :time-estimates="timeEstimates.normal"
                                :time-estimates-arcade="timeEstimates.arcade"
                                selected-game-type="arcade"

                                :animate="!finishedAnimation"

                                @finished-animation="finishedAnimation = true"
                            />

                            <!-- ARCADE SETUP -->
                            <PanelSetupCalculator
                                v-else
                                :hero="hero"
                                :level="storedLevel"
                                :has-avg-stats="hasAvgArcadeStats"
                                :is-lv1-and-goal-lv1="isLv1AndGoalLv1"
                                :is-incorrect-selection="isIncorrectSelection"

                                arcade
                                :has-avg-arcade-stats="hasAvgArcadeStats"

                                @open-stats-menu="editAvgStats(undefined, undefined, true)"
                                @open-goal-menu="selectLevelGoal(tryShowEditPopup, true)"
                                @open-level-menu="selectCurrentLevel()"
                            />
                        </template>
                    </PanelTabbedContainer>
                </ClientOnly>
            </div>

            <div
                v-else-if="page == 'planner'"
                class="content planner-wrapper"
                ref="content"
            >
                <ClientOnly>
                    <PanelPlanner
                        v-if="
                            (hasAvgStats || hasAvgArcadeStats)
                            && !isLv1AndGoalLv1 && !isIncorrectSelection
                        "

                        :hero="hero"
                        v-model="storedLevel"
                        :time-estimates="timeEstimates.normal"
                        :time-estimates-arcade="timeEstimates.arcade"

                        @open-arcade-stats-menu="editAvgStats(undefined, undefined, true)"
                    />
                    <PanelSetupCalculator
                        v-else
                        :hero="hero"
                        :level="storedLevel"
                        :has-avg-stats="hasAvgStats || hasAvgArcadeStats"
                        :is-lv1-and-goal-lv1="isLv1AndGoalLv1"
                        :is-incorrect-selection="isIncorrectSelection"
                        headless

                        @open-stats-menu="editAvgStats()"
                        @open-goal-menu="selectLevelGoal(tryShowEditPopup, true)"
                        @open-level-menu="selectCurrentLevel()"
                    />
                </ClientOnly>
            </div>
            <div
                v-else-if="page == 'achievements' && !isUnknownHero"
                class="content achievements-wrapper"
                ref="content"
            >
                <ClientOnly>
                    <PanelAchievements
                        :category="selectedAchievementsCategory"
                        :achievements="achievementList"
                    />
                </ClientOnly>
            </div>
        </main>
    </div>
</template>

<style src="@/assets/style/pages/heroes/id.sass" scoped></style>

<script setup lang="ts">
import { useModalManager } from '#imports';
import { CHALLENGE_ICONS, CHALLENGE_NAMES, DEFAULT_HERO_STORE, DEFAULT_PREFERENCES_STORE, getAverageStatsForHero, getHeroMatchCount, levelToRank, PlayerHeroStoreSchema, PreferencesStoreSchema, PROFICIENCY_RANKS, replaceRewardPlaceholders, type Challenge, type HeroData, type HeroRole, type PlayerHeroStore, type PreferencesStore, type ProficiencyRank, type Reward } from '~/assets/data/common';
import { createHero, deleteHero, editHero, HERO_LIST, UNKNOWN_HERO } from '~/assets/data/heroes';
import AverageStatsModal, { type AverageStatsOutput } from '~/components/modals/AverageStatsModal.vue';
import ListSelect from '~/components/modals/ListSelect.vue';
import ModifyHeroData from '~/components/modals/ModifyHeroData.vue';
import { changeColor } from '~/utils/util';
import { calculateTimesToLevel, Calculator } from '~/services/calculator';
import { tex, texUrl } from '~/assets/data/textures';
import ConfigureHeroModal from '~/components/modals/ConfigureHeroModal.vue';
import ConfirmModal from '~/components/modals/ConfirmModal.vue';
import { useAbsoluteUrl } from '~/composables/config';
import ConvertUnknownHeroModal from '~/components/modals/ConvertUnknownHeroModal.vue';
import ProficiencyPointsModal from '~/components/modals/ProficiencyPointsModal.vue';
import type { TooltipBinding } from '~/directives/tooltip';
import { ACHIEVEMENT_CATEGORIES, getAchievements, type AchievementTypeCategory } from '~/assets/data/achievements/achievements';
import { getAllCategories, getCategoryIcon } from '~/assets/data/cosmetics/costumes/costumes';
import type { NavBarMarks } from '~/components/ui/nav/Bar.vue';
import EditUnknownHeroImages, { type AnimationProperties } from '~/components/modals/EditUnknownHeroImages.vue';
import { deleteHeroImage, getAllHeroImages, HERO_IMAGES, saveHeroImage, type HeroImages } from '~/services/hero-image-operations';

type PageId = 'overview'|'customize'|'estimates'|'planner'|'achievements'|'costumes';
const PAGE_IDS = ['overview', 'customize', 'estimates', 'planner', 'achievements', 'costumes'];

const { openModal, cancelModal } = useModalManager();
const { notify } = useNotificationManager();

const unknownHeroes = useLocalStorage<HeroData[]>('unknown_heroes', []);

const router = useRouter();
const route = useRoute();
const pageFromUrl = computed<PageId>(() => {
    const slug = Array.isArray(route.params.slug) ? route.params.slug?.[0] : route.params.slug;
    if (!slug)
        return 'overview';

    if (!PAGE_IDS.includes(slug) || (Array.isArray(slug) && slug.length > 1))
        throw createError({ statusCode: 404, message: `Page not found`, stack: `` });

    return slug as PageId;
});

const heroId = route.params.id as string;
const unknownHero = unknownHeroes.value.find(h => h.id === heroId);
const hero = ref<HeroData>(HERO_LIST.find(h => h.id === heroId) ?? unknownHero!);

const isUnknownHero = computed(() => !!unknownHero);

const { back, backPath } = useBackButton({
    currentSection: '/heroes/',
    fallback: '/heroes'
});

const backLink = computed(() => (route.query?.from as string) ?? backPath.value);
const backLinkQuery = computed(() => {
    if (!route.query?.from)
        return '';

    return '?from=' + (route.query?.from as string);
})

// new hero
if (heroId == 'new') {
    // to not crash the page
    hero.value = UNKNOWN_HERO();

    function errorNotify() {
        notify(
            `An unexpected error occured and we couldn't save the hero's data.`,
            3000,
            { image: 'warning', color: '#c94f36' }
        );
    }

    const configureHeroModal = openModal(ConfigureHeroModal, {
        title: 'Set Up Hero',
        message: 'In case this tool is no longer updated, you can add new heroes through this interface.'
    })

    configureHeroModal
    .promise
    .then((hero: HeroData) => {
        if (!hero || !hero.id) {
            errorNotify();
            router.push(backLink.value);
            return;
        }

        // add hero to local storage or route back on error
        if (!createHero(hero)) {
            errorNotify();
            router.push(backLink.value);
            return;
        }

        notify(
            `Hero created successfully!`,
            3000,
            { image: 'check', color: '#458a14' }
        );

        // success, route to new hero
        router.push('/heroes/' + hero.id);
    })
    .catch(e => {
        if (e === 'unmounted')
            return;

        let backLink = '/heroes';
        if (route.query?.from)
            backLink = route.query.from as string;

        router.push(backLink);
    })

    onUnmounted(() => cancelModal(configureHeroModal.id, 'unmounted'));
}

if (!hero.value)
    throw createError({ statusCode: 404, message: `Hero doesn't exist!`, stack: `` });

let description: string|undefined = `View all proficiency rewards, see time estimates to reach set goals, and plan your grind for ${hero.value.name} in Marvel Rivals.`;

// custom seo is ssr only for prerendering
const hasGenericAvgStats = !!getAverageStatsForHero(hero.value.id);
if (import.meta.server && hasGenericAvgStats) {
    const estimates = calculateTimesToLevel(hero.value, {
        level: 1,
        points: 0,
        goal: 70,
        averageStats: {},
        averageStatsArcade: {},
        arcadeMaxFeasableMissions: 2
    });

    let totalTimeToLord = 0;
    let totalTimeToChampion = 0;
    let totalTimeToFinish = 0;

    const ranks = Object.keys(PROFICIENCY_RANKS);
    const rankLordIndex = ranks.indexOf('lord');
    const rankChampionIndex = ranks.indexOf('champion');

    estimates.forEach(({ time: [_, avg] }, index) => {
        if (index < rankLordIndex)
            totalTimeToLord += avg;
        if (index < rankChampionIndex)
            totalTimeToChampion += avg;
        
        totalTimeToFinish += avg;
    });

    if (totalTimeToFinish != 0)
        description = `View all proficiency rewards, see time estimates to reach set goals, and plan your grind for ${hero.value.name} in Marvel Rivals. It takes ${secondsToHoursString(totalTimeToLord)}h on average to get Lord on ${hero.value.name}, ${secondsToHoursString(totalTimeToChampion)}h to get the animated icon and ${secondsToHoursString(totalTimeToFinish)}h total for the Legendary title. Do you think you can get them faster?`;
}
else if (import.meta.client && hasGenericAvgStats)
    description = undefined;

const url = useCanonicalUrl('heroes', hero.value.id);
useSeoMeta({
    title: `${hero.value.name} | MR Proficiency Calculator`,
    description,

    ogTitle: `${hero.value.name} | MR Proficiency Calculator`,
    ogUrl: url,
    ogImage: useAbsoluteUrl(`/img/seo/heroes/${hero.value.id}.webp`),
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'Heroes | Marvel Rivals Proficiency Calculator - Calculate how long it takes to unlock every proficiency reward for any hero',

    twitterTitle: `${hero.value.name} | MR Proficiency Calculator`,
    twitterDescription: description,
    twitterImage: useAbsoluteUrl(`/img/seo/heroes/${hero.value.id}.webp`),
    twitterImageAlt: 'Heroes | Marvel Rivals Proficiency Calculator - Calculate how long it takes to unlock every proficiency reward for any hero',
});

useHead({
    link: [
        {
            rel: "canonical",
            href: url
        }
    ]
});

definePageMeta({
    layout: 'no-layout'
});

const navBarMarks = computed(() => ({
    customize: !(hasAvgStats.value && !isLv1AndGoalLv1.value && !isIncorrectSelection.value) ? 
        'warning-bubble' : 'none',
    estimates: !storedLevel.value.openedCalculator ? 'warning-bubble' : 'none',
    // costumes: !preferences.value.sawCosmeticsTab ? 'new' : 'none'
} satisfies NavBarMarks));

const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);

const favourites = useLocalStorage<HeroData['id'][]>(`favourite_heroes`, []);
const isFavourite = computed(() => favourites.value.includes(hero.value.id));
function toggleFavourite() {
    if (!hero.value)
        return;

    if (isFavourite.value) {
        favourites.value.splice(favourites.value.indexOf(hero.value.id), 1);

        notify(
            `Removed <b>${hero.value.name}</b> from your favourites`,
            3000, 
            { image: 'favourite', color: 'var(--color)' }
        );
    }
    else {
        favourites.value.push(hero.value.id);

        notify(
            `Added <b>${hero.value.name}</b> to your favourites`,
            3000, 
            { image: 'favourite', color: 'var(--color)' }
        );
    }
}

const storedLevel = useLocalStorage<PlayerHeroStore>(`hero_${hero.value.id}`, DEFAULT_HERO_STORE(), PlayerHeroStoreSchema);
const hasAvgStats = useHasAvgStats(hero);
const hasAvgArcadeStats = useHasAvgArcadeStats(hero);
const isMultiRole = computed(() => Array.isArray(hero.value.roles) && hero.value.roles.length > 1);
const isLv1AndGoalLv1 = computed(() => storedLevel.value.level == 1 && storedLevel.value.goal == 1);
const unknownHeroHasPossibleMatch = useUnknownHeroHasPossibleMatch(hero.value).value.length;
const isIncorrectSelection = computed(() => storedLevel.value.goal <= storedLevel.value.level);
const rolesWithAvgStats = useRolesWithAvgStats(hero);


const page = ref<PageId>(pageFromUrl.value);
watch(pageFromUrl, (newPage, oldPage) => {
    if (newPage == oldPage)
        return;

    page.value = newPage;
});


const contentDiv = useTemplateRef('content');
function setPage(newPage: PageId) {
    const contentDivAABB = contentDiv.value?.getBoundingClientRect();
    let scrollTo = (window?.scrollY ?? 0) + (contentDivAABB?.top ?? 0);
    if (scrollTo > 65)
        scrollTo -= 65;

    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);

    page.value = newPage;

    setPreferences(newPage);
}

// one time check for unknown heroes with wrong url
if (isUnknownHero.value && ['achievements'].includes(page.value)) {
    router.replace({
        path: `/heroes/${hero.value.id}`
    });
}

const showEditPopup = ref(false);
const showQuickEditPopup = ref(false);
watch(showQuickEditPopup, (value) => {
    if (value)
        return;

    // show next popup
    tryShowEditPopup();
});
function tryShowEditPopup() {
    if (!preferences.value.sawHeroQuickEditPopup) {
        preferences.value.sawHeroQuickEditPopup = true;

        showQuickEditPopup.value = true;
        return;
    }

    if (preferences.value.sawHeroEditPopup)
        return;

    preferences.value.sawHeroEditPopup = true;

    showEditPopup.value = true;
    setTimeout(() => 
        showEditPopup.value = false
    , 5000);
}

function setPreferences(page: PageId) {
    if (page == 'estimates' && !storedLevel.value.openedCalculator)
        storedLevel.value.openedCalculator = true;
    if (page == 'customize')
        tryShowEditPopup();
    if (page == 'costumes')
        preferences.value.sawCosmeticsTab = true;
}
setPreferences(page.value);

const selectedRank = ref<ProficiencyRank['id']>(storedLevel.value.rank);

const obtainedRewards = computed(() => {
    const checkedLevels: number[] = [];
    ranksLoop: for (const rank of hero.value.ranks)
        for (const reward of rank.type.rewards) {
            if (reward.level > storedLevel.value.level)
                break ranksLoop;

            checkedLevels.push(reward.level)
        }

    return checkedLevels;
});

const currentRankComp = computed(() => {
    return { 
        rank: PROFICIENCY_RANKS[storedLevel.value.rank] ?? PROFICIENCY_RANKS.agent!,
        level: storedLevel.value.level,
        points: storedLevel.value.points
    };
});
const pointsSliderModel = ref(storedLevel.value.points);
watch(() => storedLevel.value.points, (points) => {
    pointsSliderModel.value = points;
});

const finishedAnimation = useSawCalculatorAnimation();

const canLevelUp = computed(() => {
    const level = storedLevel.value.level;
    const maxRank = Object.values(PROFICIENCY_RANKS).at(-1)!;

    return { state: level + 1 <= maxRank.levelEnd, level };
})
function levelUp() {
    if (!canLevelUp.value.state)
        return;

    setLevel(canLevelUp.value.level + 1);

    storedLevel.value.points = 0;

    notify(
        `Leveled up to LV${canLevelUp.value.level}!`,
        2000, 
        { image: 'levelUp', width: 20, height: 20, color: 'var(--color)' }
    );
}

function setLevel(level: number) {
    storedLevel.value.level = level;
    storedLevel.value.rank = levelToRank(level)?.id ?? PROFICIENCY_RANKS.agent!.id;
    if (storedLevel.value.points > PROFICIENCY_RANKS[storedLevel.value.rank]!.xpPerLevel)
        storedLevel.value.points = PROFICIENCY_RANKS[storedLevel.value.rank]!.xpPerLevel - 1;

    selectedRank.value = storedLevel.value.rank;
}

function openWhereModal(where: string, returnToModal = true) {
    if (where == 'proficiency-points')
        editProficiencyPoints(returnToModal ? modifyHeroData : undefined);
    else if (where == 'level')
        selectCurrentLevel(returnToModal ? modifyHeroData : undefined);
    else if (where == 'stats')
        editAvgStats(returnToModal ? modifyHeroData : undefined);
    else if (where == 'goal')
        selectLevelGoal(returnToModal ? modifyHeroData : undefined);
    else if (where == 'edit-unknown-hero')
        editUnknownHero(returnToModal ? modifyHeroData : undefined);
    else if (where == 'edit-unknown-hero-images')
        editUnknownHeroImages(returnToModal ? modifyHeroData : undefined);
    else if (where == 'convert-unknown-hero')
        convertUnknownHero(returnToModal ? modifyHeroData : undefined);
    else if (where == 'delete-unknown-hero')
        deleteUnknownHero(returnToModal ? modifyHeroData : undefined);
}

function modifyHeroData() {
    openModal(ModifyHeroData, {
        title: `${hero.value.name} options`,
        hero: hero.value,
        isUnknownHero: isUnknownHero.value
    })
    .promise
    .then(openWhereModal)
    .catch(() => null)
}

function selectCurrentLevel(callback = () => {}, callbackOnSuccess = false) {
    openModal(ListSelect, {
        title: 'Select your current level',
        hero: hero.value,
        showAllLevels: true,
        currentLevel: storedLevel.value.level
    })
    .promise
    .then((level: number) => {
        setLevel(level);

        notify(
            `Updated your level!`,
            2000, 
            { image: 'check', width: 20, height: 20, color: 'var(--color)' }
        );

        if (callbackOnSuccess)
            callback();
    })
    .catch(callback);
}

function editProficiencyPoints(callback = () => {}, callbackOnSuccess = false) {
    openModal(ProficiencyPointsModal, {
        title: 'Edit your proficiency points',
        inputPlaceholder: 'Type your points...',
        inputValue: storedLevel.value.points,
        numberInput: {
            step: 50,
            min: 0,
            max: currentRankComp.value.rank.xpPerLevel - 1
        },

        hero
    })
    .promise
    .then((points: number) => {
        points = parseFloat(points as any) || 0;

        if (points < 0)
            points = 0;
        if (points > currentRankComp.value.rank.xpPerLevel)
            points = currentRankComp.value.rank.xpPerLevel - 1;

        storedLevel.value.points = points;

        notify(
            `Updated your proficiency points!`,
            2000, 
            { image: 'proficiency', state: 'hover' }
        );

        if (callbackOnSuccess)
            callback();
    })
    .catch(callback);
}

function editAvgStats(callback = () => {}, callbackOnSuccess = false, arcade = false) {
    openModal<AverageStatsOutput>(AverageStatsModal, {
        title: 'Set your average stats',
        message: 'Input your Avg/10 Mins stats to get accurate time spans to get your desired rewards!',
        hero: hero.value,
        tab: arcade ? 'arcade' : undefined,

        stats: storedLevel.value.averageStats,
        statsPerRole: isMultiRole.value ? (storedLevel.value.averageStatsPerRole ?? {}) : undefined,
        arcadeStats: storedLevel.value.averageStatsArcade,
        arcadeStatsPerRole: isMultiRole.value ? (storedLevel.value.averageStatsArcadePerRole ?? {}) : undefined,
    })
    .promise
    .then(({stats, statsArcade, roleStats, arcadeRoleStats}) => {
        if (stats) {
            const parsedStats: Record<string, number> = {};
            Object.entries(stats).forEach(([type, value]) =>
                parsedStats[type] = parseFloat(value) || 0
            );

            storedLevel.value.averageStats = parsedStats;
        }


        if (statsArcade) {
            const parsedStatsArcade: Record<string, number> = {};
            Object.entries(statsArcade).forEach(([type, value]) => {
                if (type == 'play') {
                    parsedStatsArcade[type] = 0;

                    return;
                }

                const parsedValue = parseFloat(value);
                if (!parsedValue || isNaN(parsedValue))
                    return;

                parsedStatsArcade[type] = parsedValue;
            });

            storedLevel.value.averageStatsArcade = parsedStatsArcade;
        }

        if (roleStats) {
            if (!storedLevel.value.averageStatsPerRole)
                storedLevel.value.averageStatsPerRole = {};

            objectEntries(roleStats).forEach(([role, stats]) => {
                const parsedStats: Record<string, number> = {};
                Object.entries(stats!).forEach(([type, value]) => {
                    if (type == 'play') {
                        parsedStats[type] = 0;

                        return;
                    }

                    const parsedValue = parseFloat(value);
                    if (!parsedValue || isNaN(parsedValue))
                        return;

                    parsedStats[type] = parsedValue;
                });

                storedLevel.value.averageStatsPerRole![role] = parsedStats;
            });
        }

        if (arcadeRoleStats) {
            if (!storedLevel.value.averageStatsArcadePerRole)
                storedLevel.value.averageStatsArcadePerRole = {};

            objectEntries(arcadeRoleStats).forEach(([role, stats]) => {
                const parsedStatsArcade: Record<string, number> = {};
                Object.entries(stats!).forEach(([type, value]) => {
                    if (type == 'play') {
                        parsedStatsArcade[type] = 0;

                        return;
                    }

                    const parsedValue = parseFloat(value);
                    if (!parsedValue || isNaN(parsedValue))
                        return;

                    parsedStatsArcade[type] = parsedValue;
                });

                storedLevel.value.averageStatsArcadePerRole![role] = parsedStatsArcade;
            });
        }

        notify(
            `Updated your average stats!`,
            2000, 
            { image: 'gameTime', color: 'var(--color)' }
        );

        if (callbackOnSuccess)
            callback();
    })
    .catch(callback)
}

function selectLevelGoal(callback = () => {}, callbackOnSuccess = false) {
    openModal(ListSelect, {
        title: 'Set your level/reward goal!',
        hero: hero.value,
        showAllLevels: true,
        currentLevel: storedLevel.value.goal
    })
    .promise
    .then((level: number) => {
        setGoal(level);

        if (callbackOnSuccess)
            callback();
    })
    .catch(callback)
}

function editUnknownHero(callback = () => {}, callbackOnSuccess = false) {
    const currentId = `${hero.value.id}`

    function errorNotify(message = `An unexpected error occured and we couldn't save the hero's data.`) {
        notify(
            message,
            3000,
            { image: 'warning', color: '#c94f36' }
        );
    }

    openModal(ConfigureHeroModal, {
        title: 'Edit Hero',
        message: 'Edit the custom hero\'s properties',
        hero: structuredClone(extractRawValue(hero))
    })
    .promise
    .then(async (editedHero: HeroData) => {
        if (!editedHero || !editedHero.id) {
            errorNotify();
            return;
        }

        // add hero to local storage or route back on error
        const res = await editHero(currentId, editedHero);
        if (res !== true) {
            errorNotify(res);
            return;
        }

        if (callbackOnSuccess)
            callback();

        hero.value = editedHero as HeroData;

        notify(
            `Hero data edited successfully!`,
            3000,
            { image: 'check', color: '#458a14' }
        );

        if (currentId != editedHero.id) {
            // success, route to new hero if id changed
            router.replace('/heroes/' + editedHero.id);
        }
    })
    .catch(callback)
}

async function editUnknownHeroImages(callback = () => {}, callbackOnSuccess = false) {
    openModal(EditUnknownHeroImages, {
        title: 'Edit Hero Images',
        hero: structuredClone(extractRawValue(hero)),
        heroImages: await getAllHeroImages(hero.value)
    })
    .promise
    .then(async (result: { color: string, images: HeroImages, animation: AnimationProperties }) => {
        hero.value.color = result.color;

        objectEntries(result.images)
            .forEach(([key, blob]) => {
                if (typeof blob === 'undefined')
                    return;

                if (blob === null) {
                    deleteHeroImage(hero.value.id, key).catch(() => {
                        notify(
                            `An unexpected error occured. We couldn't delete the "${HERO_IMAGES[key]!.name}" image.`,
                            5000,
                            { image: 'warning', color: '#c94f36' }
                        );
                    });

                    return;
                }

                saveHeroImage(hero.value.id, key, blob).catch((e) => {
                    console.error(e);
                    notify(
                        `An unexpected error occured. We couldn't save the "${HERO_IMAGES[key]!.name}" image.`,
                        5000,
                        { image: 'warning', color: '#c94f36' }
                    );
                })
            });

        revokeHeroImageCache(hero.value.id);

        const defaultHero = UNKNOWN_HERO();
        hero.value.iconAnimationSize = result.animation.iconAnimationSize ?? defaultHero.iconAnimationSize;
        hero.value.iconAnimationOffset = result.animation.iconAnimationOffset ?? defaultHero.iconAnimationOffset;
        hero.value.iconLargeAnimationOffset = result.animation.iconLargeAnimationOffset ?? defaultHero.iconLargeAnimationOffset;
        
        notify(
            `Hero images edited successfully!`,
            3000,
            { image: 'check', color: '#458a14' }
        );
        if (callbackOnSuccess)
            callback();
    })
    .catch(callback)
}

function convertUnknownHero(callback = () => {}, callbackOnSuccess = false) {
    openModal(ConvertUnknownHeroModal, {
        title: 'Convert Hero',
        message: 'Moves your stats and progression to an existing hero <br/> <i>(use this when heroes you added manually have been added officially to the calulcator)</i>',
        hero: structuredClone(extractRawValue(hero))
    })
    .promise
    .then(async (heroId: string) => {
        const officialHero = HERO_LIST.find(h => h.id == heroId)

        if (!officialHero) {
            notify(
                `An unexpected error occured. We couldn't find the target hero.`,
                3000,
                { image: 'warning', color: '#c94f36' }
            );

            return;
        }

        // check missions
        const matchesMissions = !officialHero.ranks[0]?.challenges.some(c =>
            !hero.value.ranks[0]?.challenges.some(hc => hc.type === c.type)
        );

        if (!matchesMissions) {
            notify(
                `Conversion failed. Missions of the custom hero don't match those of the target hero.`,
                5000,
                { image: 'warning', color: '#c94f36' }
            );

            return;
        }

        if (isFavourite.value) {
            const favIndex = favourites.value.indexOf(hero.value.id);
            favourites.value.splice(favIndex, 1);

            if (!favourites.value.includes(heroId))
                favourites.value.push(heroId);
        }

        changeLocalStorageKey(`hero_${hero.value.id}`, `hero_${heroId}`);
        deleteFromLocalStorage(`hero_${hero.value.id}`);
        deleteHero(hero.value.id);

        try {
            await Promise.all(Object.keys(HERO_IMAGES).map(key =>
                deleteHeroImage(hero.value.id, key as keyof typeof HERO_IMAGES)
            ))
        }
        catch {
            notify(
                `Failed to delete some or all custom hero images.`,
                5000,
                { image: 'warning', color: '#c94f36' }
            );
        }

        if (callbackOnSuccess)
            callback();

        notify(
            `Hero converted successfully!`,
            3000,
            { image: 'check', color: '#458a14' }
        );

        // success, route to new hero
        router.replace('/heroes/' + heroId);
    })
    .catch(callback)
}

function deleteUnknownHero(callback = () => {}, callbackOnSuccess = false) {
    openModal(ConfirmModal, {
        title: 'Delete Hero',
        message: 'Are you sure you want to delete this hero? This action is irreversible.',
    })
    .promise
    .then(() => {
        deleteHero(hero.value.id);

        if (callbackOnSuccess)
            callback();

        notify(
            `Hero deleted successfully!`,
            3000,
            { image: 'check', color: '#458a14' }
        );
        
        router.push('/heroes')
    })
    .catch(callback)
}

function setGoal(level: number) {
    storedLevel.value.goal = level;

    let reward: Reward = {
        icon: tex('none'),
        level,
        name: 'No Reward',
    };
    for (const rank of hero.value.ranks) {
        const tryFind = rank.type.rewards.find(r => r.level == level);

        if (tryFind) {
            reward = tryFind;
            break;
        }
    }

    const rewardName = replaceRewardPlaceholders(reward.name, hero.value);

    notify(
        `Selected <b>LV${level}</b> <i>[${rewardName}]</i> as your goal!`, 
        3000, 
        { image: 'target', color: 'var(--color)' }
    );
}

const previewReward = ref<Reward|null>(null);
function setPreviewReward(reward: Reward) {
    previewReward.value = structuredClone(reward);
}

// ==== ACHIEVEMENTS =====
const selectedAchievementsCategory = ref<AchievementTypeCategory>('heroic-journey');
const achievementList = computed(() => getAchievements(selectedAchievementsCategory.value, hero.value.id));
const availableAchievementCategories = computed(() => {
    const heroAchievements = getAchievements(undefined, hero.value.id);
    const categoryIds = [ ...new Set(heroAchievements.map(a => a.category)) ];

    return ACHIEVEMENT_CATEGORIES.filter(c => categoryIds.includes(c.id));
});

// ==== COSMETICS =====
const selectedCostumesCategories = ref<string[]>([]);
const costumeCategories = computed(() => getAllCategories(hero.value.id));

// ==== CALCULATOR =====
const timeEstimates = computed(() => {
    const calculator = new Calculator(hero.value, storedLevel.value);

    const arcade = hasAvgArcadeStats.value ? calculator.totalTimes(true) : undefined;

    return { normal: calculator.totalTimes(), arcade };
});

</script>