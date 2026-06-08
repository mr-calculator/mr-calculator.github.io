<template>
    <div :class="{rewards: 1, contrast: contrastMode, 'no-clicking': noClicking}">
        <div
            v-for="[level, [rewards, rank]] in aggregatedRewards"
            :key="`${hero.id}_${level}`"
            :id="`${idPrefix ?? ''}__level_${level}`"
            :class="{
                'level-rewards': 1,
                selected: selectedItem == level,
                checked: checked?.includes(level),
                special: selectedItem == level && selectedItemSpecial
            }"

            @click="$emit('rewardClick', level)"

            v-tooltip="noClicking ? undefined : tooltip"
        >
            <div class="reward-list">
                <div
                    v-for="reward in rewards"
                    :key="`${hero.id}_${reward.level}_${reward.name}_${reward.icon}`"
                    class="reward"
                >
                    <div :class="['image', `rarity-${reward.rarity ?? 'none'}`]">
                        <ClientOnly>
                            <Tex
                                v-if="checked?.includes(level)"
                                class="check"
                                image="checkCorner"

                                width="30px"
                                height="30px"
                                object-fit="contain"
                            />
                        </ClientOnly>
                        <img
                            v-if="!reward.iconAnimation"
                            class="icon"
                            :src="reward.icon"
                            :alt="`${reward.name} Icon`"
                            draggable="false"
                        />
                        <div v-else class="animated-icon-wrapper">
                            <UiAnimatedIcon
                                class="animated-icon"
                                :reward="reward"
                                :size="240"
                            />
                        </div>
                    </div>
                    <div class="name">
                        <h3>{{ reward.name }}</h3>
                    </div>
                </div>
            </div>

            <div class="level-title">
                <div v-if="rank" class="rank-icon">
                    <img :src="rank.icon" :alt="`${rank.name} Icon`" draggable="false" />
                </div>
                <h3>LV{{ level }}</h3>
            </div>
        </div>

        <div
            v-if="hasEasterEgg && hero.easterEggMessage"
            class="easter-egg"
            v-html="hero.easterEggMessage"
        />
    </div>
</template>

<style src="@/assets/style/components/hero-proficiency-reward-list.sass" scoped></style>

<script setup lang="ts">
import { levelToRank, replaceRewardPlaceholders, type HeroData, type ProficiencyRank, type Reward } from '~/assets/data/common';
import { tex } from '~/assets/data/textures';
import type { TooltipBinding } from '~/directives/tooltip';

const props = defineProps<{
    hero: HeroData,
    checked?: number[],
    selectedItem?: number,
    showAllLevels?: boolean,

    contrastMode?: boolean,
    selectedItemSpecial?: boolean,
    idPrefix?: string,

    noClicking?: boolean,
    tooltip?: TooltipBinding
}>();

const emit = defineEmits<{
    rewardClick: [ level: number ]
}>();

// =======EASTER EGG========
const cosmeticsKey = computed(() => `cosmetics_owned_${props.hero.id}`);
const ownedCostumes = useLocalStorage<string[]>(cosmeticsKey, []);
const hasEasterEgg = ref(false);
function checkEasterEgg() {
    if (import.meta.server) {
        hasEasterEgg.value = false;
        return;
    }

    if (!props.hero.easterEgg) {
        hasEasterEgg.value = false;
        return;
    }

    const ownsSkin = ownedCostumes.value.includes(props.hero.easterEgg);
    if (!ownsSkin) {
        hasEasterEgg.value = false;
        return;
    }

    hasEasterEgg.value = true;
}

onMounted(checkEasterEgg);
watch([() => props.hero, ownedCostumes], () => nextTick(checkEasterEgg));


function applyEasterEgg(reward: Reward) {
    if (!hasEasterEgg.value)
        return;

    switch (reward.name) {
        case 'Default Avatar':
            reward.icon = `%HERO_DATA_DIR%easter-egg/head.webp`;
            break;
        case '%HERO_NAME% Lord Icon':
            reward.icon = `%HERO_DATA_DIR%easter-egg/head-lord.webp`;
            break;
        case '%HERO_NAME% Champion Icon':
            reward.icon = `%HERO_DATA_DIR%easter-egg/bust-champion.webp`;
            break;
    }
}

// =========================

const idPrefix = computed(() => props.idPrefix ? btoa(props.idPrefix) : undefined);

const allRewards = computed<Reward[]>(() => {
    const allRewards: Reward[] = [];
    props.hero.ranks.forEach(rank => {
        rank.type.rewards.forEach(reward => {
            allRewards.push(cloneObjectRefAsRaw(reward) ?? reward)
        })
    })

    return allRewards;
});

const aggregatedRewards = computed(() => {
    let aggregated: Map<number, [Reward[], ProficiencyRank?]> = new Map();
    let min = 1;
    let max = 0;
    allRewards.value.forEach(r => {
        if (!aggregated.has(r.level))
            aggregated.set(r.level, [[], levelToRank(r.level, true)]);

        if (r.level < min)
            min = r.level;
        if (r.level > max)
            max = r.level;

        const reward = cloneObjectRefAsRaw(r) ?? r;
        if (hasEasterEgg.value)
            applyEasterEgg(reward);

        const processed: Reward = {
            ...reward,
            name: replaceRewardPlaceholders(reward.name, props.hero),
            icon: replaceRewardPlaceholders(reward.icon, props.hero)
        }

        if (processed.iconAnimation) {
            if (props.hero.iconAnimationSize)
                processed.iconAnimation.size = cloneObjectRefAsRaw(props.hero.iconAnimationSize)!;

            if (props.hero.iconAnimationOffset)
                processed.iconAnimation.offset = cloneObjectRefAsRaw(props.hero.iconAnimationOffset)!;
        }

        aggregated.get(r.level)![0].push(processed);
    })

    if (props.showAllLevels) {
        const emptyReward: () => [Reward[], ProficiencyRank?] = () => [
            [{
                level: 0,
                name: 'No Reward',
                icon: tex('none'),
            }]
        ];

        for (let level = min; level <= max; level++)
            if (!aggregated.has(level))
                aggregated.set(level, emptyReward())

        aggregated = new Map([...aggregated.entries()].sort((entry1, entry2) => entry1[0] - entry2[0]));
    }

    return aggregated;
});

</script>