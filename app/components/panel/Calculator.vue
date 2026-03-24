<template>
    <div :class="{calculator: 1, advanced}">
        <div class="rich-title">
            To get to
            <span class="icon">
                <img :src="goal.rank?.icon" />
            </span>
            <span class="level">LV{{ goal.level }}</span>
            (<span class="icon reward">
                <img
                    v-if="!goal.reward.iconAnimation"
                    :src="goal.reward.icon"
                />
                <div v-else class="animated-icon-wrapper">
                    <UiAnimatedIcon
                        class="animated-icon"
                        :reward="goal.reward"
                        :size="68"
                    />
                </div>
            </span>&nbsp;<span :class="['reward', `rarity-${goal.reward.rarity}`]">
                {{ goal.reward.name }}
            </span>)
            (<span class="level">{{ levelCount }} levels</span>)
            it will take you:
        </div>

        <div
            v-if="displayTimeRank != null"
            class="total-title rich-title"
        >
            <Tex
                image="cross"
                hover="color"
                hover-color="var(--blue)"
                color="var(--light-blue)"
                clickable

                width="20px"
                height="20px"

                inline

                @click="displayTimeRank = null"
            />&nbsp;

            You are viewing
            <span class="icon">
                <img :src="totalTitleRanks.currentRank.rank.icon" />
            </span>
            <span class="level">LV{{ totalTitleRanks.currentRank.level }}</span> to
            <span class="icon">
                <img :src="totalTitleRanks.nextRank?.rank.icon" />
            </span>
            <span class="level">LV{{ totalTitleRanks.nextRank?.level }}</span>.
        </div>
        <div class="total">
            <div class="column">
                <div class="title">
                    <Tex
                        image="time"
                        color="#4fdbff"

                        width="35px"
                        height="35px"
                        object-fit="contain"
                    />
                    <h3>Time</h3>
                </div>
                <div class="time conservative">
                    <p class="desc">Conservative</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.time.conservative }}h

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.time.conservative }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / 10min
                        </div>
                    </div>
                </div>
                <div class="time avg">
                    <p class="desc">Average</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.time.avg }}h

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.time.avg }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / 10min
                        </div>
                    </div>
                </div>
                <div class="time optimistic">
                    <p class="desc">Optimistic</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.time.optimistic }}h

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.time.conservative }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / 10min
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="title">
                    <Tex
                        image="quickMatchIcon"

                        width="35px"
                        height="35px"
                        object-fit="contain"
                    />
                    <h3>QUICKMATCH</h3>
                </div>
                <div class="time conservative">
                    <p class="desc">Conservative</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.games.quickMatch.conservative }}

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.quickMatch.conservative }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / match
                        </div>
                    </div>
                </div>
                <div class="time avg">
                    <p class="desc">Average</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.games.quickMatch.avg }}

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.quickMatch.avg }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / match
                        </div>
                    </div>
                </div>
                <div class="time optimistic">
                    <p class="desc">Optimistic</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.games.quickMatch.optimistic }}

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.quickMatch.optimistic }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / match
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="title">
                    <Tex
                        image="competitiveIcon"

                        width="35px"
                        height="35px"
                        object-fit="contain"
                    />
                    <h3>COMPETITIVE</h3>
                </div>
                <div class="time conservative">
                    <p class="desc">Conservative</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.games.competitive.conservative }}

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.competitive.conservative }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / match
                        </div>
                    </div>
                </div>
                <div class="time avg">
                    <p class="desc">Average</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.games.competitive.avg }}

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.competitive.avg }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / match
                        </div>
                    </div>
                </div>
                <div class="time optimistic">
                    <p class="desc">Optimistic</p>
                    <div :class="{'with-points': !!displayTimeNumbers.points}">
                        {{ displayTimeNumbers.games.competitive.optimistic }}

                        <div v-if="!!displayTimeNumbers.points" class="points">
                            +{{ displayTimeNumbers.points.competitive.optimistic }}
                            <Tex
                                image="proficiency"
                                state="hover"

                                width="20px"
                                height="20px"
                            />
                            / match
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="ranks">
            <PanelHorizontalScrollContainer
                v-if="animateRanks"

                ref="timeTableScrollable"
                class="time-table-wrapper"
                @scroll-interact="cancelAnimation"
            >
                <TransitionGroup tag="ul" class="time-table" name="times" :appear="animate">
                    <li
                        v-for="(rank, index) in times"
                        :key="rank.id"
                        :ref="el => rankRefs[rank.rank.id] = el"
                        :class="{
                            last: rank.last,
                            dimmed: displayTimeRank !== null && displayTimeRank != rank.rank.id,
                            selected: displayTimeRank == rank.rank.id,
                        }"
                        :style="{
                            '--index': rankIndex(index, rank)
                        }"

                        @click="setDisplayTimeToRank(rank.rank.id)"
                    >
                        <div class="icon">
                            <img :src="rank.rank.icon" />
                            <p class="level">{{ rank.level }}</p>
                        </div>

                        <div class="progress">
                            <div v-if="rank.time" class="times">
                                <p class="time conservative">
                                    {{ secondsToHoursString(rank.time.conservative) }}h
                                </p>
                                <p class="time avg" :style="{
                                    '--color': rank.rank.color
                                }">
                                    {{ secondsToHoursString(rank.time.avg) }}h
                                </p>
                                <p class="time optimistic">
                                    {{ secondsToHoursString(rank.time.optimistic) }}h
                                </p>
                            </div>
                            <div v-else-if="rank.completed" class="completed">
                                <Tex
                                    class="check"
                                    image="check"
                                    color="#458a14"

                                    width="35px"
                                    height="35px"
                                    object-fit="contain"
                                />
                            </div>

                            <div
                                v-if="!rank.last"
                                class="bar"
                                :style="{
                                    '--color': rank.rank.color
                                }"
                            />

                            <div v-if="rank.time" class="per-level time avg">
                                {{ secondsToHoursString(rank.time.perLvlAvg) }}h
                                <span>/ LV</span>
                            </div>
                        </div>
                    </li>
                </TransitionGroup>
            </PanelHorizontalScrollContainer>
        </Transition>
        <div v-if="times.length > 3" class="scroll-indicator">
            <Tex
                image="mouseScroll"

                width="35px"
                height="35px"
                object-fit="contain"
            />
            <p>Scroll for more</p>
        </div>
        <div v-else class="scroll-missing"></div>

        <div
            :class="{advanced: 1, active: advanced}"
            @click="advanced = !advanced"
        >
            <Tex
                image="chart"
                color="var(--blue)"
                clickable

                width="30px"
                height="30px"
            />
            {{ advanced ? 'Less Data' : 'More Data' }}
        </div>
    </div>
</template>

<style src="@/assets/style/components/rich-title.sass" scoped></style>
<style src="@/assets/style/components/calculator.sass" scoped></style>

<script setup lang="ts">
import HorizontalScrollContainer from './HorizontalScrollContainer.vue'
import { AVG_COMP_MATCH_DURATION_MIN, AVG_QUICK_MATCH_DURATION_MIN, levelToRank, PROFICIENCY_RANKS, type HeroData, type PlayerHeroStore, type ProficiencyRank, type Rank, type Reward } from '~/assets/data/common';
import { type PersonalRankTimeEstimate } from '~/services/calculator';

const props = defineProps<{
    hero: HeroData,
    level: PlayerHeroStore,
    timeEstimates: PersonalRankTimeEstimate[],
    animate?: boolean,
    haltAnimation?: boolean
}>();

const emit = defineEmits<{
    finishedAnimation: []
}>();

const advanced = ref(false);

const levelCount = computed(() => {
    let count = props.level.goal - props.level.level;

    return count;
});

const hasStartedAnimation = ref(false);

const timeTableScrollable = ref<InstanceType<typeof HorizontalScrollContainer>>();
const rankRefs = ref<Record<string, Element|ComponentPublicInstance|null>>({});

watch(props, () => {
    setTimeout(() => timeTableScrollable.value?.updateBounds(), 100);

    if (
        !hasStartedAnimation.value && !props.haltAnimation
     && (hasAvgStats.value && !isLv1AndGoalLv1.value && !isIncorrectSelection.value)
    )
        beginTotalAnimation();
}, { deep: true });

const goal = computed(() => useLevel(props.level.goal, props.hero));

const hasAvgStats = useHasAvgStats(() => props.hero);
const isLv1AndGoalLv1 = computed(() => props.level.level == 1 && props.level.goal == 1);
const isIncorrectSelection = computed(() => props.level.goal < props.level.level);

const total = computed(() => {
    let conservative = 0;
    props.timeEstimates.forEach(r => conservative += r[1][0]);
    let avg = 0;
    props.timeEstimates.forEach(r => avg += r[1][1]);
    let optimistic = 0;
    props.timeEstimates.forEach(r => optimistic += r[1][2]);

    return { conservative, avg, optimistic };
});

function c(duration: number, percent: number) {
    return duration * (1 + percent);
}
function qmC(percent: number) {
    return c(AVG_QUICK_MATCH_DURATION_MIN, percent);
}
function compC(percent: number) {
    return c(AVG_COMP_MATCH_DURATION_MIN, percent);
}

function calcGameCount(time: { conservative: number, avg: number, optimistic: number }) {
    const quickMatch = {
        conservative: time.conservative / (qmC(-0.1) * 60),
        avg: time.avg / (qmC(0) * 60),
        optimistic: time.optimistic / (qmC(0.1) * 60),
    }

    const competitive = {
        conservative: time.conservative / (compC(-0.1) * 60),
        avg: time.avg / (compC(0) * 60),
        optimistic: time.optimistic / (compC(0.1) * 60),
    }

    return { quickMatch, competitive };
}

const totalGames = computed(() => calcGameCount(total.value));

interface Column {
    id: string,
    rank: ProficiencyRank,
    level: number,
    time?: {
        conservative: number,
        avg: number,
        optimistic: number,
        perLvlAvg: number
    },
    completed?: boolean,
    last?: boolean
}

const times = computed(() => {
    if (props.timeEstimates.length == 0)
        return [];

    const columns: Column[] = [];

    const currentLevelRank = levelToRank(props.level.level);

    let lastInsertedRank: Rank|null = null;
    let nextRank: Rank|null = null;
    for (let i = 0; i < props.hero.ranks.length; i++) {
        const rank = props.hero.ranks[i]!;
        const calculatedRank = props.timeEstimates.find(r => r[0] == rank.type.id);

        if (calculatedRank) {
            const [ rankId, time, points, levelCount ] = calculatedRank;

            const showLevel = currentLevelRank?.id == rankId ? 
                props.level.level
                :
                rank.type.levelStart
            ;

            const toAdd: Column = {
                id: randomId(),
                rank: rank.type,
                level: showLevel,
                time: {
                    conservative: time[0],
                    avg: time[1],
                    optimistic: time[2],
                    perLvlAvg: time[1] / levelCount
                }
            }

            if (toAdd.time!.conservative == 0 && toAdd.time!.avg == 0 && toAdd.time!.optimistic == 0) {
                delete toAdd.time;
                toAdd.completed = true;
            }

            columns.push(toAdd);

            lastInsertedRank = rank;
            continue;
        }

        if (lastInsertedRank) {
            if (props.level.goal > lastInsertedRank.type.levelEnd)
                nextRank = props.hero.ranks[i] || null;
            break;
        }

        columns.push({
            id: rank.type.id + rank.type.levelStart + columns.length,
            rank: rank.type,
            level: rank.type.levelStart,
            completed: true,
        });
    }

    if (lastInsertedRank)
        columns.push({
            id: randomId(),
            rank: nextRank?.type ?? lastInsertedRank.type,
            level: props.level.goal,
            last: true
        });


    return columns;
});

// ==== ANIMATIONS ==== 

function scrollToRank(index: number, smoothing?: number) {
    const scrollToId = props.timeEstimates.at(index)![0];
    if (rankRefs.value[scrollToId])
        timeTableScrollable.value?.scrollToElement(
            rankRefs.value[scrollToId] as HTMLElement,
            smoothing
        );
}

watch(times, () => {
    scrollToRank(0, 0.01);
});

let intervalTask: any = -1;
let finishTask: any = -1;
function animateScroll(time: number, steps: number, callback: () => void) {
    let currentStep = 0;
    intervalTask = window?.setInterval(() => {
        const maxScroll = timeTableScrollable.value?.maxScroll() ?? 0;
        const stepScroll = maxScroll / steps;
        timeTableScrollable.value?.scrollTo(stepScroll * (currentStep + 1), 0.012)

        currentStep++;
    }, 100);

    finishTask = window?.setTimeout(() => {
        clearInterval(intervalTask);
        callback();
    }, time);
}

let animationFinished = false;
let animateTask: any = -1;
function beginRanksAnimation() {
    if (!props.timeEstimates.length)
        return;

    animateTask = setTimeout(() => {
        animateScroll(times.value.length * 200 + 500, 10, () => {
                animateTask = setTimeout(() => scrollToRank(0, 0.01), 300);
                emit('finishedAnimation');
                animationFinished = true;
            }
        );
    }, 700);
}

function cancelAnimation() {
    clearInterval(intervalTask);
    clearTimeout(finishTask);
    clearTimeout(animateTask);
}

// total number animation
const animateRanks = ref(false);

const totalAnimationPercent = ref(0);
const totalAnimated = computed(() => {
    const easing = ease(totalAnimationPercent.value / 100) * 100;

    return {
        time: {
            conservative: total.value.conservative / 100 * easing,
            avg: total.value.avg / 100 * easing,
            optimistic: total.value.optimistic / 100 * easing,
        },
        games: {
            quickMatch: {
                conservative: totalGames.value.quickMatch.conservative / 100 * easing,
                avg: totalGames.value.quickMatch.avg / 100 * easing,
                optimistic: totalGames.value.quickMatch.optimistic / 100 * easing,
            },
            competitive: {
                conservative: totalGames.value.competitive.conservative / 100 * easing,
                avg: totalGames.value.competitive.avg / 100 * easing,
                optimistic: totalGames.value.competitive.optimistic / 100 * easing,
            }
        }
    }
});

function ease(t: number) {
    // return 1 - Math.cos(Math.PI * t / 2);
    return Math.pow(t, 8) / (Math.pow(t, 8) + Math.pow(1 - t, 2));
}

let totalAnimationTask: any = -1;

function beginTotalAnimation() {
    hasStartedAnimation.value = true;

    totalAnimationTask = window?.setInterval(() => {
        totalAnimationPercent.value += 1;
        if (totalAnimationPercent.value == 100) {
            clearInterval(totalAnimationTask);
            
            beginRanksAnimation();
            animateRanks.value = true;
        }
    }, 15);
}

defineExpose({
    animate: beginTotalAnimation
});

// if (hasAvgStats.value && !isLv1AndGoalLv1.value && !isIncorrectSelection.value)
if (!props.haltAnimation)
    beginTotalAnimation();

if (!props.animate) {
    clearInterval(totalAnimationTask);
    totalAnimationPercent.value = 100;

    animateRanks.value = true;
    setTimeout(() => scrollToRank(0, 0.01), 100);
    animationFinished = true;
}

function rankIndex(index: number, rank: Column) {
    // if the animation is over, disregard completed ranks
    if (!animationFinished)
        return index;
    if (rank.completed)
        return 0;

    const lastCompletedIndex = times.value.findLastIndex(c => c.completed)

    if (lastCompletedIndex == -1)
        return index;

    return index - lastCompletedIndex + 1;
}


// ==== TIME/GAMES VALUES DISPLAY ====
function setDisplayTimeToRank(id: ProficiencyRank['id']) {
    if (displayTimeRank.value == id) {
        displayTimeRank.value = null;
        return;
    }

    displayTimeRank.value = id;
}

const displayTimeRank = ref<ProficiencyRank['id']|null>(null);
const displayTimeNumbers = computed(() => {
    function displayNumber(number: number, fractionDigits = 0) {
        return number.toLocaleString(undefined, { maximumFractionDigits: fractionDigits });
    }

    const calculatedRank = props.timeEstimates.find(r => r[0] == displayTimeRank.value);
    
    if (
        !calculatedRank
     || (calculatedRank[1][0] == 0 && calculatedRank[1][1] == 0 && calculatedRank[1][2] == 0)
     || displayTimeRank.value === null
    ) {
        displayTimeRank.value = null;

        return {
            time: {
                conservative: secondsToHoursString(totalAnimated.value.time.conservative),
                avg: secondsToHoursString(totalAnimated.value.time.avg),
                optimistic: secondsToHoursString(totalAnimated.value.time.optimistic),
            },
            games: {
                quickMatch: {
                    conservative: displayNumber(totalAnimated.value.games.quickMatch.conservative),
                    avg: displayNumber(totalAnimated.value.games.quickMatch.avg),
                    optimistic: displayNumber(totalAnimated.value.games.quickMatch.optimistic),
                },
                competitive: {
                    conservative: displayNumber(totalAnimated.value.games.competitive.conservative),
                    avg: displayNumber(totalAnimated.value.games.competitive.avg),
                    optimistic: displayNumber(totalAnimated.value.games.competitive.optimistic),
                }
            }
        }
    }

    const time = {
        conservative: calculatedRank[1][0],
        avg: calculatedRank[1][1],
        optimistic: calculatedRank[1][2],
    }
    const gameCount = calcGameCount(time);

    const pointsPerMinCons = calculatedRank[2][0] / 10;
    const pointsPerMinAvg = calculatedRank[2][1] / 10;
    const pointsPerMinOpt = calculatedRank[2][2] / 10;

    return {
        time: {
            conservative: secondsToHoursString(time.conservative),
            avg: secondsToHoursString(time.avg),
            optimistic: secondsToHoursString(time.optimistic),
        },
        games: {
            quickMatch: {
                conservative: displayNumber(gameCount.quickMatch.conservative),
                avg: displayNumber(gameCount.quickMatch.avg),
                optimistic: displayNumber(gameCount.quickMatch.optimistic),
            },
            competitive: {
                conservative: displayNumber(gameCount.competitive.conservative),
                avg: displayNumber(gameCount.competitive.avg),
                optimistic: displayNumber(gameCount.competitive.optimistic),
            }
        },
        points: {
            time : {
                conservative: displayNumber(calculatedRank[2][0]),
                avg: displayNumber(calculatedRank[2][1]),
                optimistic: displayNumber(calculatedRank[2][2]),
            },
            quickMatch: {
                conservative: displayNumber(pointsPerMinCons * qmC(-0.1)),
                avg: displayNumber(pointsPerMinAvg * qmC(0)),
                optimistic: displayNumber(pointsPerMinOpt * qmC(0.1)),
            },
            competitive: {
                conservative: displayNumber(pointsPerMinCons * compC(-0.1)),
                avg: displayNumber(pointsPerMinAvg * compC(0)),
                optimistic: displayNumber(pointsPerMinOpt * compC(0.1)),
            }
        }
    }
});

const totalTitleRanks = computed(() => {
    const currentRankIndex = times.value.findIndex(c => c.rank.id == displayTimeRank.value);
    const currentRank = times.value[currentRankIndex]!;
    const nextRank = times.value[currentRankIndex + 1];

    return { currentRank, nextRank }
});

</script>