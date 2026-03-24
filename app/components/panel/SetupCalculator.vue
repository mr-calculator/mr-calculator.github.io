<template>
    <div class="calculator-setup">
        <template v-if="!hasAvgStats">
            <h2 class="rich-title">It looks like you haven't set your average stats yet</h2>
            <FormButton @click="$emit('openStatsMenu')">
                <Tex
                    image="gameTime"
                    color="var(--dark)"

                    width="50px"
                    height="50px"
                />
                Set your stats
            </FormButton>
            <template v-if="!isUnknownHero && hasGenericAvgStats">
                <p>OR</p>
                <FormButton @click="useGenericStats">
                    Use generic stats
                </FormButton>
                <p class="info">
                    (Generic stats are gathered from hundreds of games of the top 500 players on {{ hero.name }})
                </p>
            </template>
            <template v-else-if="!isUnknownHero && !hasGenericAvgStats">
                <p class="info">
                    (Sorry! It looks like we don't have generic stats for this hero yet)
                </p>
            </template>
        </template>
        <template v-else-if="isLv1AndGoalLv1">
            <h2 class="rich-title">It looks like you haven't set a goal yet</h2>
            <FormButton @click="$emit('openGoalMenu')">
                <Tex
                    image="target"
                    color="var(--dark)"

                    width="50px"
                    height="50px"
                    object-fit="cover"
                />
                Set your goal
            </FormButton>
        </template>
        <template v-else-if="isIncorrectSelection">
            <h2 class="rich-title">Your current level is
                <span class="icon"><img :src="levelToRank(level.level)?.icon" /></span>
                <span class="level">LV{{ level.level }}</span>
                and your goal is
                <span class="icon"><img :src="goal.rank?.icon" /></span>
                <span class="level">LV{{ goal.level }}</span>.
                <br/>
                Congrats! You have passed your goal!
            </h2>
            <div class="buttons">
                <FormButton @click="$emit('openGoalMenu')">
                    <Tex
                        image="target"
                        color="var(--dark)"

                        width="50px"
                        height="50px"
                        object-fit="cover"
                    />
                    Set a new goal
                </FormButton>
                <FormButton @click="$emit('openLevelMenu')">
                    <Tex
                        src="/img/heroes/ranks/knight.webp"

                        width="50px"
                        height="50px"
                        object-fit="cover"
                    />
                    Change your level
                </FormButton>
            </div>
        </template>
    </div>
</template>

<style src="@/assets/style/components/rich-title.sass" scoped></style>

<style lang="sass" scoped>
.calculator-setup
    width: 100%
    height: 100%

    padding: 30px 20px 80px 20px

    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    gap: 20px

    .buttons
        display: flex
        flex-direction: column
        gap: 10px

    p
        font-size: 24px
        font-family: RefrigeratorDeluxeBold

        &.info
            font-size: 16px
            font-family: KelsonSans
            color: $light-blue

</style>

<script setup lang="ts">
import { getAverageStatsForHero, levelToRank, type HeroData, type PlayerHeroStore } from '~/assets/data/common';
import { HERO_LIST } from '~/assets/data/heroes';


const props = defineProps<{
    hero: HeroData,

    level: PlayerHeroStore,
    hasAvgStats: boolean,
    isLv1AndGoalLv1: boolean,
    isIncorrectSelection: boolean,
}>()

const goal = computed(() => useLevel(props.level.goal, props.hero));

function useGenericStats() {
    props.level.usesGenericStats = true;
}

const isUnknownHero = computed(() =>
    !HERO_LIST.find(h => h.id == props.hero.id)
);
const hasGenericAvgStats = computed(() => !!getAverageStatsForHero(props.hero.id))
</script>