<template>
    <div class="modal achievement-rewards">
        <div class="container">
            <h3>REWARDS PREVIEW</h3>
            <h2>
                <Tex
                    :image="category.icon()"
                    color="var(--text-color)"

                    width="60px"
                    height="60px"
                />
                {{ category.name}}
            </h2>
            <UiSeparator class="separator" />
            <br/>
            
            <HorizontalScrollContainer
                ref="scrollContainer"
            >
                <div class="rewards">
                    <div
                        class="progress-bar"
                        :style="{
                            '--progress': (currentAchievementPoints / totalAchievementPoints * 100) + '%'
                        }"
                    />
                    <div
                        v-for="(reward, index) in rewards"
                        class="reward"

                        :ref="el => rewardRefs[index] = el"
                    >
                        <div class="requirement">
                            <Tex
                                image="achievementPoint"

                                width="25px"
                                height="25px"

                                color="#4a4d5a"

                                inline
                            />
                            <span>{{ reward.requirement }}</span>
                        </div>
                        <div class="progress">
                            <Tex
                                image="achievementRewardProgress"
                                :state="reward.completed ? 'active' : 'default'"

                                width="35px"
                                height="35px"

                                inline
                            />
                        </div>
                        <div class="item">
                            <div v-if="reward.completed" class="completed">
                                <Tex
                                    image="checkRhombus"

                                    width="50px"
                                    height="50px"
                                />
                            </div>
                            <img :src="reward.icon" :alt="reward.title" />
                        </div>
                        <div class="title">
                            {{ reward.title }}
                        </div>
                    </div>
                </div>
            </HorizontalScrollContainer>
        </div>

        <div class="buttons">
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Back</FormButton>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.achievement-rewards
    padding-top: 0

    +media-mobile
        padding-bottom: 0

    .container
        padding-top: 20px
        
        width: 100%
        mask: var(--tex-modalBackgroundMask) no-repeat
        mask-position: center 0%
        mask-size: 150% 100%

        display: flex
        flex-direction: column
        align-items: center
        gap: 10px

        +media-mobile
            padding-bottom: 85px + 10px

            +mediaIOS
                padding-bottom: calc(85px + 10px + env(safe-area-inset-bottom))

        +media-tablet
            mask-size: 120% 100%

        +media-desktop
            mask-size: 100% calc(100% + 85px + 20px + 10px)

        h2
            display: flex
            align-items: center
            gap: 0px

        h3
            font-size: 24px
            color: $blue-gray
    
    .scroll-container
        max-width: 870px
        overflow: visible

        +media-desktop
            padding-bottom: 50px

        .rewards
            position: relative
            display: flex
            align-items: center
            gap: 50px
            padding: 0 120px

            user-select: none

            +media-mobile
                gap: 10px
                padding: 0 20px

            .progress-bar
                position: absolute
                top: 53px
                left: 0
                width: 100%
                height: 10px

                background: #737890
                border: 1px solid #6a6d80

                z-index: -1

                &::after
                    content: ""
                    display: block
                    width: var(--progress)
                    height: 100%

                    background: #76adff

            .reward
                display: flex
                align-items: center
                flex-direction: column
                gap: 10px

                .requirement
                    display: flex

                    span
                        display: block
                        font-size: 22px
                        font-family: MRBody
                        font-weight: 700
                        color: #4a4d5a

                .item
                    position: relative
                    margin-top: 20px
                    width: 100px
                    height: 100px

                    background: var(--tex-itemBackground) no-repeat
                    background-size: 100% 100%

                    .completed
                        position: absolute
                        top: 0
                        left: 0
                        width: 100%
                        height: 100%

                        background: #3b3d57b8

                        display: flex
                        justify-content: center
                        align-items: center

                    img
                        width: 100%
                        height: 100%

                        object-fit: cover
                        object-position: center

                .title
                    width: 200px
                    height: 65px

                    font-size: 20px
                    font-family: MarvelRivalsBold
                    text-transform: uppercase
                    text-align: center
                    line-height: 100%

                    +media-mobile
                        width: 120px

</style>

<script setup lang="ts">
import { ACHIEVEMENT_CATEGORIES, getAchievements, type Achievement, type AchievementCategoryReward, type AchievementType, type AchievementTypeCategory } from '~/assets/data/achievements';
import HorizontalScrollContainer from '../panel/HorizontalScrollContainer.vue';

const props = defineProps<{
    category: AchievementTypeCategory
}>();
const emit = defineEmits(['cancel']);

const achievementsStore = useLocalStorage<Achievement[]>('achievements', []);
const categoryAchievements = getAchievements(props.category);

const scrollContainer = useTemplateRef('scrollContainer');
const rewardRefs = ref<(Element|ComponentPublicInstance|null)[]>([]);

const filteredAchievementsStoreWithTypes = computed(() => 
    achievementsStore.value.map(as => {
        const achievement = categoryAchievements.find(a => a.id == as.id);
        return achievement ? {
            achievement,
            state: as
        } : null;
    }).filter(Boolean) as {
        achievement: AchievementType,
        state: Achievement
    }[]
);
const currentAchievementPoints = computed(() =>
    filteredAchievementsStoreWithTypes.value.reduce((sum, c) => {
        if (c.state.current != c.achievement.requirement)
            return sum;

        return sum + c.achievement.reward;
    }, 0)
);
const totalAchievementPoints = computed(() =>
    categoryAchievements.reduce((sum, c) => sum + c.reward, 0)
);

const category = computed(() => ACHIEVEMENT_CATEGORIES.find(c => c.id == props.category)!)

const rewards = computed(() =>
    category.value.rewards.map(r => ({
        ...r,
        completed: currentAchievementPoints.value >= r.requirement
    }))
);
watch(rewards, (rewards) => {
    scrollToCurrentReward(rewards, 0.01);
}, { deep: true });

function scrollToCurrentReward(
    rewards: (AchievementCategoryReward & { completed: boolean })[], smoothing?: number
) {
    let scrollToIdx = 0;
    for (const [reward, idx] of withIndices(rewards)) {
        if (!reward.completed)
            break;
        scrollToIdx = idx;
    }

    if (rewardRefs.value[scrollToIdx])
        scrollContainer.value?.scrollToElement(
            rewardRefs.value[scrollToIdx] as HTMLElement,
            smoothing
        );
}

onMounted(() => {
    scrollToCurrentReward(rewards.value);
})

</script>