<template>
    <div
        class="profile-page simple-page no-navbar"
        :style="{
            '--hero-silhouette': `url(${selectedHero.dataDir}silhouette.webp)`,
        }"
    >
        <div class="silhouette" />

        <main>
            <div class="profile-overview">
                <div class="header">
                    <div class="icon-name">
                        <UiProfileIcon to="/profile/customize/nameplate" />

                        <div class="name" @click="changeName">
                            <ClientOnly>
                                <h2>{{ profile.name }}</h2>
                                <template #fallback>
                                    <h2>Guest</h2>
                                </template>
                            </ClientOnly>
                            <Tex
                                image="edit"

                                width="32px"
                                height="32px"
                            />
                        </div>
                    </div>
                    <div
                        class="share"
                        @click="createProfileSheet"
                        v-tooltip="({
                            text: 'Share your profile',
                            icon: 'mouseLeft'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            image="share"

                            width="32px"
                            height="32px"
                        />
                    </div>
                </div>

                <div class="overview">
                    <div class="bar">
                        Proficiency Stats
                    </div>
                    <div class="panels">
                        <div
                            class="ranked"
                            :style="{
                                '--season-bg': `url('/img/season-banners/season_${LATEST_SEASON_NO}.png')`
                            }"
                        >
                            <template v-if="highestRanksWithHeroData.length && highestRanksWithHeroData[0]!.store.level > 1">
                                <div class="rank">
                                    <img
                                        class="bg"
                                        :src="PROFICIENCY_RANK_BADGE_BGS[highestRanksWithHeroData[0]!.rank.id]"
                                        draggable="false"
                                    >
                                    <img 
                                        :src="PROFICIENCY_RANK_BADGES[highestRanksWithHeroData[0]!.rank.id]"
                                        :alt="highestRanksWithHeroData[0]!.rank.name + ' Badge'"
                                        draggable="false"
                                    />
                                    <div class="level">
                                        {{ highestRanksWithHeroData[0]!.store.level }}
                                    </div>
                                </div>
                                <div class="details">
                                    <div class="level">
                                        {{ highestRanksWithHeroData[0]!.rank.name }}
                                        LV. {{ highestRanksWithHeroData[0]!.store.level }}
                                    </div>
                                    <div class="hero">
                                        {{ highestRanksWithHeroData[0]!.store.hero!.name }}
                                    </div>
                                </div>
                            </template>
                            <div v-else class="no-data">
                                <div class="info">
                                    No Data
                                </div>
                            </div>
                        </div>
                        <div class="stats">
                            <div class="panel">
                                <div
                                    v-for="rank in highestRanksWithHeroData.slice(0, 3)"
                                    :key="rank.store.hero.id"
                                    class="item"
                                >
                                    <img
                                        :src="`${rank.store.hero.dataDir}head.webp`"
                                        :alt="`${rank.store.hero.name} Portrait`"
                                        draggable="false"
                                    />
                                    <div class="info">
                                        <p>{{ rank.store.hero.name }}</p>
                                        <h3>{{ rank.store.level }} <span>LVLS</span></h3>
                                        <h4>{{ rank.rank.name }}</h4>
                                    </div>
                                </div>

                                <div class="item">
                                    <Tex
                                        image="proficiency"
                                        color="#8e919b"

                                        width="45px"
                                        height="45px"
                                    />
                                    <div class="info">
                                        <p>Proficiency Points</p>
                                        <ClientOnly>
                                            <h3>{{ totalPoints.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}</h3>
                                            <template #fallback>
                                                <h3>—</h3>
                                            </template>
                                        </ClientOnly>
                                    </div>
                                </div>
                                <div class="item">
                                    <img :src="tex('lordBadgeGray')">
                                    <div class="info">
                                        <p>Lord+ Heroes</p>
                                        <ClientOnly>
                                            <h3>{{ lordsNo }}</h3>
                                            <template #fallback>
                                                <h3>—</h3>
                                            </template>
                                        </ClientOnly>
                                    </div>
                                </div>
                                <div class="item">
                                    <img :src="tex('championBadgeGray')">
                                    <div class="info">
                                        <p>Champion Heroes</p>
                                        <ClientOnly>
                                            <h3>{{ champsNo }}</h3>
                                            <template #fallback>
                                                <h3>—</h3>
                                            </template>
                                        </ClientOnly>
                                    </div>
                                </div>
                            </div>
                            <div class="panel favourites">
                                <span class="bar">Other</span>

                                <div class="item">
                                    <Tex
                                        image="careerAchievements"
                                        color="#8e919b"

                                        width="65px"
                                        height="65px"
                                    />
                                    <div class="info">
                                        <p>Achievements Unlocked</p>
                                        <ClientOnly>
                                            <h3>{{ achievementsCount }}</h3>
                                            <template #fallback>
                                                <h3>—</h3>
                                            </template>
                                        </ClientOnly>
                                    </div>
                                </div>
                                <div class="item">
                                    <Tex
                                        image="skinIcon"
                                        color="#8e919b"

                                        width="65px"
                                        height="65px"
                                    />
                                    <div class="info">
                                        <p>Costumes Owned</p>
                                        <ClientOnly>
                                            <h3>{{ ownedCostumesCount }}</h3>
                                            <template #fallback>
                                                <h3>—</h3>
                                            </template>
                                        </ClientOnly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-display">
                <ClientOnly>
                    <div class="display-image-wrapper">
                        <img :src="selectedHeroSkin" :alt="selectedHero.name" draggable="false">
                    </div>
                </ClientOnly>
            </div>
        </main>

        <div class="change-hero" @click="heroSelectOpen = true">
            <Tex
                image="swap"
                color="#fff"

                width="23px"
                height="23px"
            />
            <h3>Change Hero</h3>
        </div>

        <InfoOverlay
            v-if="heroSelectOpen"
            class="profile-change-hero-overlay"
            title="Change hero"
            large
            no-overflow
            no-style
            @close="heroSelectOpen = false"
        >
            <div class="change-hero-overlay">
                <UiSeparator />
                <div class="select">
                    <div class="hero-select">
                        <PanelHeroList
                            embedded
                            :selected-hero="heroSelectSelectedHero"
                            :links="false"
                            :add-hero-enabled="false"
                            :show-unknown-heroes="false"

                            list-view-disabled

                            @click-hero="clickHero"
                        />
                        <br><br>
                    </div>
                    <div
                        ref="costume-list"
                        :class="{'costume-select': 1, 'mobile-open': heroSelectCostumeListOpen}"
                    >
                        <Tex
                            image="cross"
                            color="#fff"

                            width="30px"
                            height="30px"

                            @click="heroSelectCostumeListOpen = false"
                        />

                        <div class="scroll-container">
                            <div
                                v-for="costume in heroSelectCostumes"
                                :key="costume.id ?? 'default'"
                                :class="{
                                    costume: 1,
                                    checked: heroSelectSelectedCostume == costume.id
                                }"

                                @click="heroSelectSelectedCostume = costume.id ?? undefined"
                            >
                                <div class="info">
                                    <img
                                        v-if="costume.rarity"
                                        :src="tex(RARITY_DATA[costume.rarity].tex)"
                                        draggable="false"
                                    >
                                    <h4>{{ costume.name }}</h4>
                                </div>

                                <div v-if="heroSelectSelectedCostume == costume.id" class="check">
                                    <Tex
                                        image="dropdownCheck"
                                        color="var(--color)"

                                        width="25px"
                                        height="25px"
                                    />
                                </div>
                            </div>
                        </div>

                        <FormButton
                            class="confirm-button"
                            size="small"
                            @click="confirmSelectHero"
                        >
                            Confirm
                        </FormButton>
                    </div>
                </div>

                <div class="buttons">
                    <FormButton
                        size="small"
                        @click="confirmSelectHero"
                    >
                        Confirm
                    </FormButton>
                    <FormButton
                        size="small"
                        color-scheme="white"
                        @click="heroSelectOpen = false"
                    >
                        Cancel
                    </FormButton>
                </div>
            </div>
        </InfoOverlay>

        <Teleport to="body">
            <div
                v-if="profileSheetUrl"
                class="profile-sheet-overlay"
            >
                <div ref="profile-sheet-overlay-container" class="container">
                    <div class="image-wrapper">
                        <Tex
                            class="draw top-left"
                            image="drawTopLeftCorner"

                            width="auto"
                            height="100%"
                        />
                        <Tex
                            class="draw bottom-right"
                            image="drawBottomRightCorner"

                            width="auto"
                            height="100%"
                        />
                        <Tex
                            class="draw bottom-left"
                            image="drawBottomLeftCorner"

                            width="60px"
                            height="auto"
                        />

                        <img
                            :src="profileSheetUrl !== 'loading'
                                ? profileSheetUrl
                                : tex('pageLoadingBg')
                            "

                            @click="openLightBox"
                        >
                    </div>

                    <div class="buttons">
                        <FormButton
                            size="small"
                            color-scheme="dark"

                            @click="profileSheetUrl = null"
                        >
                            Close
                        </FormButton>
                        <FormButton
                            size="small"
                            color-scheme="white"

                            @click="downloadProfileSheet"
                        >
                            <Tex
                                image="download"
                                color="var(--dark)"

                                width="30px"
                                height="30px"
                            />
                            Download
                        </FormButton>
                        <FormButton
                            size="small"
                            color-scheme="white"

                            @click="copyProfileSheetLink"
                        >
                            <Tex
                                image="link"
                                color="var(--dark)"

                                width="32px"
                                height="24px"
                            />
                            Get a link
                        </FormButton>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div v-if="lightBoxedImage" class="lightbox-wrapper full" @click="lightBoxedImage = undefined">
                <img :src="lightBoxedImage" draggable="false">
            </div>
        </Teleport>
    </div>
</template>

<style lang="sass">
.profile-change-hero-overlay        
    .info-modal-content
        height: 100%

        .slot
            height: 100%
</style>

<style src="@/assets/style/pages/profile.sass" scoped></style>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { ACHIEVEMENTS, getAchievements, type Achievement } from '~/assets/data/achievements/achievements';
import { calcTotalXp, DEFAULT_HERO_STORE, DEFAULT_PROFILE_STORE, LATEST_SEASON_NO, PROFICIENCY_RANK_BADGE_BGS, PROFICIENCY_RANK_BADGES, PROFICIENCY_RANKS, ProfileStoreSchema, RARITY_DATA, type HeroData, type PlayerHeroStore, type ProfileSheetDataExportable } from '~/assets/data/common';
import { getHeroCostumes, RARITY_ORDER, type Costume, type CostumeRarity } from '~/assets/data/cosmetics/costumes/costumes';
import { HERO_LIST } from '~/assets/data/heroes';
import { tex } from '~/assets/data/textures';
import InputModal from '~/components/modals/InputModal.vue';
import type { TooltipBinding } from '~/directives/tooltip';
import { clearProfileSheetCache, generateProfileSheet } from '~/services/generate-profile-sheet';

const title = `Profile | MR Proficiency Calculator`
const description = `See your overall proficiency progress and stats`
useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogUrl: useCanonicalUrl('profile'),

    twitterTitle: title,
    twitterDescription: description,
});

useHead({
    link: [
        {
            rel: "canonical",
            href: useCanonicalUrl('profile')
        }
    ]
})

const { openModal } = useModalManager();
const { notify } = useNotificationManager();

definePageMeta({
    layout: 'profile-layout'
});

const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);

const allHeroesStores = ref<(PlayerHeroStore & { hero: HeroData })[]>([]);
const costumeStores = ref<string[][]>([]);

const unknownHeroes = useLocalStorage<HeroData[]>('unknown_heroes', []);
const ALL_HEROES = [...HERO_LIST, ...unknownHeroes.value];
function compileHeroStores() {
    ALL_HEROES.forEach(h => {
        const costumeStore = localStorage.getItem(`cosmetics_owned_${h.id}`);
        if (costumeStore)
            costumeStores.value.push(JSON.parse(costumeStore));

        const store = localStorage.getItem(`hero_${h.id}`);
        if (!store) {
            allHeroesStores.value.push({
                ...DEFAULT_HERO_STORE(),
                hero: h
            });
            return;
        }

        allHeroesStores.value.push({ ...JSON.parse(store), hero: h });
    });
}
onMounted(compileHeroStores);

const highestRanksWithHeroData = computed(() => {
    const sorted = allHeroesStores.value.toSorted((a,b) => b.level - a.level);
    return sorted.map(store => {
        return {
            store,
            rank: PROFICIENCY_RANKS[store.rank]!,
        }
    })
});

const lordsNo = computed(() =>
    allHeroesStores.value.reduce((sum, store) => store.level >= 20 ? sum + 1 : sum, 0)
);
const champsNo = computed(() =>
    allHeroesStores.value.reduce((sum, store) => store.level >= 50 ? sum + 1 : sum, 0)
);

const totalPoints = computed(() => {
    const allHeroStores = useAllHeroStores();

    return allHeroStores.value.reduce((sum, current) => {
        return sum + calcTotalXp(current.level, current.points)
    }
    , 0);
});


const achievementsStore = useLocalStorage<Achievement[]>('achievements', []);
const achievementsWithState = computed(() => {
    const mapped = getAchievements().map(a => ({
        ...a,
        ...(achievementsStore.value.find(state => state.id == a.id) ?? {})
    }));

    return mapped.map(a => ({ ...a, completed: a.current == a.requirement }));
});
const achievementsCount = computed(() =>
    achievementsWithState.value.filter(a => a.completed).length
);


const ownedCostumesCount = computed(() => costumeStores.value.flatMap(val => val).length);


function changeName() {
    openModal(InputModal, {
        title: "Change your name",
        inputPlaceholder: "New name...",
        inputValue: profile.value.name
    })
    .promise
    .then((name: string) => {
        name = name.trim();

        if (name.length < 3 || name.length > 50) {
            notify(
                `Name must be between 3 and 50 characters long!`,
                3000,
                { image: 'warning', color: '#c94f36' }
            );

            return;
        }
        
        profile.value.name = name;
    })
    .catch(() => null)
}


const heroSelectOpen = ref(false);
const heroSelectCostumeListOpen = ref(false);
const heroSelectCostumeList = useTemplateRef('costume-list');
onClickOutside(heroSelectCostumeList, () => heroSelectCostumeListOpen.value = false);

const heroSelectCostumes = computed<{ id: string|null, name: string, rarity: CostumeRarity|null }[]>(() => {
    const selectedHero = HERO_LIST.find(h => h.id == heroSelectSelectedHero.value)!;
    const heroCostumes = getHeroCostumes(heroSelectSelectedHero.value);

    return [
        {
            id: 'default',
            name: selectedHero.name,
            rarity: null
        },
        ...heroCostumes.map(c => ({
            id: c.id,
            name: c.name,
            rarity: c.rarity
        })).toSorted((a,b) => RARITY_DATA[b.rarity].order - RARITY_DATA[a.rarity].order)
    ]
});

const selectedHero = computed(() => HERO_LIST.find(h => h.id == profile.value.selectedHero.id)!);
const selectedHeroSkin = computed(() => {
    if (!profile.value.selectedHero.skin)
        return selectedHero.value.dataDir + 'full-body.webp';

    return `${selectedHero.value.dataDir}costumes/${profile.value.selectedHero.skin}.webp`
});

const _heroSelectSelectedHero = ref<string|null>(null);
const heroSelectSelectedHero = computed<string>({
    get() {
        return _heroSelectSelectedHero.value ?? selectedHero.value.id;
    },
    set(newValue: string) {
        _heroSelectSelectedHero.value = newValue;
    }
});
const _heroSelectSelectedCostume = ref<string|null>(null);
const heroSelectSelectedCostume = computed<string|undefined>({
    get() {
        return _heroSelectSelectedCostume.value ?? profile.value.selectedHero.skin;
    },
    set(newValue) {
        _heroSelectSelectedCostume.value = newValue ?? null;
    }
});

function clickHero(heroId: string) {
    heroSelectSelectedHero.value = heroId;
    heroSelectCostumeListOpen.value = true;
}

function confirmSelectHero() {
    profile.value.selectedHero.id = heroSelectSelectedHero.value;
    profile.value.selectedHero.skin = _heroSelectSelectedCostume.value === 'default' ?
        undefined : (_heroSelectSelectedCostume.value ?? undefined)

    heroSelectOpen.value = false;
}

watch(heroSelectOpen, (open) => {
    if (open)
        return;

    _heroSelectSelectedHero.value = null;
    _heroSelectSelectedCostume.value = null;
    heroSelectCostumeListOpen.value = false;
})

const lightBoxedImage = ref<string|undefined>();
function openLightBox() {
    if (profileSheetUrl.value && profileSheetUrl.value != 'loading')
        lightBoxedImage.value = profileSheetUrl.value;
}

const profileSheetUrl = ref<string|null>(null);
let profileSheetBlob: Blob|null = null;

const profileSheetOverlayContainer = useTemplateRef('profile-sheet-overlay-container');
onClickOutside(profileSheetOverlayContainer, () => {
    if (!lightBoxedImage.value)
        profileSheetUrl.value = null;
});

async function createProfileSheet() {
    profileSheetUrl.value = 'loading';
    profileSheetBlob = await generateProfileSheet({
        profile: {
            name: profile.value.name,
            level: profile.value.level,
            selectedHeroImageUrl: selectedHeroSkin.value,
            iconUrl: `/img/cosmetics/items/icons/${profile.value.nameplate}.webp`,
            frameUrl: profile.value.frame
                ? `/img/cosmetics/items/frames/icon/img_playerheadframe_${profile.value.frame}.png`
                : undefined,
            highestRank: {
                iconUrl: PROFICIENCY_RANK_BADGES[highestRanksWithHeroData.value[0]!.rank.id]!,
                iconBgUrl: PROFICIENCY_RANK_BADGE_BGS[highestRanksWithHeroData.value[0]!.rank.id]!,
                name: highestRanksWithHeroData.value[0]!.rank.name,
                level: highestRanksWithHeroData.value[0]!.store.level,
                heroName: highestRanksWithHeroData.value[0]!.store.hero.name
            }
        },
        heroes: highestRanksWithHeroData.value.slice(0, 3).map(s => ({
            name: s.store.hero.name,
            iconUrl: s.store.hero.dataDir + 'head.webp',
            levels: s.store.level,
            rankName: s.rank.name,
        })),
        proficiency: {
            points: totalPoints.value,
            lords: lordsNo.value,
            champions: champsNo.value,
        },
        other: {
            achievements: achievementsCount.value,
            costumes: ownedCostumesCount.value
        }
    });
    const url = URL.createObjectURL(profileSheetBlob);

    if (profileSheetUrl.value)
        URL.revokeObjectURL(profileSheetUrl.value);

    profileSheetUrl.value = url;
}

function createProfileSheetLink() {
    const profileData: ProfileSheetDataExportable['p'] = [
        profile.value.name,
        profile.value.level,
        selectedHeroSkin.value,
        profile.value.nameplate,
        
            highestRanksWithHeroData.value[0]!.rank.id,
            highestRanksWithHeroData.value[0]!.store.level,
            highestRanksWithHeroData.value[0]!.store.hero.name,
    ];

    if (profile.value.frame)
        profileData.push(profile.value.frame);

    const serialized: ProfileSheetDataExportable = {
        p: profileData,
        h: highestRanksWithHeroData.value.slice(0, 3).map(s => {
            const hero: ProfileSheetDataExportable['h'][0] = [
                s.store.hero.id,
                s.store.level,
                s.rank.name,
            ];

            if (s.store.hero.id.startsWith('__unknown_'))
                hero.push(s.store.hero.name);

            return hero;
        }),
        f: [
            totalPoints.value,
            lordsNo.value,
            champsNo.value,
        ],
        o: [
            achievementsCount.value,
            ownedCostumesCount.value
        ]
    }

    return `${config.domainHttp}/profile/share?s=${toBase64(JSON.stringify(serialized))}`;
}

async function copyProfileSheetLink() {
    const link = createProfileSheetLink();

    try {
        await setClipboard(link);

        notify(
            `Link copied to clipboard!`,
            3000,
            { image: 'check', color: '#458a14' }
        );
    }
    catch {
        notify(
            `Failed to copy link`,
            3000,
            { image: 'warning', color: '#c94f36' }
        );
    }
}

function downloadProfileSheet() {
    if (!profileSheetBlob)
        return;

    const who = safeFilename(profile.value.name);
    const possesive = who.endsWith('s') ? '\'' : '\'s';

    downloadFile(profileSheetBlob, `${who}${possesive} Profile [mr-calculator.io].webp`);
}

useEvent('keyup', (e: KeyboardEvent) => {
    if (!profileSheetUrl.value)
        return;

    if (e.key == 'Escape' && !e.shiftKey && !e.ctrlKey && !e.altKey)
        profileSheetUrl.value = null;
});

onUnmounted(clearProfileSheetCache);

</script>