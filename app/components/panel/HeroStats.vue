<template>
    <div
        :class="{
            'stats-wrapper': 1,
            double: (hasAvgStatsNonGeneric || hasAvgArcadeStats) || stats.avgStats
        }"
    >
        <div class="stats-container">
            <template v-if="stats.avgStats">
                <h3>Generic Average Stats per 10 minutes</h3>
                <ul class="stats with-border-decorations">
                    <li v-for="[statType, statValue] in Object.entries(stats.avgStats)">
                        <img
                            :src="CHALLENGE_ICONS[statType as Challenge['type']]!"
                            :alt="`${CHALLENGE_ICONS[statType as Challenge['type']]!} Icon`"
                            draggable="false"
                        >
                        <p>{{ CHALLENGE_NAMES[statType as Challenge['type']]! }}</p>
                        <p class="stat-value">{{ statValue.toLocaleString(undefined, { maximumFractionDigits: 1 }) }}</p>
                    </li>
                </ul>
                <h4>DATA FROM <span>{{ stats.matchCount.toLocaleString() }}</span> MATCHES</h4>
            </template>
            <p v-else>We don't have generic average stats for this hero yet.</p>

            <ClientOnly>
                <template v-if="hasAvgStatsNonGeneric">
                    <h3>Your Average Stats per 10 minutes</h3>
                    <ul class="stats with-border-decorations">
                        <li v-for="[statType, statValue] in Object.entries(usedAverageStats).filter(([t]) => t != 'play')">
                            <img
                                :src="CHALLENGE_ICONS[statType as Challenge['type']]!"
                                :alt="`${CHALLENGE_ICONS[statType as Challenge['type']]!} Icon`"
                                draggable="false"
                            >
                            <p>{{ CHALLENGE_NAMES[statType as Challenge['type']]! }}</p>
                            <p class="stat-value">{{ statValue.toLocaleString(undefined, { maximumFractionDigits: 1 }) }}</p>
                        </li>
                    </ul>
                    <FormButton size="small" @click="$emit('edit-avg-stats')">
                        <Tex
                            image="gameTime"
                            color="var(--dark)"

                            width="40px"
                            height="40px"
                        />
                        CHANGE YOUR STATS
                    </FormButton>
                </template>
                <FormButton v-else size="small" @click="$emit('edit-avg-stats')">
                    <Tex
                        image="gameTime"
                        color="var(--dark)"

                        width="40px"
                        height="40px"
                    />
                    ADD YOUR OWN STATS
                </FormButton>
            </ClientOnly>
        </div>

        <div
            v-if="(hasAvgStatsNonGeneric || hasAvgArcadeStats) || stats.avgStats"
            class="time-count"
        >
            <FormToggle
                v-if="hasAvgArcadeStats"
                class="input toggle"

                both
                v-model="timeArcade"
            >
                <template #off>
                    QUICK/COMP
                </template>
                <template #on>
                    ARCADE
                </template>
            </FormToggle>

            <div class="item">
                <h3>Time played</h3>
                <h2 class="editable" @click="editGameHours">
                    <span>{{ gameHours }}h</span>
                    <Tex
                        image="edit"
                        color="var(--blue)"

                        width="30px"
                        height="30px"
                    />
                </h2>
                <p v-if="!storedLevel.gameHours">
                    This is an estimate.
                    <br/>
                    Input your actual play time above.
                </p>
            </div>

            <div class="item">
                <h3>Time to LV{{ storedLevel.goal }} <span>(Goal)</span></h3>
                <h2>{{ secondsToHoursString(totalEstimatedTimeAvg) }}h</h2>
            </div>

            <div class="item">
                <h3>Time at LV{{ storedLevel.goal }} <span>(Sum)</span></h3>
                <h2>{{ secondsToHoursString(timeSum) }}h</h2>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.stats-wrapper
    width: 100%
    position: relative
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    gap: 40px

    padding: 10px 0

    &.double
        +media-desktop
            display: grid
            grid-template-columns: 1fr 1fr
            gap: 20px

    h3
        font-family: $font-heavy
        font-size: 24px
        text-transform: uppercase
        text-align: center
        color: $blue

        +media-desktop
            font-size: 22px
        +media-ml-desktop
            font-size: 24px
        +media-xl-desktop
            font-size: 28px

    h4
        font-family: $font-heavy
        font-size: 20px
        text-transform: uppercase
        text-align: center
        color: $light-blue

        +media-desktop
            font-size: 18px
        +media-ml-desktop
            font-size: 20px
        +media-xl-desktop
            font-size: 22px

        span
            color: $blue

    .stats-container,
    .time-count
        width: 100%
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        gap: 20px

    
    .time-count
        gap: 30px

        .item
            display: flex
            flex-direction: column
            justify-content: center
            align-items: center
            gap: 5px

        h3
            span
                font-size: 20px
                color: $light-blue

        h2
            text-align: center
            font-size: 34px
            color: $blue

            background: var(--tex-tab-active) no-repeat
            background-size: 100% 100%

            padding: 0 30px 0 30px

            +media-mobile
                font-size: 26px

            &.editable
                display: flex
                align-items: center
                gap: 10px

                cursor: pointer

                +hover
                    color: $light-blue

                    .texture
                        --tex-color: #{$light-blue} !important

        p
            font-family: $font-body
            font-size: 16px
            line-height: 1
            color: $blue
            text-align: center

    .stats-container

        > p
            text-align: center

        .stats
            max-width: 450px
            position: relative
            padding: 20px

            display: grid
            grid-template-columns: 1fr 1fr
            justify-content: center
            align-items: center
            gap: 20px

            +media-mobile
                max-width: 100%
                gap: 10px

            li
                min-width: 110px

                display: flex
                flex-direction: column
                justify-content: center
                align-items: center

                img
                    width: 70px

                    user-select: none
                    -webkit-user-drag: none

                    margin-bottom: 15px

                p
                    color: $light-blue
                    font-size: 20px
                    font-family: $font-heavy
                    text-transform: uppercase
                    text-align: center

                    +media-mobile
                        font-size: 18px

                    &.stat-value
                        width: 100%
                        text-align: center
                        font-size: 30px
                        color: $blue

                        background: var(--tex-tab-active) no-repeat
                        background-size: 100% 100%

                        padding: 0 30px 0 30px

                        +media-mobile
                            font-size: 26px
                            padding: 0
</style>

<script setup lang="ts">
import { CHALLENGE_ICONS, CHALLENGE_NAMES, DEFAULT_HERO_STORE, getAverageStatsForHero, getHeroMatchCount, PlayerHeroStoreSchema, type Challenge, type HeroData, type PlayerHeroStore } from '~/assets/data/common';
import { Calculator, type PersonalRankTimeEstimate } from '~/services/calculator';
import InputModal from '../modals/InputModal.vue';

const { openModal } = useModalManager();
const { notify } = useNotificationManager();

const props = defineProps<{
    hero: HeroData,
    estimates: { normal: PersonalRankTimeEstimate[], arcade?: PersonalRankTimeEstimate[] }
}>();

const timeArcade = ref(false);

const hero = computed(() => props.hero);
const storedLevel = useLocalStorage<PlayerHeroStore>(`hero_${hero.value.id}`, DEFAULT_HERO_STORE(), PlayerHeroStoreSchema);

const hasAvgStatsNonGeneric = useHasAvgStats(hero, true);
const hasAvgArcadeStats = useHasAvgArcadeStats(hero);
const usedAverageStats = computed(() => {
    if (!storedLevel.value.lastViewingRole)
        return storedLevel.value.averageStats;
    return storedLevel.value.averageStatsPerRole?.[storedLevel.value.lastViewingRole] ?? {};
});

const stats = computed(() => {
    const matchCount = getHeroMatchCount(hero.value.id);

    let heroId = hero.value.id;
    if (storedLevel.value.lastViewingRole)
        heroId += '_' + storedLevel.value.lastViewingRole;

    const avgStats = getAverageStatsForHero(heroId);

    return {
        matchCount,
        avgStats
    }
});

const timeToCurrentEstimates = computed(() => {
    const calculator = new Calculator(hero.value, storedLevel.value);

    const arcade = hasAvgArcadeStats.value ? calculator.timeToCurrent(true) : undefined;

    return { normal: calculator.timeToCurrent(), arcade };
});

const totalEstimatedTimeAvg = computed(() => {
    if (timeArcade.value && props.estimates.arcade) {
        let avg = 0;
        props.estimates.arcade.forEach(r => avg += r.time[1]);

        return avg;
    }

    let avg = 0;
    props.estimates.normal.forEach(r => avg += r.time[1]);

    return avg
});
const totalTimeToLevelAvg = computed(() => {
    if (timeArcade.value && timeToCurrentEstimates.value.arcade) {
        let avg = 0;
        timeToCurrentEstimates.value.arcade.forEach(r => avg += r.time[1]);

        return avg;
    }

    
    let avg = 0;
    timeToCurrentEstimates.value.normal.forEach(r => avg += r.time[1]);

    return avg;
});

const gameSeconds = computed(() => {
    if (storedLevel.value.gameHours)
        return storedLevel.value.gameHours;

    return totalTimeToLevelAvg.value;
})
const gameHours = computed(() => secondsToHoursString(gameSeconds.value));
const gameHoursNumber = computed(() => ((gameSeconds.value ?? 0) / 60 / 60).toFixed(1));

const timeSum = computed(() => totalEstimatedTimeAvg.value + gameSeconds.value);

function editGameHours() {
    openModal(InputModal, {
        title: `Set hero hours played`,
        message: `Set your in-game hours played for ${hero.value.name}`,
        inputPlaceholder: `e.g.: ${gameHoursNumber.value}`,
        inputValue: gameHoursNumber.value,
        numberInput: {
            step: 10,
            min: 0
        },
    })
    .promise
    .then(hours => {
        const parsed = parseFloat(hours);
        if (isNaN(parsed)) {
            notify(
                `The hours inputted are not a number!`,
                3000,
                { image: 'warning', color: '#c94f36' }
            );

            return;
        }

        storedLevel.value.gameHours = parsed * 60 * 60;
    })
    .catch(() => null);
}

</script>