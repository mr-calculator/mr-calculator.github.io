<template>
    <div class="common-page with-padding">
        <h1>
            Download your data
        </h1>
        <h2>You have data for the following heroes:</h2>
        <ul class="heroes">
            <li :class="{selected: selectedHero == null}" @click="clickHero(null)">
                <div class="icon">
                    <img :src="tex('allHeroesIcon')" alt="All Heroes" draggable="false" />
                </div>
            </li>
            <li
                v-for="hero in heroesWithData"
                :class="{selected: selectedHero == hero.hero.id}"

                @click="clickHero(hero.hero.id)"

                v-tooltip="({
                    text: hero.hero.name + (hero.isUnknownHero ? ' (Custom Added)' : ''),
                    icon: hero.isUnknownHero
                        ? {
                            image: 'unknownHero',
                            width: '20px',
                            height: '15px'
                        }
                        : undefined
                } satisfies TooltipBinding)"
            >
                <div
                    v-if="hero.isFavourite"
                    class="favourite"
                >
                    <Tex
                        image="favouriteCorner"

                        width="35px"
                        height="35px"
                    />
                </div>
                <div class="icon">
                    <img
                        :src="useHeroImage('head', hero.hero).value"
                        :alt="`${hero.hero.name}`"
                        draggable="false"
                    />
                    <div v-if="hero.isUnknownHero" class="unknown-hero-marker">
                        <Tex
                            image="unknownHero"
                            color="var(--blue)"

                            width="35px"
                            height="26px"
                        />
                    </div>
                </div>
                <div
                    v-if="hero.rank?.icon && hero.rank.id != 'agent'"
                    class="badge"
                >
                    <img :src="hero.rank?.icon" :alt="`${hero.rank?.name} Icon`" draggable="false" />
                </div>
            </li>
        </ul>
        <div
            :class="{expandable: 1, active: dataExpanded}"
            @click="closeDataDisplay"
        >
            <h2>
                {{ !selectedHero ?
                    (dataExpanded ? 'Hide your raw data' : 'View your raw data')
                    :
                    (dataExpanded ? `Hide ${selectedHeroData?.possesiveName} raw data` : `View ${selectedHeroData?.possesiveName} raw data`)
                }}
            </h2>
            <Tex
                :image="dataExpanded ? 'chevronUp' : 'chevronDown'"
                color="var(--blue)"

                width="18px"
                height="18px"
                object-fit="contain"
            />
        </div>
        <div v-if="dataExpanded" class="data-display">
            <Tex
                class="copy"
                image="copy"
                hover="color"
                hover-color="var(--light-blue)"

                width="30px"
                height="30px"

                clickable
                square

                @click="copyData"
            />
            <div class="scroll-container">
                <PanelJSONDisplay
                    class="json-display"
                    :code="displayData"
                />
            </div>
        </div>
        <ul class="options">
            <li v-if="!selectedHero">
                <FormCheckbox
                    v-model="includeUnknownHeroes"

                    size="small"
                >
                    <h4>Include added heroes</h4>
                </FormCheckbox>
            </li>
            <li>
                <FormCheckbox
                    v-model="includeFavourites"

                    size="small"
                >
                    <h4 v-if="!selectedHero">Include favourite heroes</h4>
                    <h4 v-else>Include favourite status</h4>
                </FormCheckbox>
            </li>
            <li>
                <FormCheckbox
                    v-model="includeAchievements"

                    size="small"
                >
                    <h4 v-if="!selectedHero">Include achievements progress</h4>
                    <h4 v-else>Include this hero's achievements progress</h4>
                </FormCheckbox>
            </li>
            <li>
                <FormCheckbox
                    v-model="includeCosmetics"

                    size="small"
                >
                    <h4 v-if="!selectedHero">Include owned cosmetics</h4>
                    <h4 v-else>Include this hero's owned costumes</h4>
                </FormCheckbox>
            </li>
            <template v-if="!selectedHero">
                <li>
                    <FormCheckbox
                        v-model="includeCollections"

                        size="small"
                    >
                        <h4>Include collections</h4>
                    </FormCheckbox>
                </li>
                <li>
                    <FormCheckbox
                        v-model="includePreferences"

                        size="small"
                    >
                        <h4>Include preferences</h4>
                    </FormCheckbox>
                </li>
            </template>
        </ul>
        <div class="buttons">
            <FormButton
                v-if="selectedHero"
                size="small"

                @click="downloadHeroData"
            >
                DOWNLOAD {{ selectedHeroData?.possesiveName }} DATA
            </FormButton>
            <FormButton
                size="small"

                @click="downloadData"
            >
                {{ !!selectedHero ? `DOWNLOAD ALL DATA` : `DOWNLOAD MY DATA` }}

                <Tex
                    image="download"
                    color="var(--text-color)"

                    width="25px"
                    height="25px"
                />
            </FormButton>
        </div>

        <p>
            You can import the data into the calculator on any other device
            <NuxtLink to="/import">here</NuxtLink>.
        </p>

        <br/>
        <p v-if="hasData">
            You can also <u @click="deleteData">delete your data</u>.
        </p>
    </div>
</template>

<style lang="sass" scoped>
.heroes
    $width: 900px
    width: $width

    display: flex
    flex-wrap: wrap
    justify-content: start
    align-items: center
    gap: 10px

    margin-top: 10px

    +media-mobile
        width: 100%

        justify-content: center

    li
        position: relative
        cursor: pointer

        +hover('&.selected')
            .icon
                border: 3px solid $color

        .favourite
            position: absolute
            top: 0
            right: 0

            pointer-events: none

        .icon
            position: relative
            width: calc(($width - 70px) / 8)
            height: calc(($width - 70px) / 8)

            border: 3px solid $light-blue
            background: color-mix(in srgb, $light-blue-highlight 60%, white)

            img
                display: block
                width: 100%
                height: 100%

                object-fit: cover

                user-select: none

            .unknown-hero-marker
                position: absolute
                bottom: 0
                right: -3px

                z-index: 2
                pointer-events: none

        .badge
            position: absolute
            bottom: 0
            left: 0

            width: 40px
            height: 40px

            transform: translate(-35%, 50%)

            img
                display: block
                width: 100%
                height: 100%

                object-fit: cover

                user-select: none
                pointer-events: none

.expandable
    width: 900px
    display: flex
    justify-content: space-between
    align-items: center

    padding: 10px 20px

    border: 3px solid $light-blue
    background: color-mix(in srgb, $light-blue-highlight 60%, white)

    color: $blue
    cursor: pointer
    user-select: none

    +media-mobile
        width: 100%

    +hover('&.active')
        color: $light-blue
        border: 3px solid $light-blue-highlight
        background: color-mix(in srgb, $light-blue-highlight 40%, white)

        .texture
            --tex-color: #{$light-blue} !important


.data-display
    position: relative
    width: 900px
    max-height: 700px

    +media-mobile
        width: 100%

    .scroll-container
        width: 100%
        max-height: 700px

        overflow: auto

        +scrollbar($background: $blue, $thumb: $light-blue, $active: $color, $thickness: 12px)

        .json-display
            min-width: fit-content
            font-size: 14px

    .copy
        position: absolute
        right: 12px
        top: 12px

        width: 30px
        height: 30px

        +media-desktop
            top: 0

.options
    max-width: 900px
    margin-top: 20px

    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
    gap: 20px

    +media-mobile
        width: 100%
        flex-wrap: wrap
        gap: 15px 20px

    li
        .checkbox
            outline: 3px solid $light-blue-highlight
        h4
            color: $blue

.buttons
    margin-top: 20px

    display: flex
    align-items: center
    gap: 20px

    +media-mobile
        flex-direction: column
        gap: 5px

    .button.small
        width: auto
        min-width: 355px

        +media-mobile
            min-width: 200px

        .texture
            margin-right: 0

p
    color: $light-blue

    text-align: center

    a,
    u
        text-decoration: underline
        cursor: pointer

        +hover
            color: $blue
</style>

<script setup lang="ts">
import { getAchievements, type Achievement } from '~/assets/data/achievements/achievements';
import {
    DEFAULT_HERO_STORE,
    DEFAULT_PREFERENCES_STORE,
    DEFAULT_PROFILE_STORE,
    levelToRank,
    PreferencesStoreSchema,
    ProfileStoreSchema,
    type AnySerializableDataSegment,
    type HeroData,
    type PlayerHeroStore,
    type PreferencesStore,
    type SerializableDataMap,
    type SerializableDataSegment
} from '~/assets/data/common';
import { CostumeCollectionStoreSchema } from '~/assets/data/cosmetics/costumes/costumes';
import { DEFAULT_NAMEPLATE_ID } from '~/assets/data/cosmetics/nameplates/nameplates';
import { HERO_LIST } from '~/assets/data/heroes';
import { tex } from '~/assets/data/textures';
import ConfirmModal from '~/components/modals/ConfirmModal.vue';
import type { TooltipBinding } from '~/directives/tooltip';
import { getAllHeroImages } from '~/services/image-operations';

useSeoMeta({
    title: 'Download | MR Proficiency Calculator',
    description: 'Download (export) your data from the calculator to import on any other device',
    
    ogTitle: 'Download | MR Proficiency Calculator',
    ogUrl: useCanonicalUrl('download'),
    
    twitterTitle: 'Download | MR Proficiency Calculator',
    twitterDescription: 'Download (export) your data from the calculator to import on any other device',
})

useHead({
    link: [
        {
            rel: "canonical",
            href: useCanonicalUrl('download')
        }
    ]
})

const { openModal } = useModalManager();
const { notify } = useNotificationManager();

const storedHeroes = ref(Object.entries(localStorage ?? {})
                               .filter(([key]) => key.startsWith('hero_'))
                               .map(([key, v]) => {
                                    return {
                                        id: key.substring(5),
                                        ...JSON.parse(v)
                                    }
                               }) as ({id: string} & PlayerHeroStore)[]);
const favourites = useLocalStorage<HeroData['id'][]>(`favourite_heroes`, []);
const unknownHeroes = useLocalStorage<HeroData[]>('unknown_heroes', []);
const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);
const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);

const achievementsStore = useLocalStorage<Achievement[]>('achievements', []);
const ownedCostumes: Record<string, string[]> = {};
Object.entries(localStorage ?? {})
      .filter(([key]) => key.startsWith('cosmetics_owned_'))
      .map(([key, v]) => {
          const heroId = key.substring('cosmetics_owned_'.length);
          const owned = JSON.parse(v) as string[];
          if (owned.length)
              ownedCostumes[heroId] = owned;
      });
const ownedNameplates = useLocalStorage<string[]>('nameplates_owned', [DEFAULT_NAMEPLATE_ID]);
const ownedFrames = useLocalStorage<string[]>('frames_owned', []);

const costumeCollections = useLocalStorage('costume_collections', [], CostumeCollectionStoreSchema);

const route = useRoute();
const heroFromUrl = route.query?.hero;

const heroesWithData = computed(() => {
    const stores: ({id: string} & PlayerHeroStore)[] = cloneObjectRefAsRaw(storedHeroes.value)!;
    // add unknown heroes with no store — give them a default store
    unknownHeroes.value.forEach(unkHero => {
        if (!!stores.find(storedH => storedH.id == unkHero.id))
            return;

        stores.push({
            id: unkHero.id,
            ...DEFAULT_HERO_STORE()
        });
    })

    return stores.map(heroStore => {
        const heroes = HERO_LIST;
        let heroData = heroes.find(hd => hd.id == heroStore.id);

        let isUnknownHero = false;
        if (!heroData) {
            heroData = unknownHeroes.value.find(uh => uh.id == heroStore.id);

            if (!heroData)
                return null;

            isUnknownHero = true;
        }

        const { id, ...store } = heroStore;

        const heroAchievements = getAchievements(undefined, heroStore.id);
        const filteredAchievements = achievementsStore.value.filter(as => 
            !!heroAchievements.find(a => a.id == as.id)
        );

        return {
            hero: heroData,
            stored: store,
            rank: levelToRank(heroStore.level),
            achievements: includeAchievements.value ? filteredAchievements : undefined,
            costumes: includeCosmetics.value ? ownedCostumes[heroData.id] : undefined,
            isFavourite: includeFavourites.value ? favourites.value.includes(heroStore.id) : undefined,
            isUnknownHero
        }
    }).filter(h => h !== null);
});

const selectedHero = ref<string|null>(heroFromUrl as string ?? null);
const selectedHeroData = computed(() => {
    const heroData = heroesWithData.value.find(h => h.hero.id == selectedHero.value);
    if (!heroData)
        return null;

    return {
        possesiveName: heroData.hero.name + (heroData.hero.name.endsWith('s') ? '\'' : '\'s'),
        ...heroData
    }
});
function clickHero(heroId: string|null) {
    if (heroId == null) {
        selectedHero.value = null;

        return;
    }

    if (selectedHero.value == heroId)
        selectedHero.value = null;
    else
        selectedHero.value = heroId;
}

const dataExpanded = ref(false);
const displayData = computed(() => {
    const source: AnySerializableDataSegment = !!selectedHero.value
        ? cloneObjectRefAsRaw(heroData.value)!
        : cloneObjectRefAsRaw(allData.value)!;

    if (source.type == 'hero') {
        if (!source.data.__unknownHero || !source.data.hero?.heroImages)
            return source;

        objectEntries(source.data.hero.heroImages).forEach(([key, value]) => {
            if (!value || value.length < 80)
                return;

            source.data.hero!.heroImages![key] = value.slice(0, 40) + '...' + value.slice(value.length - 40, value.length);
        });
    }
    else if (source.type == 'profile') {
        if (!source.data.unknownHeroes)
            return source;

        Object.values(source.data.unknownHeroes).forEach(hero => {
            if (!hero.heroImages)
                return;

            objectEntries(hero.heroImages).forEach(([key, value]) => {
                if (!value || value.length < 80)
                    return;

                hero!.heroImages![key] = value.slice(0, 40) + '...' + value.slice(value.length - 40, value.length);
            });
        })
    }

    return source;
});

const includeUnknownHeroes = ref(true);
const includeFavourites = ref(true);
const includePreferences = ref(true);
const includeAchievements = ref(true);
const includeCosmetics = ref(true);
const includeCollections = ref(true);

async function unknownHeroWithImages(heroData: HeroData): Promise<HeroData> {
    const images = await getAllHeroImages(heroData);

    const promises = Object.entries(images).map(async ([key, blob]) => {
        if (!blob)
            return null;

        const base64 = await blobToDataUrl(blob);

        return [key, base64];
    }).filter(Boolean) as Promise<[string, string]>[];

    return {
        ...heroData,
        heroImages: Object.fromEntries(await Promise.all(promises))
    }
}

// since unknown heroes can't change while this page is mounted, this should be fine without a computed
const unknownHeroesWithImages = await Promise.all(unknownHeroes.value.map(h => unknownHeroWithImages(h)));

const dataBase: Pick<SerializableDataSegment<keyof SerializableDataMap>, 'version' | 'exportedAt'> = {
    version: config.dataVersion,
    exportedAt: new Date().toISOString(),
}
function dataWithBase<T extends keyof SerializableDataMap>
    (type: T, data: SerializableDataMap[T]): SerializableDataSegment<T> {
        return {
            ...dataBase,
            type,
            data
        };
}

const allData = computed<AnySerializableDataSegment>(() => {
    const data: SerializableDataMap['profile'] = {
        storedHeroes: storedHeroes.value,
        favourites: includeFavourites.value ? favourites.value : undefined,
        achievements: includeAchievements.value ? achievementsStore.value : undefined,
        unknownHeroes: includeUnknownHeroes.value ? unknownHeroesWithImages : undefined,
        preferences: includePreferences.value ? preferences.value : undefined,
        profile: includePreferences.value ? profile.value : undefined,
        collections: includeCollections.value ? {
            costumes: costumeCollections.value
        } : undefined,
        ownedCostumes: includeCosmetics.value ? ownedCostumes : undefined,
        ownedNameplates: includeCosmetics.value ? ownedNameplates.value : undefined,
        ownedFrames: includeCosmetics.value ? ownedFrames.value : undefined,
    }

    return dataWithBase('profile', data);
})

const heroData = computed<AnySerializableDataSegment>(() => {
    const heroData = heroesWithData.value.find(h => h.hero.id == selectedHero.value);
    if (!selectedHero.value || !heroData)
        return allData.value;

    if (heroData.isUnknownHero) {
        const unknownHeroDataWithImages = unknownHeroesWithImages.find(h => h.id == heroData.hero.id)!;
        return dataWithBase('hero', {
            __unknownHero: true,
            id: heroData.hero.id,
            hero: unknownHeroDataWithImages,
            stored: heroData.stored,
            achievements: heroData.achievements,
            isFavourite: heroData.isFavourite,
            ownedCostumes: heroData.costumes
        })
    }

    return dataWithBase('hero', {
        id: heroData.hero.id,
        stored: heroData.stored,
        achievements: heroData.achievements,
        isFavourite: heroData.isFavourite,
        ownedCostumes: heroData.costumes
    });
})

function closeDataDisplay() {
    dataExpanded.value = !dataExpanded.value;
}

function copyData() {
    const whichData = !!selectedHero.value ? heroData.value : allData.value;
    setClipboard(JSON.stringify(whichData));

    const message = !!selectedHero.value ? 
        `Copied ${selectedHeroData.value?.possesiveName} data to clipboard`
        :
        `Copied your data to clipboard`

    notify(
        message,
        3000,
        { image: 'check', color: '#458a14' }
    );
}

function downloadFile(content: string, filename: string, mimeType = 'application/octet-stream') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

function downloadHeroData() {
    downloadFile(JSON.stringify(heroData.value), `${selectedHeroData.value?.possesiveName} data [Marvel Rivals Proficiency Calculator].mrprof`);
}
function downloadData() {
    downloadFile(JSON.stringify(allData.value), `Your Data [Marvel Rivals Proficiency Calculator].mrprof`);
}

const hasData = computed(() => !!localStorage.length);
function deleteData() {
    openModal(ConfirmModal, {
        title: 'Delete Your Data',
        message: 'Are you sure you want to delete your data? This action is irreversible.<br/><i>P.S.: The data lives on your device.</i>',
    })
    .promise
    .then(() => {
        localStorage.clear();
        sessionStorage.setItem('dataDeleted', '1');
        window.location.reload();
    })
    .catch(() => null)
}

onMounted(() => {
    if (sessionStorage.getItem('dataDeleted')) {
        sessionStorage.removeItem('dataDeleted');
        notify(`Your data was deleted successfully.`, 3000, { image: 'check', color: '#458a14' });
    }
})

</script>