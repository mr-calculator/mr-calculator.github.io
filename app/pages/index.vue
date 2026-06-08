<template>
    <div class="landing">
        <InfoOverlay
            v-if="heroSelectOpen"
            title="Select a hero"
            large
            @close="heroSelectOpen = false"
        >
            <PanelHeroList
                embedded
                :links="false"
                :add-hero-enabled="false"
                :show-unknown-heroes="false"

                list-view-disabled

                @click-hero="clickHero"
            />
            <br/><br/>
        </InfoOverlay>

        <Tex
            class="left-triangle"
            image="leftTriangle"
            
            
            width="60px"
            height="200px"
        />
        <Tex
            class="right-triangle"
            image="rightTriangle"
            
            
            width="60px"
            height="200px"
        />

        <!-- <header>
            <div class="logo">
                <Tex
                    image="logo"

                    width="80px"
                    height="80px"

                    object-fit="contain"
                />
                <h2 class="marvel">
                    <span class="keep">M</span><span class="collapse">ARVEL</span><span class="space">&nbsp;</span><span class="keep">R</span><span class="collapse">IVALS</span>
                </h2>
                <h2 class="calc">
                    <span class="no-color top">PROFICIENCY</span><span class="space">&nbsp;</span><span class="no-color bottom">CALCULATOR</span>
                </h2>
            </div>
            <div id="header-cta" class="cta">
                <FormButton to="/heroes" size="small">
                    <span class="mobile">Go</span>
                    <span class="desktop">Start Calculating</span>

                    <Tex
                        image="arrowRight"
                        color="var(--dark)"

                        width="30px"
                        height="30px"

                        object-fit="contain"
                    />
                </FormButton>
            </div>
        </header> -->
        <main>
            <section id="hero" class="hero h100 separator">
                <FeaturedHeroPromo
                    v-if="!!featuredHero"
                    :hero="featuredHero"

                    class="featured-hero-desktop"
                />
                <div class="right-wrapper">
                    <div class="info-wrapper">
                        <div class="info">
                            <div class="proficiency-icons-anim-wrapper">
                                <div class="logo-large">
                                    <Tex
                                        image="logoLarge"

                                        width="300px"
                                    />
                                </div>

                                <div class="proficiency-icons-anim">
                                    <img
                                        v-for="{ icon, name } in duplicateProficiencyRanks"
                                        class="proficiency-icon"
                                        :src="icon"
                                        :alt="`${name} Proficiency Icon`"
                                        draggable="false"
                                    />
                                </div>
                            </div>
                            <h1 id="hero-title">
                                Plan Your Path to <span id="hero-title-mastery">Mastery</span>
                            </h1>
                            <h2 id="hero-subtitle">
                                Calculate exactly how long it takes to unlock every proficiency reward for any hero
                            </h2>
                        </div>

                        <FormButton
                            id="hero-cta"
                            class="call-to-action"
                            to="/heroes"
                        >
                            Start Calculating
                        </FormButton>
                    </div>

                    <FeaturedHeroPromo
                        v-if="!!featuredHero"
                        :hero="featuredHero"

                        class="featured-hero-mobile"
                    />
                </div>
            </section>
            <section id="credibility" class="credibility h100">
                <div class="hero-matches">
                    <PanelHorizontalScrollContainer
                        class="hero-list"
                        ref="heroListContainer"
                    >
                        <ul>
                            <li
                                v-for="hero in allHeroesWithStats"
                                :key="hero.heroId"

                                :class="{
                                    '_gsap-hero-list-item': 1,
                                    selected: credibilitySelectedHeroId == hero.heroId
                                }"
                            >
                                <div
                                    class="bar"
                                    :style="{
                                        '--progress': hero.percent,
                                        '--hero-color': hero._hero.color,
                                        '--hero-color-light': changeColor(hero._hero.color, 80),
                                        '--hero-color-dark': changeColor(hero._hero.color, -30),
                                        '--hero-color-darker': changeColor(hero._hero.color, -1000)
                                    }"
                                >
                                    <div
                                        class="avatar"
                                        @click="credibilityClickHero(hero.heroId)"

                                        v-tooltip="({
                                            text: `See <b>average stats</b>`,
                                            icon: 'mouseLeft'
                                        } satisfies TooltipBinding)"
                                    >
                                        <img
                                            :src="hero._hero.dataDir + 'spray.webp'"
                                            :alt="`${hero.heroName} Logo (Spray)`"
                                            draggable="false"
                                        />
                                        <span v-if="hero.featured">NEW</span>
                                    </div>
                                    <div
                                        class="inner"
                                        @click="credibilityClickHero(hero.heroId)"

                                        v-tooltip="({
                                            text: `See <b>average stats</b>`,
                                            icon: 'mouseLeft'
                                        } satisfies TooltipBinding)"
                                    >
                                        <template v-if="hero.matchCount">
                                            <h3>{{ hero.matchCount?.toLocaleString() ?? 0 }}</h3>
                                            <p>MATCHES</p>
                                        </template>
                                        <template v-else>
                                            <p>0 MATCHES</p>
                                            <h3 class="not-yet">COMING SOON</h3>
                                        </template>
                                    </div>
                                </div>

                                <h3 class="name">
                                    {{ hero.heroName }}
                                </h3>
                            </li>
                            <li class="spacer" />
                        </ul>
                    </PanelHorizontalScrollContainer>
                </div>
                <div class="info">
                    <h2 class="animate-text lines">
                        Built using real match data from <span>{{ totalMatches }}+</span> games
                    </h2>
                    <ul class="free">
                        <li>Open source</li>
                        <li>Free forever</li>
                        <li>No account needed</li>
                    </ul>
                    <Transition>
                        <div
                            v-if="credibilitySelectedHeroId != null && credibilitySelectedHero"
                            class="hero-data"
                        >
                            <h3 class="profile">
                                {{ credibilitySelectedHero.heroName }}
                            </h3>
                            <template
                                v-if="credibilitySelectedHero.avgStats"
                            >
                                <h4>Average Stats per 10 minutes</h4>
                                <ul class="stats with-border-decorations">
                                    <li
                                        v-for="[statType, statValue] in Object.entries(credibilitySelectedHero.avgStats)"
                                    >
                                        <img
                                            :src="CHALLENGE_ICONS[statType as Challenge['type']]!"
                                            :alt="`${CHALLENGE_NAMES[statType as Challenge['type']]!} Icon`"
                                            draggable="false"
                                        >
                                        <p>{{ CHALLENGE_NAMES[statType as Challenge['type']]! }}</p>
                                        <p class="stat-value">{{ statValue.toLocaleString(undefined, { maximumFractionDigits: 1 }) }}</p>
                                    </li>
                                </ul>
                            </template>
                            <div v-else class="no-stats">
                                <h3>Looks like we don't have generic stats for {{ credibilitySelectedHero._hero.name }} yet.</h3>
                            </div>

                            <br/>
                            <FormButton
                                class="go-to-hero"
                                size="tiny"
                                :to="`/heroes/${credibilitySelectedHeroId}`"
                            >
                                GO TO HERO
                                <Tex
                                    image="arrowRight"

                                    color="var(--blue)"
                                    width="28px"
                                    height="20px"
                                />
                            </FormButton>
                        </div>
                    </Transition>
                </div>
            </section>
            <section id="rewards" class="showcase-rewards double h100">
                <div class="rewards-sticky-title">
                    <h2 class="animate-text lines">
                        Browse every proficiency reward for every hero
                    </h2>
                    <h3>
                        all in one place
                    </h3>

                    <div class="hero-swap">
                        <div class="name" @click="heroSelectOpen = true">
                            <div class="background">
                                <div class="details" />
                            </div>

                            <span>{{ currentHero.name }}</span>
                            <Tex
                                image="swap"
                                color="var(--dark)"

                                width="20px"
                                height="20px"
                                object-fit="contain"
                            />
                        </div>
                    </div>
                </div>
                <div class="rewards-showcase showcase with-corner-decorations">
                    <UiCorners />
                    <PanelHeroProficiencyRewardList
                        class="_gsap-hero-reward-container with-border-decorations"
                        :hero="currentHero"
                        contrast-mode
                        no-clicking
                    />
                </div>
            </section>
            <section id="question" class="question separator separator-top">
                <div class="content">
                    <h2>
                        Ever wondered how much more you have to grind to get that sweet <span id="champion-icon-text">Champion Icon</span>?
                    </h2>
                    <h3>Well, even if you didn't, you can find an answer here.</h3>
                </div>
                <div class="graphics">
                    <div id="lord-icon-large" class="lord-icon-container">
                        <Tex
                            class="frame-bg"
                            image="heroSelectFrameGold"

                            width="350px"
                            height="150px"
                        />
                        <Tex
                            class="frame-right"
                            image="heroSelectFrameRightGold"

                            width="350px"
                            height="150px"
                        />
                        <Tex
                            class="shine"
                            image="star"

                            width="80px"
                            height="80px"
                        />
                        <div class="animated-icon-wrapper">
                            <UiAnimatedIcon
                                class="animated-icon"
                                :style="{
                                    '--mask-url': `url('${currentHero.iconLargeMask ?? DEFAULT_ANIMATED_ICON_LARGE_MASK}')`
                                }"
                                :reward="currentHeroAnimatedIconReward"
                                :size="350"
                            />
                        </div>
                        <Tex
                            class="frame-left"
                            image="heroSelectFrameLeftGold"

                            width="350px"
                            height="150px"
                        />

                        <img
                            class="badge"
                            src="/img/common-rewards/champion-badge.webp"
                            alt="Champion Icon"
                            draggable="false"
                        />
                        <img
                            v-if="heroHasRoleIcon"
                            class="role"
                            :src="heroRoleIcon"
                            alt="Hero Role Icon"
                            draggable="false"
                        >
                    </div>
                </div>

                <div class="hero-skin">
                    <img
                        v-if="currentHero.id != 'black-panther'"
                        :src="`/img/heroes/data/${currentHero.id}/costumes/${randomHeroCostume.id}.webp`"
                        :alt="randomHeroCostume.name"
                        draggable="false"
                    />
                    <img
                        v-else
                        src="/img/tex/promo/the-thing-cassius-thundercock.webp"
                        alt="The Thing - You speaking spanish boy?"
                        draggable="false"
                    />
                </div>
            </section>
            <section class="custom-estimates double reverse h100">
                <div class="avg-stats-showcase showcase with-border-decorations with-corner-decorations">
                    <UiCorners />
                    <ModalsAverageStatsModal
                        ref="averageStatsModal"
                        :hero="currentHero"
                        :stats="{}"

                        headless
                        :hide-generic-stats="inputtedAvgStats"
                        :tab="avgStatsModalTab"
                    />
                </div>
                <div class="title">
                    <h2 class="animate-text">
                        Generic estimates don't account for how <span>YOU</span> play
                    </h2>
                    <h3>
                        By putting in your <span>own</span> stats, you get the most accurate results
                    </h3>
                    <br/>
                    <h4>
                        Choose between Quickmatch/Competitive and Arcade modes for the most exact estimates!
                    </h4>
                </div>
            </section>
            <section class="results titled h100">
                <div class="title">
                    <h3 class="animate-text">Your Damage, Your Healing, Your Stats</h3>
                    <h2 class="animate-text">Your Estimates, Your <span>Time</span></h2>
                </div>
                <div class="calculator-showcase showcase with-border-decorations with-corner-decorations">
                    <UiCorners />

                    <PanelCalculator
                        ref="calculatorPanel"
                        :hero="currentHero"
                        :level="simulatedPlayerHeroStore"
                        :time-estimates="timeEstimates.normal"
                        :time-estimates-arcade="timeEstimates.arcade"
                        animate
                        halt-animation
                    />
                </div>
            </section>

            <section class="planner titled h100">
                <div class="title">
                    <h3 class="animate-text"><i>“<span>How many</span> matches a day do I need to hit LV50 by Friday?”</i></h3>
                    <h2 class="animate-text">Well, let's see</h2>
                </div>

                <div class="planner-mobile showcase with-border-decorations">
                    <PanelPlanner
                        :hero="currentHero"
                        v-model="plannerHeroStoreMobile"
                        :time-estimates="timeEstimates.normal"
                        :time-estimates-arcade="timeEstimates.arcade"
                    />
                </div>
                <div class="planners-view">
                    <div class="planner-showcase showcase with-border-decorations with-corner-decorations">
                        <UiCorners :right-top="false" :right-bottom="false" />

                        <PanelPlanner
                            :hero="currentHero"
                            v-model="plannerHeroStoreNumberOfDays"
                            :time-estimates="timeEstimates.normal"
                            :time-estimates-arcade="timeEstimates.arcade"

                            @open-arcade-stats-menu="editArcadeStats"
                        />
                    </div>
                    <div class="planner-showcase showcase with-border-decorations with-corner-decorations">
                        <UiCorners :left-top="false" :left-bottom="false" />

                        <PanelPlanner
                            :hero="currentHero"
                            v-model="plannerHeroStoreWeekly"
                            :time-estimates="timeEstimates.normal"
                            :time-estimates-arcade="timeEstimates.arcade"

                            :value-linking="false"
                            @open-arcade-stats-menu="editArcadeStats"
                        />
                    </div>
                </div>
            </section>

            <section class="future-proofing double separator">
                <div class="new-hero-image">
                    <img src="/img/tex/promo/new-hero.webp" alt="Missing Hero Logo" draggable="false" />
                </div>
                <div class="new-hero">
                    <h3 class="animate-text">A new hero was added to <span>MARVEL RIVALS</span>, but not here?</h3>
                    <h2 class="animate-text"><span>No problem</span>, you can still use the calculator</h2>

                    <br/>
                    <FormButton id="new-hero-button" color-scheme="white" to="/heroes/new">
                        JUST ADD IT YOURSELF!
                    </FormButton>
                </div>
            </section>

            <section class="achievements titled">
                <div class="title">
                    <h2 class="animate-text">Track your hero <span>achievements</span></h2>
                    <h3 class="animate-text"><span>{{ heroPossesiveName }}</span> achievements</h3>
                </div>

                <div class="panel-wrapper with-corner-decorations">
                    <UiCorners />
                    <PanelAchievements
                        :category="selectedAchievementsCategory"
                        :achievements="achievementList"
                    />
                </div>

                <div class="all-cta">
                    <h3>Or view and track all achievements in the game</h3>
                    <FormButton to="/achievements">
                        ALL ACHIEVEMENTS
                    </FormButton>
                </div>
            </section>

            <section class="costumes titled double reverse separator">
                <div class="showcase with-border-decorations with-corner-decorations">
                    <UiCorners />
                    <PanelCostumeList
                        :hero="currentHero"
                        v-model="costumeFilters"
                    />
                </div>

                <div class="title">
                    <h2 class="animate-text">
                        Check out all heroes' <span>costumes</span>
                    </h2>
                    <h3>
                        Track which costumes you <span>own</span>!
                    </h3>

                    <FormButton
                        class="all-costumes"
                        to="/costumes"
                        size="small"
                    >
                        OR SEE ALL COSTUMES
                    </FormButton>

                    <div class="hero-swap">
                        <div class="name" @click="heroSelectOpen = true">
                            <div class="background">
                                <div class="details" />
                            </div>

                            <span>{{ currentHero.name }}</span>
                            <Tex
                                image="swap"
                                color="var(--dark)"

                                width="20px"
                                height="20px"
                                object-fit="contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section class="changelog titled">
                <div class="title">
                    <h2>Recent changes</h2>
                </div>

                <PanelChangelog
                    class="list"
                    :limit="2"
                    theme="light"
                    :with-commits="false"
                />

                <FormButton to="/changelog">
                    VIEW ALL CHANGES
                </FormButton>
            </section>

            <section id="cta-final" class="cta-final titled separator-top">
                <div class="title">
                    <h2>Ready to plan your <span>grind</span>?</h2>

                    <br/><br/><br/>

                    <FormButton id="cta-final-cta" to="/heroes">
                        Open the calculator
                    </FormButton>
                </div>
                <div class="lord-icons-grid">
                    <div
                        v-for="heroRow in lordIconsGridHeroes"
                        class="row"
                        :style="{
                            '--item-count': heroRow.length
                        }"
                    >
                        <div
                            v-for="hero in heroRow"
                            :key="hero.id"
                            class="lord-icon"
                        >
                            <div class="lord-icon-wrapper">
                                <img
                                    :src="`${hero.dataDir}bust-lord.webp`"
                                    :alt="`${hero.name} Lord Icon`"
                                    draggable="false"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<style src="@/assets/style/pages/index.sass" scoped></style>

<script setup lang="ts">
import appConfig, { useAbsoluteUrl } from '~/composables/config';
import { AVG_COMP_MATCH_DURATION_MIN,
    AVG_QUICK_MATCH_DURATION_MIN,
    CHALLENGE_ICONS,
    CHALLENGE_NAMES,
    DEFAULT_ANIMATED_ICON_LARGE_MASK,
    DEFAULT_HERO_STORE,
    DEFAULT_PLANNER_WEEKDAYS,
    DEFAULT_PREFERENCES_STORE,
    getAllMatchCount,
    getAverageStatsForHero,
    getHeroMatchCount,
    PROFICIENCY_RANKS,
    type ProficiencyRank,
    ROLE_ICONS,
    type Challenge,
    type HeroData,
    type PlayerHeroStore,
    type PreferencesStore,
    CHALLENGE_STATS,
    PreferencesStoreSchema,
    type Reward, 
} from '~/assets/data/common';
import { getFeaturedHero, HERO_LIST } from '~/assets/data/heroes';
import AverageStatsModal from '~/components/modals/AverageStatsModal.vue';
import {default as CalculatorPanel} from '~/components/panel/Calculator.vue';
import { Calculator } from '~/services/calculator';
import type HorizontalScrollContainer from '~/components/panel/HorizontalScrollContainer.vue';
import FeaturedHeroPromo from '~/components/panel/FeaturedHeroPromo.vue';
import type { TooltipBinding } from '~/directives/tooltip';
import { getAchievements, type AchievementTypeCategory } from '~/assets/data/achievements/achievements';
import { getHeroCostumes, RARITY_ORDER, type Costume, type CostumeRarity } from '~/assets/data/cosmetics/costumes/costumes';

useSeoMeta({
    title: 'Marvel Rivals Proficiency Calculator',
    description: 'Calculate exactly how long it takes to unlock every proficiency reward for any hero. Plan your grind with personalized estimates.',

    ogTitle: 'Marvel Rivals Proficiency Calculator',
    ogDescription: 'Calculate exactly how long it takes to unlock every proficiency reward for any hero.',
    ogImage: useAbsoluteUrl('/img/seo/og-image.webp'),
    ogUrl: appConfig.domainHttp,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'Marvel Rivals Proficiency Calculator - Calculate how long it takes to unlock every proficiency reward for any hero',
    
    twitterTitle: 'Marvel Rivals Proficiency Calculator',
    twitterDescription: 'Calculate exactly how long it takes to unlock every proficiency reward for any hero.',
    twitterImage: useAbsoluteUrl('/img/seo/og-image.webp'),
    twitterImageAlt: 'Marvel Rivals Proficiency Calculator - Calculate how long it takes to unlock every proficiency reward for any hero',
});

const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);
const DEFAULT_HERO = HERO_LIST.find(h => h.id == 'luna-snow')!;

const heroListContainer = ref<InstanceType<typeof HorizontalScrollContainer>>();

// ==== ANIMATIONS ====
const duplicateProficiencyRanks = ref<ProficiencyRank[]>([]);
for (let i = 0; i < 4; i++)
    duplicateProficiencyRanks.value.push(...Object.values(PROFICIENCY_RANKS));

const calculatorPanel = ref<InstanceType<typeof CalculatorPanel>>();
await useGsap(({ gsap, scrollTrigger, splitText }) => {
    // ==== HEADER LOGO MINIFY ON SCROLL ====
    // const logoTl = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: '#credibility',
    //         start: 'top 20%',
    //         toggleActions: 'restart pause resume reverse'
    //     }
    // });

    // logoTl.to('.logo .marvel .space', {
    //     width: 0,
    //     duration: 0.1,
    //     ease: 'power2.in'
    // })
    // .to('.logo .marvel .collapse', {
    //     width: 0,
    //     x: -10,
    //     opacity: 0,
    //     duration: 0.2,
    //     ease: 'power2.in',
    //     stagger: 0.05
    // }, '<')
    // .to('.logo .calc .top', {
    //     y: '-25%',
    //     x: '-25%',
    //     scale: 0.5,
    //     duration: .2,
    //     ease: 'power1.in'
    // }, '<')
    // .to('.logo .calc .space', {
    //     display: 'inline-block',
    //     width: 0,
    //     duration: .1
    // }, '<')
    // .to('.logo .calc .bottom', {
    //     y: '25%',
    //     x: '-125%',
    //     scale: 0.5,
    //     duration: .2,
    //     ease: 'power1.in'
    // }, '<');

    gsap.set('#hero .right-wrapper .info-wrapper', {
        opacity: 1
    });
    gsap.set('#hero .featured-hero-desktop', {
        opacity: 1
    });
    gsap.set('#hero .featured-hero-mobile', {
        opacity: 1
    });


    // ==== HERO PROFICIENCY RANK ICONS ====

    const quarter = duplicateProficiencyRanks.value.length / 4;
    const icons = gsap.utils.toArray('.proficiency-icon') as Element[]
    const lastIcon = icons[quarter * 3 - 1]!
    const otherIcons = [...icons];
    otherIcons.splice(quarter * 3 - 1, 1);

    const tl = gsap.timeline({ delay: .3 })

    tl
    .set('.proficiency-icons-anim', {
        scale: 1.4
    })
    .from('.proficiency-icons-anim', {
        x: '100vw',
        duration: 1.2,
        ease: 'power3.out'
    })
    .to('.proficiency-icons-anim', {
        x: (i, el) => -(el.offsetWidth - 150 - (100 * (quarter))),
        duration: 2.8,
        ease: 'power3.out'
    }, '-=1')
    
    .to(otherIcons, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
        ease: 'back.in'
    }, '-=2.8')

    .from('.logo-large', {
        scale: 0,
        opacity: 0,
        ease: 'back.out',
        duration: 0.3
    }, '-=0.6')

    .from(lastIcon, {
        scale: 1.4,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)'
    }, '-=0.6')

    .set('.proficiency-icons-anim', {
        zIndex: 1,
        duration: 0.2
    }, '-=0.55')
    .to('.proficiency-icons-anim', {
        opacity: 0,
        duration: 0.1
    }, '-=0.5')

    // ==== HERO TITLE ====
    const splitTitle = new splitText('#hero-title', { type: 'words', ignore: 'span' })
    const splitSubtitle = new splitText('#hero-subtitle', { type: 'lines' })

    const heroTl = gsap.timeline();
    heroTl.from(splitTitle.words, {
        opacity: 0,
        x: -150,
        y: -50,
        rotateZ: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out'
    })
    .from('#hero-title > span', {
        opacity: 0,
        y: -50,
        scaleY: 0.8,
        duration: 0.5,
        ease: 'elastic.out'
    }, '-=0.2')
    .from(splitSubtitle.lines, {
        opacity: 0,
        x: -150,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out'
    }, '-=0.3')
    .from('#hero-cta', {
        opacity: 0,
        y: -50,
        scaleY: 0.8,
        duration: 0.5,
        delay: 0.3,
        ease: 'elastic.out'
    }, '-=0.55')

    // ==== CREDIBILITY ====

    // scrollTrigger.create({
    //     trigger: '#credibility',
    //     start: 'center 100%',
    //     onEnter: () => gsap.to('#header-cta', { opacity: 1, y: 0, duration: 0.2, ease: 'back.out' }),
    //     onLeaveBack: () => gsap.to('#header-cta', { opacity: 0, y: -250, duration: 0.2 }),
    // });

    gsap.from('._gsap-hero-list-item', {
        opacity: 0,
        x: -200,
        duration: 0.4,
        ease: 'back.out',
        stagger: 0.05,
        scrollTrigger: {
            trigger: '#credibility',
            start: 'top 40%'
        }
    })

    gsap.from('._gsap-hero-reward-container .level-rewards', {
        opacity: 0,
        x: -200,
        duration: 0.45,
        ease: 'back.out',
        stagger: 0.015,
        scrollTrigger: {
            trigger: '#rewards',
            start: 'top 50%'
        }
    });

    gsap.from('#cta-final-cta', {
        opacity: 0,
        y: 200,
        duration: 0.2,
        ease: 'back.out',
        scrollTrigger: {
            trigger: '#cta-final',
            toggleActions: "restart pause resume reverse",
            start: '30% 60%'
        }
    });


    // ==== QUESTION ====
    const questionTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#question',
            start: 'top 80%'
        }
    });

    questionTl.from('#lord-icon-large', {
        opacity: 0,
        x: 200,
        duration: .5,
        ease: 'back.out'
    })
    .from('#champion-icon-text', {
        display: 'inline-block',
        opacity: 0,
        y: -50,
        duration: .3,
        ease: 'back.out'
    })


    // only animate calculator when it comes into page view
    scrollTrigger.create({
        trigger: calculatorPanel.value?.$el,
        start: 'top 80%',
        onEnter: () => calculatorPanel.value?.animate(),
    });

    const animateableTitles = document.getElementsByClassName('animate-text');
    for (const title of animateableTitles) {
        let target: Element|Element[] = title;

        if (title.classList.contains('lines')) {
            const splitTitle = new splitText(title, { type: 'lines', ignore: 'span' })
            target = splitTitle.lines;
        }

        gsap.from(target, {
            opacity: 0,
            x: -150,
            y: -50,
            rotateZ: -20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 80%'
            }
        })
    }

    gsap.from('#new-hero-button', {
        opacity: 0,
        y: -250,
        duration: 0.2,
        scrollTrigger: {
            trigger: '#new-hero-button',
            start: 'top 60%'
        }
    })

    // scrollTrigger.create({
    //     trigger: '#cta-final',
    //     start: '30% 60%',
    //     onEnter: () => gsap.to('#header-cta', { opacity: 0, y: -250, duration: 0.2 }),
    //     onLeaveBack: () => gsap.to('#header-cta', { opacity: 1, y: 0, duration: 0.2, ease: 'back.out' }),
    // });
});


// ====================
// promo hero
const featuredHero = ref(getFeaturedHero());

onMounted(() => {
    // do it every mounted to check date again (and avoid service worker shenanigans)
    featuredHero.value = getFeaturedHero();
});

//====================

const totalMatches = getAllMatchCount().toLocaleString();
function findHighestMatchCount() {
    let highestMatchCount = 0;
    for (const hero of HERO_LIST) {
        const matchCount = getHeroMatchCount(hero.id);
        if (highestMatchCount < matchCount) {
            highestMatchCount = matchCount;
        }
    }

    return highestMatchCount;
}

const highestMatchCount = findHighestMatchCount();

const allHeroesWithStats = HERO_LIST.map(h => {
    const matchCount = getHeroMatchCount(h.id);
    const avgStats = getAverageStatsForHero(h.id);

    return {
        _hero: h,

        heroId: h.id,
        heroName: h.name,
        heroAvatar: `${h.dataDir}head.webp`,
        percent: matchCount ? matchCount / highestMatchCount : .2,
        matchCount,
        avgStats,
        featured: h.id === featuredHero.value?.id
    }
}).sort((a, b) => {
    if (a.featured)
        return -1;
    if (b.featured)
        return 1;

    return a._hero.name.localeCompare(b._hero.name)
});

const credibilitySelectedHeroId = ref<string|null>(null);
const credibilitySelectedHero = computed(() => {
    return allHeroesWithStats.find(h => h.heroId == credibilitySelectedHeroId.value);
});
function credibilityClickHero(hero: string) {
    if (credibilitySelectedHeroId.value == hero) {
        credibilitySelectedHeroId.value = null;
        return;   
    }

    credibilitySelectedHeroId.value = hero;
}


const currentHero = ref(featuredHero.value ?? DEFAULT_HERO);
const averageStatsModal = ref<InstanceType<typeof AverageStatsModal>>();
const avgStatsModalTab = ref<'normal'|'arcade'>('normal');

const cosmeticsKey = computed(() => `cosmetics_owned_${currentHero.value.id}`);
const ownedCostumes = useLocalStorage<string[]>(cosmeticsKey, []);
const currentHeroAnimatedIconReward = computed<Reward>(() => {
    const hasEasterEgg = currentHero.value.easterEgg && ownedCostumes.value.includes(currentHero.value.easterEgg);

    const fps = currentHero.value.ranks.find(r => r.type.id == 'champion')!.type.rewards[0]!.iconAnimation!.fps;

    return {
        level: 50,
        name: 'Champion Icon',
        icon: `${currentHero.value.dataDir}${hasEasterEgg ? 'easter-egg/' : ''}bust-champion.webp`,
        iconAnimation: {
            size: currentHero.value.iconAnimationSize ?? [3600, 4000],
            columns: 6,
            rows: 10,
            fps,
            offset: currentHero.value.iconLargeAnimationOffset ?? currentHero.value.iconAnimationOffset
        },
        rarity: 'legendary'
    }
});

const heroSelectOpen = ref(false);
function clickHero(heroId: string) {
    heroSelectOpen.value = false;
    const hero = HERO_LIST.find(h => h.id == heroId);
    if (!hero)
        return;

    currentHero.value = hero;
}

useEvent('keyup', (e: KeyboardEvent) => {
    if (e.key === 'h' && !e.shiftKey && !e.ctrlKey && !e.altKey)
        heroSelectOpen.value = true;
    if (e.code === 'Escape' && !e.shiftKey && !e.ctrlKey && !e.altKey)
        heroSelectOpen.value = false;
})

const heroHasRoleIcon = computed(() =>
    Array.isArray(currentHero.value.roles) && currentHero.value.roles.length
 || currentHero.value.roles
);
const heroRoleIcon = computed(() => {
    if (!heroHasRoleIcon.value)
        return '';

    if (Array.isArray(currentHero.value.roles))
        return ROLE_ICONS[currentHero.value.roles[0]!];

    return ROLE_ICONS[currentHero.value.roles];
});

const plannerHeroStoreMobile = ref<PlayerHeroStore>(DEFAULT_HERO_STORE());
const plannerHeroStoreNumberOfDays = ref<PlayerHeroStore>(DEFAULT_HERO_STORE());
const plannerHeroStoreWeekly = ref<PlayerHeroStore>(DEFAULT_HERO_STORE());
const inputtedAvgStats = ref<Partial<Record<Challenge['type'], boolean>>>({});
const simulatedPlayerHeroStore = computed(() => {
    currentHero.value;
    
    // create a new default (fake) store
    const store: PlayerHeroStore = DEFAULT_HERO_STORE();
    // gather the needed stat types
    const statTypes = currentHero.value.ranks[0]?.challenges.map(c => c.type) ?? [];

    // to place stats to use in the calculator in
    const avgStats: Record<string, number> = {};
    const avgStatsArcade: Record<string, number> = {};

    // reset inputted avg stats
    inputtedAvgStats.value = {};

    // check if user inputted their own stats into the headless modal
    if (averageStatsModal.value) {
        Object.entries(averageStatsModal.value.stats).forEach(([type, value]) => {
            const parsedNumber = parseFloat(value);
            if (!isNaN(parsedNumber)) {
                avgStats[type] = parsedNumber;

                if (parsedNumber)
                    inputtedAvgStats.value[type as Challenge['type']] = true;
                else
                    inputtedAvgStats.value[type as Challenge['type']] = false;
            }
            else
                inputtedAvgStats.value[type as Challenge['type']] = false;
        });
        Object.entries(averageStatsModal.value.statsArcade).forEach(([type, value]) => {
            const parsedNumber = parseFloat(value);
            if (!isNaN(parsedNumber))
                avgStatsArcade[type] = parsedNumber;
        });
    }

    statTypes.forEach(stat => {
        // dont generate random number if stat was entered manually
        if (typeof avgStats[stat] !== 'undefined')
            return;

        // get a random number in the range of the stat in case there is no generic avg
        const interval = CHALLENGE_STATS[stat as Challenge['type']]?.interval ?? [0, 80000];
        const genericStat = getAverageStatsForHero(currentHero.value.id)?.[stat];
        const randomStat = !!genericStat ? 0 : getRandomInt(interval[0], interval[1]);
        avgStats[stat] = genericStat ?? randomStat;

        // also set the stats to be visible in the avg stats headless modal
        if (!genericStat && averageStatsModal.value)
            averageStatsModal.value.stats[stat] = `${randomStat}`;
    });
    
    // set random stats and goal of 50 (animated icon)
    store.averageStats = avgStats;
    store.averageStatsArcade = avgStatsArcade;
    store.goal = 50;

    return store;
});

watch(currentHero, () => averageStatsModal.value?.reset());

watch([currentHero, () => averageStatsModal.value?.stats], () => {
    const store = cloneObjectRefAsRaw<PlayerHeroStore>(simulatedPlayerHeroStore.value);

    // create stores for planner based on current hero and current stats
    store!.planner.numberOfDays.days = 20;

    let weekDayTime = 2 * 60 * 60;
    let weekendDayTime = 3 * 60 * 60;
    if (preferences.value.plannerCalendarMeasureUnit == 'quick_matches') {
        weekDayTime = AVG_QUICK_MATCH_DURATION_MIN * 14 * 60;
        weekendDayTime = AVG_QUICK_MATCH_DURATION_MIN * 20 * 60;
    }
    if (preferences.value.plannerCalendarMeasureUnit == 'comp_matches') {
        weekDayTime = AVG_COMP_MATCH_DURATION_MIN * 10 * 60;
        weekendDayTime = AVG_COMP_MATCH_DURATION_MIN * 15 * 60;
    }

    store!.planner.weekly.weekDays = DEFAULT_PLANNER_WEEKDAYS(weekDayTime);

    store!.planner.weekly.weekDays.monday.enabled = false;
    store!.planner.weekly.weekDays.saturday.time = weekendDayTime;
    store!.planner.weekly.weekDays.sunday.time = weekendDayTime;

    plannerHeroStoreMobile.value = cloneObjectRefAsRaw(store)!;
    plannerHeroStoreNumberOfDays.value = cloneObjectRefAsRaw(store)!;
    plannerHeroStoreWeekly.value = cloneObjectRefAsRaw(store)!;
    plannerHeroStoreWeekly.value.planner.mode = 'weekly';
});

function editArcadeStats() {
    avgStatsModalTab.value = 'arcade';
    averageStatsModal.value?.$el.scrollIntoView({ behavior: 'smooth' });
}

// prevent changing planner mode, since we display both options
watch(plannerHeroStoreNumberOfDays, (store) => {
    if (store.planner.mode != 'number-of-days')
        plannerHeroStoreNumberOfDays.value.planner.mode = 'number-of-days';
}, { deep: true });
watch(plannerHeroStoreWeekly, (store) => {
    if (store.planner.mode != 'weekly')
        plannerHeroStoreWeekly.value.planner.mode = 'weekly';
}, { deep: true });

// const timeEstimates = computed(() => {
//     const calculator = new Calculator(currentHero.value, simulatedPlayerHeroStore.value);

//     return calculator.totalTimes();
// });
const timeEstimates = computed(() => {
    const calculator = new Calculator(currentHero.value, simulatedPlayerHeroStore.value);

    const hasAvgArcadeStats = simulatedPlayerHeroStore.value.averageStatsArcade
                           && Object.entries(simulatedPlayerHeroStore.value.averageStatsArcade).length;

    const arcade = hasAvgArcadeStats ?
        calculator.totalTimes(true) : undefined;

    return { normal: calculator.totalTimes(), arcade };
});

// ==== ACHIEVEMENTS =====
const selectedAchievementsCategory = ref<AchievementTypeCategory>('heroic-journey');
const achievementList = computed(() => getAchievements(selectedAchievementsCategory.value, currentHero.value.id));

const heroPossesiveName = computed(() =>
    currentHero.value.name + (currentHero.value.name.endsWith('s') ? '\'' : '\'s')
);

// ==== COSTUMES =====
const costumeFilters = ref<string[]>([]);
watch(currentHero, () => costumeFilters.value = []);

const currentHeroCostumes = computed(() => getHeroCostumes(currentHero.value.id));
const randomHeroCostume = computed(() => {
    const defaultCostume: Costume = {
        heroId: "luna-snow",
        id: "1031303",
        name: "COOL SUMMER",
        rarity: "legendary",
        customizable: true,
        category: "Premium Event Reward",
    };

    if (!currentHeroCostumes.value.length)
        return defaultCostume;

    function getHighestRarityCostumes(rarity?: CostumeRarity) {
        if (!currentHeroCostumes.value.length)
            return [];

        if (!rarity)
            rarity = 'legendary';

        const filtered = currentHeroCostumes.value.filter(c => c.rarity == rarity);

        const nextRarityIdx = RARITY_ORDER.indexOf(rarity) + 1;
        if (nextRarityIdx <= 0 || nextRarityIdx >= RARITY_ORDER.length)
            return filtered.length ? filtered : [];

        const nextRarity = RARITY_ORDER[nextRarityIdx]!;
        if (filtered.length < 3)
            filtered.push(...currentHeroCostumes.value.filter(c => c.rarity == nextRarity))

        if (filtered.length)
            return filtered;

        return getHighestRarityCostumes(nextRarity);
    }

    const highestRarityCostumes = getHighestRarityCostumes();

    if (!highestRarityCostumes.length)
        return defaultCostume;

    const randIdx = getRandomInt(0, highestRarityCostumes.length - 1);
    return highestRarityCostumes[randIdx]!;
});

// SEO IMAGE FOR HERO PAGES!!

// ==== FINAL CTA =====
const lordIconsGridHeroes = ref<HeroData[][]>([]);
for (let i = 0; i < 5; i++) {
    const row = shuffleArray([...HERO_LIST], i);
    lordIconsGridHeroes.value.push([...row, ...row]);
}

// ==== SCROLL RETENTION =====

const { save, restore } = useScrollPosition();
onMounted(restore);
onBeforeUnmount(save);

const { positions: scrollPositions } = useScrollPosition('heroes_stats_scroll');

onMounted(() => {
    if (!scrollPositions['heroes_stats_scroll'])
        return;

    heroListContainer.value?.scrollTo(scrollPositions['heroes_stats_scroll']);
});
onBeforeUnmount(() => {
    if (!heroListContainer.value)
        return;

    scrollPositions['heroes_stats_scroll'] = heroListContainer.value.scrollX;
});
</script>