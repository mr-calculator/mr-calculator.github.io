<template>
    <div class="achievements-panel">
        <div v-if="category !== 'my-list'" class="header">
            <div class="title">
                <h3>ACHIEVEMENTS POINTS</h3>
                <div class="counter">
                    <Tex
                        image="achievementPoint"

                        width="25px"
                        height="25px"

                        color="#b3b4bc"

                        inline
                    />
                    <div class="text">
                        {{ achievementPointsObtained }} <span>/ {{ achievementPointsToGain }}</span>
                    </div>
                </div>
            </div>
            <div class="rewards" @click="openRewardsList">
                <Tex 
                    image="achievementGift"

                    width="50px"
                    height="50px"
                />
            </div>
        </div>
        <div v-else class="header">
            <div class="title">
                <h3>MY LIST</h3>
            </div>
        </div>

        <ul v-if="achievementsWithState.length" class="achievements">
            <UiVirtualizedScroll
                :items="achievementsWithState"
                key-field-id="id"
                :item-size="{ height: mobile ? 375 : 110 }"

                v-slot="{ item: achievement }"
            >
                <li
                    :class="{ completed: achievement.completed }"

                    v-tooltip="({
                        text: achievement.completed ?
                            'Reset'
                            :
                            'Mark as <b>completed</b>',
                        icon: 'mouseLeft'
                    } satisfies TooltipBinding)"

                    @click="completeOrResetAchievement(achievement)"
                >
                    <Tex
                        class="icon"
                        :image="ACHIEVEMENT_ICONS[achievement.category][achievement.rarity]"

                        width="100px"
                        height="100px"
                    >
                        <img
                            class="hero-owner"
                            v-if="displayHeroOwner && achievement.heroOwner"
                            :src="`${achievement.heroOwner.dataDir}spray.webp`"
                            draggable="false"
                        />
                    </Tex>

                    <div class="details">
                        <div class="info">
                            <div class="title">
                                <h3>{{ achievement.title }}</h3>
                                <p v-if="achievement.completed" class="completed">
                                    COMPLETED
                                </p>
                            </div>
                            <p>{{ achievement.description }}</p>
                        </div>

                        <div
                            class="progress"
                            v-tooltip="({
                                text: ''
                            } satisfies TooltipBinding)"
                            @click.stop
                        >
                            <FormAdvancedInput
                                v-if="!achievement.completed"
                                :number-input="{
                                    min: 0,
                                    max: achievement.requirement,
                                    step: 1,
                                    hideLargeStepButtons: true
                                }"

                                :model-value="(achievement.current ?? 0) + ''"
                                @update:model-value="setAchievement(achievement.id, parseInt($event) || 0)"
                            />
                            <p>
                                <span
                                    v-if="achievement.completed"
                                >{{ achievement.current }}</span>/{{ achievement.requirement }}
                            </p>
                        </div>
                    </div>

                    <div
                        class="add-to-list"

                        @click.stop="toggleAchievementInList(achievement.id)"

                        v-tooltip="({
                            text: achievement.inList ?
                                'Remove from <b>My List</b>'
                                :
                                'Add to <b>My List</b>',
                            icon: 'mouseLeft'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            :image="achievement.inList ? 'checklist' : 'checklistPlus'"

                            width="30px"
                            height="30px"

                            :color="achievement.inList ? 'var(--color-accent)' : 'var(--blue-gray)'"
                            hover="color"
                            hover-color="var(--color-accent)"
                        />
                    </div>
                    <div class="points">
                        <Tex
                            image="achievementPoint"

                            width="60px"
                            height="60px"

                            color="#757782"
                        />
                        <p>{{ achievement.reward }}</p>
                    </div>
                </li>
            </UiVirtualizedScroll>
        </ul>
        <div v-else-if="achievements.length != 0" class="no-results">
            <p>No achievements match your filters</p>
            <FormButton
                size="tiny"
                @click="$emit('resetFilters')"
            >
                Reset filters
            </FormButton>
        </div>
        <div v-else-if="category == 'my-list'" class="no-results">
            <p>You haven't added any achievements to your list yet</p>
        </div>
        <div v-else class="no-results">
            <p>There are no achievements here</p>
        </div>
    </div>
</template>

<style src="@/assets/style/components/achievements.sass" scoped></style>

<script lang="ts">
export type AchievementWithState = {
    id: string,
    current?: number | undefined,
    owner?: string | undefined,
    title: string,
    description: string,
    category: AchievementTypeCategory,
    rarity: AchievementTypeRarity,
    requirement: number,
    reward: number,
    completed: boolean
}
</script>

<script setup lang="ts">
import { ACHIEVEMENT_ICONS, type Achievement, type AchievementType, type AchievementTypeCategory, type AchievementTypeRarity } from '~/assets/data/achievements/achievements';
import type { TooltipBinding } from '~/directives/tooltip';
import AchievementCategoryRewards from '../modals/AchievementCategoryRewards.vue';
import { HERO_LIST } from '~/assets/data/heroes';

const { openModal } = useModalManager();

const props = withDefaults(defineProps<{
    category: AchievementTypeCategory,
    achievements: AchievementType[],

    sort?: (a: AchievementWithState, b: AchievementWithState) => number,
    filter?: (achievement: AchievementWithState) => boolean,

    displayHeroOwner?: boolean
}>(), {
    filter: () => true
});

const emits = defineEmits<{
    resetFilters: []
}>()

const mobile = isMobile();

const achievementsStore = useLocalStorage<Achievement[]>('achievements', []);
const achievementsListStore = useLocalStorage<string[]>('achievements-my-list', []);

const achievementPointsToGain = computed(() => props.achievements.map(a => a.reward).reduce((s, c) => s + c, 0));
const achievementPointsObtained = computed(() => 
    achievementsWithState.value.filter(as => as.completed)
                               .map(as => as.reward)
                               .reduce((s, c) => s + c, 0)
);

const achievementsWithState = computed(() => {
    const mapped = props.achievements.map(a => ({
        ...a,
        ...(achievementsStore.value.find(state => state.id == a.id) ?? {}),
        heroOwner: HERO_LIST.find(h => h.id == a.owner)
    }));

    const final = mapped.map(a => ({ 
                            ...a,
                            completed: a.current == a.requirement,
                            inList: achievementsListStore.value.includes(a.id)
                        }))
                        .filter(props.filter)
                        .sort(props.sort ?? (() => 0));

    if (!props.sort)
        return final.toReversed();
    
    return final;
});

function getAchievement(achievementId: string) {
    const achievementExisting = achievementsStore.value.find(a => a.id == achievementId);

    return achievementExisting ?? null;
}

function setAchievement(achievementId: string, current: number) {
    const achievementExisting = getAchievement(achievementId);

    if (achievementExisting)
        achievementExisting.current = current;
    else
        achievementsStore.value.push({
            id: achievementId,
            current: current
        });
}

function completeOrResetAchievement(achievement: AchievementType) {
    const achievementExisting = getAchievement(achievement.id);
    if (achievementExisting?.current == achievement.requirement)
        setAchievement(achievement.id, 0);
    else
        setAchievement(achievement.id, achievement.requirement);
}

function toggleAchievementInList(achievementId: string) {
    if (achievementsListStore.value.includes(achievementId))
        achievementsListStore.value.splice(achievementsListStore.value.indexOf(achievementId), 1);
    else
        achievementsListStore.value.push(achievementId);
}

function openRewardsList() {
    openModal(AchievementCategoryRewards, {
        category: props.category,
    })
    .promise
    .catch(() => null);
}
</script>