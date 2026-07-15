<template>
    <div class="reward-preview">
        <Tex
            class="close"
            image="cross"
            color="var(--blue)"
            hover="color"
            hover-color="var(--light-blue-highlight)"
            clickable

            width="30px"
            height="30px"

            @click="$emit('close')"
        />

        <div class="preview-wrapper">
            <div :class="['preview-container', `type-${rewardType}`]">
                <div v-if="rewardType == 'item'" class="reward">
                    <img :src="reward.icon" draggable="false" :alt="reward.name" />
                </div>
                <div v-else-if="rewardType == 'profile-card'" class="reward">
                    <div class="frame-container">
                        <div class="nameplate">
                            <img
                                v-if="equippedNameplate.type == 'normal'"
                                :src="`/img/cosmetics/items/nameplates/${equippedNameplate.id}.webp`"
                                width="500px"
                                :alt="equippedNameplate.name"
                                draggable="false"
                            />
                            <img
                                v-else-if="equippedNameplate.type == 'animated'"
                                :src="`/img/cosmetics/items/nameplates/${equippedNameplate.id}_animated.webp`"
                                width="500px"
                                :alt="equippedNameplate.name"
                                draggable="false"
                            />
                        </div>

                        <img
                            v-if="equippedFrame"
                            :src="frameToCosmeticItem(equippedFrame, true).image"
                            width="500px"
                            :alt="equippedFrame.name"
                            draggable="false"
                        />

                        <div class="profile-info">
                            <div class="level-name">
                                <p class="with-separator">{{ profile.level }}</p>
                                <p>{{ profile.name }}</p>
                            </div>
                            <div
                                v-if="equippedTitle"
                                :class="['title', `rarity-${selectedTitle?.rarity}`]"
                            >
                                <p>{{ equippedTitle }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <template v-else-if="rewardType == 'large-icon'">
                    <FormMultiToggle
                        class="toggle"

                        both
                        :vertical="useScreenDimensions().value.width >= 470"
                        v-model="heroIconDisplayMode"
                    >
                        <template #hero-select>
                            <Tex
                                image="hero"
                                color="var(--blue)"

                                width="30px"
                                height="30px"

                                v-tooltip="{
                                    text: 'Hero Select'
                                }"
                            />
                        </template>
                        <template #battle>
                            <Tex
                                image="battle"
                                color="var(--blue)"

                                width="30px"
                                height="30px"

                                v-tooltip="{
                                    text: 'In-Game UI'
                                }"
                            />
                        </template>
                    </FormMultiToggle>

                    <div v-if="heroIconDisplayMode == 'hero-select'" class="reward">
                        <UiAnimatedIconLarge
                            :icon-mask="hero.iconLargeMask"
                            :reward="equippedPortrait"
                            :hero-role="heroRolesAsArray(hero.roles)[0]"

                            :shine="false"
                            :frame="equippedProfFrame"
                            :badge="equippedBadge"
                        />
                    </div>
                    <div v-else-if="heroIconDisplayMode == 'battle'" class="reward">
                        <UiAnimatedIconBattle
                            :reward="equippedBattlePortrait"
                            :hero-role="heroRolesAsArray(hero.roles)[0]"

                            :frame="equippedProfFrame"
                            :badge="equippedBadge"
                        />
                    </div>
                </template>
            </div>
        </div>

        <div class="reward-list-switch">
            <FormToggle
                both
                v-model="displayRelatedRewards"
            >
                <template #off>
                    all rewards
                </template>
                <template #on>
                    customize preview
                </template>
            </FormToggle>
        </div>

        <PanelHorizontalScrollContainer ref="reward-list-scroller" class="reward-list-wrapper">
            <PanelHeroProficiencyRewardList
                :hero="hero"
                :checked="selectedRewards"
                :selectedItemSpecial="true"
                :selected-item="reward.level"

                embedded

                no-wrap
                :filter="rewardListFilter"

                :reward-tooltip="rewardTooltip"
                :level-tooltip="rewardTooltip"

                @reward-click="clickReward"
                @level-click="clickReward"
            >
                <template #empty>
                    <h3>This reward is not customizable</h3>
                </template>
            </PanelHeroProficiencyRewardList>
        </PanelHorizontalScrollContainer>
    </div>
</template>

<style src="@/assets/style/components/reward-preview.sass" scoped></style>

<script setup lang="ts">
import { DEFAULT_PROFILE_STORE, levelToRank, ProfileStoreSchema, type HeroData, type Reward } from '~/assets/data/common';
import { FRAMES, type Frame } from '~/assets/data/cosmetics/frames/frames';
import { NAMEPLATES } from '~/assets/data/cosmetics/nameplates/nameplates';
import { heroRolesAsArray } from '~/assets/data/heroes';
import { type TooltipBinding } from '~/directives/tooltip';

const NAMEPLATE_MAP: Record<string, string> = {
    "3": '002',
    "24": '003',
    "34": '004',
    "65": '005'
}

const props = defineProps<{
    hero: HeroData,
}>();
const reward = defineModel<Reward>({ required: true });
function setReward(level: number) {
    const rank = levelToRank(level);
    reward.value = rank!.rewards.find(r => r.level == level)!;
}
watch(reward, selectReward);

defineEmits<{
    close: []
}>()

const rewardListScroller = useTemplateRef('reward-list-scroller');

const rewardType = computed(() => {
    const type = reward.value.type ?? 'item';
    if (['portrait', 'badge', 'frame'].includes(type))
        return 'large-icon';
    if (['nameplate', 'title'].includes(type))
        return 'profile-card';

    return 'item';
});
watch(rewardType, () => nextTick(() =>
    rewardListScroller.value?.updateBounds()
));

function scrollToSelectedLevel() {
    const selectedRewardEl = (rewardListScroller.value?.$el as HTMLElement)
        .querySelector(`#__level_${reward.value.level}`);
    if (selectedRewardEl)
        rewardListScroller.value?.scrollToElement(selectedRewardEl as HTMLElement, 0.15, -10);
}
onMounted(scrollToSelectedLevel);

const displayRelatedRewards = ref(false);
watch(displayRelatedRewards, (display) => nextTick(() => {
    rewardListScroller.value?.updateBounds();
    if (display)
        rewardListScroller.value?.scrollTo(0);
    else {
        scrollToSelectedLevel();
    }
}));

const rewardListFilter = computed(() => {
    if (!displayRelatedRewards.value)
        return undefined;

    if (rewardType.value == 'item')
        return () => false;
    if (rewardType.value == 'large-icon')
        return (reward: Reward) => ['portrait', 'badge', 'frame'].includes(reward.type ?? 'item');
    
    return (reward: Reward) => ['nameplate', 'title'].includes(reward.type ?? 'item');
})

const rewardTooltip = computed<TooltipBinding>(() => {
    if (!displayRelatedRewards.value)
        return {
            text: `Preview reward`,
            icon: 'mouseLeft'
        }
    
    return {
        text: 'Add to preview',
        icon: 'mouseLeft'
    }
});

function clearSelectedRewards() {
    selectedNameplate.value = null;
    selectedTitle.value = null;

    selectedPortrait.value = null;
    selectedProfFrame.value = null;
    selectedBadge.value = null;
}

function selectReward(reward: Reward) {
    switch (reward.type) {
        case 'nameplate':
            if (selectedNameplate.value?.level == reward.level)
                selectedNameplate.value = null;
            else
                selectedNameplate.value = reward;
            break;
        case 'title':
            if (selectedTitle.value?.level == reward.level)
                selectedTitle.value = null;
            else
                selectedTitle.value = reward;
            break;

        case 'portrait':
            selectedPortrait.value = reward;
            break;
        case 'frame':
            if (selectedProfFrame.value?.level == reward.level)
                selectedProfFrame.value = null;
            else
                selectedProfFrame.value = reward;
            break;
        case 'badge':
            if (selectedBadge.value?.level == reward.level)
                selectedBadge.value = null;
            else
                selectedBadge.value = reward;
            break;
    }
}

function clickReward(levelOrReward: Reward|number) {
    if (!displayRelatedRewards.value) {
        if (typeof levelOrReward === 'number')
            setReward(levelOrReward);
        else
            reward.value = levelOrReward;

        clearSelectedRewards();
        selectReward(reward.value);
    }
    else {
        let reward: Reward;
        if (typeof levelOrReward === 'number') {
            const rank = levelToRank(levelOrReward);
            reward = rank!.rewards.find(r => r.level == levelOrReward)!;
        }
        else
            reward = levelOrReward;

        selectReward(reward);
    }
}

// ============ NAMEPLATE ============
const selectedNameplate = ref<Reward|null>(null);
const selectedTitle = ref<Reward|null>(null);

const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);

const nameplates = NAMEPLATES();
const equippedNameplate = computed(() => {
    let nameplateId = profile.value.nameplate;
    if (selectedNameplate.value)
        nameplateId = `3${props.hero.internalId}${NAMEPLATE_MAP[selectedNameplate.value.level]!}`;

    return nameplates.find(np => nameplateId == np.id)!;
});
const ownedFrames = useLocalStorage<string[]>('frames_owned', []);

const frames = FRAMES();
const framesById = Object.fromEntries(frames.map(f => [ f.id, f ]));
const equippedFrameId = ref(profile.value.frame);
const equippedFrame = computed(() => equippedFrameId.value ? framesById[equippedFrameId.value]! : null);

function frameToCosmeticItem(f: Frame, large = false) {
    const name = large ? 'img_nameplateframe_' : 'img_playerheadframe_';

    const owned = ownedFrames.value.includes(f.id);

    return {
        ...f,
        image: `/img/cosmetics/items/frames/${large ? 'nameplate' : 'icon'}/${name}${f.id}.png`,
        tooltip: {
            text: `${owned ? 'Unmark' : 'Mark'} as <b>owned</b>`,
            icon: 'mouseRight'
        }
    }
}

const equippedTitle = computed(() => selectedTitle?.value?.name ?? profile.value.title);

// ============ HERO SELECT ============
const heroIconDisplayMode = ref<'hero-select'|'battle'>('hero-select');
const ownedCostumes = useLocalStorage<string[]>(`cosmetics_owned_${props.hero.id}`, []);

const selectedPortrait = ref<Reward|null>(null);
const selectedProfFrame = ref<Reward|null>(null);
const selectedBadge = ref<Reward|null>(null);

const equippedPortrait = computed<Reward>(() => {
    const hasEasterEgg = props.hero.easterEgg && ownedCostumes.value.includes(props.hero.easterEgg);

    if (!selectedPortrait.value)
        return {
            type: 'portrait',
            level: 1,
            name: 'Default Avatar',
            icon: `${props.hero.dataDir}${hasEasterEgg ? 'easter-egg/' : ''}transverse-head.webp`,
            rarity: 'rare',
        } as Reward;
    
    if (selectedPortrait.value.level == 1)
        return {
            ...cloneObjectRefAsRaw<Reward>(selectedPortrait)!,
            icon: `${props.hero.dataDir}${hasEasterEgg ? 'easter-egg/' : ''}transverse-head.webp`,
        } as Reward;
    if (selectedPortrait.value.level == 20)
        return {
            ...cloneObjectRefAsRaw<Reward>(selectedPortrait)!,
            icon: `${props.hero.dataDir}${hasEasterEgg ? 'easter-egg/' : ''}bust-lord.webp`,
        } as Reward;

    return {
        ...cloneObjectRefAsRaw<Reward>(selectedPortrait)!,
        iconAnimation: {
            size: props.hero.iconAnimationSize ?? [3600, 4000],
            columns: 6,
            rows: 10,
            fps: props.hero.ranks.find(r => r.type.id == 'champion')!.type.rewards[0]!.iconAnimation!.fps,
            offset: props.hero.iconLargeAnimationOffset ?? props.hero.iconAnimationOffset
        }
    };
});

const equippedBattlePortrait = computed<Reward>(() => {
    const hasEasterEgg = props.hero.easterEgg && ownedCostumes.value.includes(props.hero.easterEgg);

    if (!selectedPortrait.value)
        return {
            type: 'portrait',
            level: 1,
            name: 'Default Avatar',
            icon: `${props.hero.dataDir}${hasEasterEgg ? 'easter-egg/' : ''}battle-head.webp`,
            rarity: 'rare',
        } as Reward;
    
    if (selectedPortrait.value.level == 1)
        return {
            ...cloneObjectRefAsRaw<Reward>(selectedPortrait)!,
            icon: `${props.hero.dataDir}${hasEasterEgg ? 'easter-egg/' : ''}battle-head.webp`,
        } as Reward;
    if (selectedPortrait.value.level == 20)
        return {
            ...cloneObjectRefAsRaw<Reward>(selectedPortrait)!,
            icon: `${props.hero.dataDir}${hasEasterEgg ? 'easter-egg/' : ''}battle-head-lord.webp`,
        } as Reward;

    let icon = selectedPortrait.value.icon;
    if (props.hero.iconBattleAltAnimation)
        icon = `${props.hero.dataDir}${props.hero.iconBattleAltAnimation}.webp`;

    return {
        ...cloneObjectRefAsRaw<Reward>(selectedPortrait)!,
        icon,
        iconAnimation: {
            size: props.hero.iconAnimationSize ?? [3600, 4000],
            columns: 6,
            rows: 10,
            fps: props.hero.ranks.find(r => r.type.id == 'champion')!.type.rewards[0]!.iconAnimation!.fps,
            offset: props.hero.iconBattleAnimationOffset
        }
    };
});

const equippedProfFrame = computed<'colonel'|'elite'|null>(() => {
    if (!selectedProfFrame.value)
        return null;

    if (selectedProfFrame.value.level == 30)
        return 'colonel';

    return 'elite'
});
const equippedBadge = computed<'count'|'warrior'|'guardian'|'champion'|null>(() => {
    if (!selectedBadge.value)
        return null;

    switch (selectedBadge.value.level) {
        case 25:
            return 'count';
        case 35:
            return 'warrior';
        case 45:
            return 'guardian';
        case 55:
            return 'champion';
    }

    return null;
})


clearSelectedRewards();
selectReward(reward.value);

const selectedRewards = computed<number[]>(() => {
    const selected: number[] = [];

    if (!displayRelatedRewards.value)
        return selected;

    if (selectedNameplate.value)
        selected.push(selectedNameplate.value.level);
    if (selectedTitle.value)
        selected.push(selectedTitle.value.level);

    if (selectedPortrait.value)
        selected.push(selectedPortrait.value.level);
    if (selectedProfFrame.value)
        selected.push(selectedProfFrame.value.level);
    if (selectedBadge.value)
        selected.push(selectedBadge.value.level);

    return selected;
});
</script>