<template>
    <div class="common-page with-padding">
        <h1>
            Import data
        </h1>
        <div
            v-if="dataSegment === null"

            :class="{
                'upload-container': 1,
                active: uploadDragOver
            }"
            @dragenter.prevent="onDragEnter"
            @dragleave.prevent="onDragLeave"
            @dragover.prevent

            @drop.prevent="onDrop"
        >
            <Tex
                image="upload"

                width="80px"
                height="80px"
            />
            <p>Drag and drop your <u>.mrprof</u> file here</p>
            <p class="or">or</p>
            <ul>
                <li @click="fileUploadInput?.click()">
                    Select file
                </li>
                <li @click="paste">
                    Paste from clipboard
                </li>
            </ul>
        </div>

        <div v-if="overwriteCheck" class="overwrite-check">
            <h2>
                You are about to import the following data:
            </h2>
            <template v-if="dataSegment?.type == 'hero'">
                <ul class="import-list">
                    <li v-if="dataSegment.data.stored">Hero Proficiency progress</li>
                    <li v-if="dataSegment.data.__unknownHero">Added hero info</li>
                    <li
                        v-if="
                        dataSegment.data.__unknownHero
                     && (
                            Object.keys(dataSegment.data.hero?.heroImages ?? {}).length
                         || dataSegment.data.hero?.customCostumes?.length
                        )"
                    >
                        Added hero images
                    </li>
                    <li v-if="dataSegment.data.isFavourite">Hero favourite status</li>
                    <li v-if="dataSegment.data.achievements">Hero achievements</li>
                    <li v-if="dataSegment.data.ownedCostumes">Hero owned costumes</li>
                </ul>
            </template>
            <template v-else-if="dataSegment?.type == 'profile'">
                <ul class="import-list">
                    <li v-if="dataSegment.data.storedHeroes">Proficiency progress</li>
                    <li v-if="dataSegment.data.unknownHeroes">Added heroes info</li>
                    <li
                        v-if="
                        dataSegment.data.unknownHeroes
                     && (
                            dataSegment.data.unknownHeroes.some(h => Object.keys(h.heroImages ?? {}).length)
                         || dataSegment.data.unknownHeroes.some(h => h.customCostumes?.length)
                        )"
                    >
                        Added heroes images
                    </li>
                    <li v-if="dataSegment.data.favourites">Favourites</li>
                    <li v-if="dataSegment.data.achievements">Achievements</li>
                    <li v-if="dataSegment.data.collections">Collections</li>
                    <li v-if="dataSegment.data.ownedCostumes">Owned costumes</li>
                    <li v-if="dataSegment.data.ownedNameplates">Owned nameplates</li>
                    <li v-if="dataSegment.data.ownedFrames">Owned frames</li>
                    <li v-if="dataSegment.data.preferences">Preferences</li>
                    <li v-if="dataSegment.data.profile">Profile (name, nameplate, frame, etc.)</li>
                </ul>
            </template>
            <p><i>Note: Importing this data will <b>REPLACE</b> your current data!</i></p>

            <template v-if="overwriteCheck.remaining.length">
                <h2>
                    You will import the data of the following heroes
                </h2>
                <ul class="heroes">
                    <li
                        v-for="hero in overwriteCheck.remaining"
                        :class="{
                            checked: overwriteToggles[hero.heroId]
                               || overwriteUnknownHeroToggles[hero.heroId]
                               || overwriteUnknownHeroImagesToggles[hero.heroId],
                            selected: selectedRemainingHero == hero.heroId
                        }"

                        @click="clickHero(hero, true)"

                        v-tooltip="({
                            text: hero.hero.name + (hero.type == 'unknown' || hero.type == 'both' ? ' (Custom Added)' : ''),
                            icon: hero.type == 'unknown' || hero.type == 'both'
                                ? {
                                    image: 'unknownHero',
                                    width: '20px',
                                    height: '15px'
                                }
                                : undefined
                        } satisfies TooltipBinding)"
                    >
                        <!--
                            :class="{selected: selectedHero == hero.heroId}"
                            @click="clickHero(hero.heroId)"
                        -->
                        <div
                            v-if="overwriteToggles[hero.heroId]
                               || overwriteUnknownHeroToggles[hero.heroId]
                               || overwriteUnknownHeroImagesToggles[hero.heroId]
                            "
                            class="check"
                        >
                            <Tex
                                image="checkCorner"

                                width="35px"
                                height="35px"
                            />
                        </div>
                        <div class="icon">
                            <img
                                :src="hero.type == 'unknown' || hero.type == 'both'
                                    ? (imageURLsToBeImported[hero.heroId] ?? `${hero.hero.dataDir}head.webp`)
                                    : `${hero.hero.dataDir}head.webp`
                                "
                                :alt="`${hero.hero.name}`"
                                draggable="false"
                            />
                        </div>
                        <div
                            v-if="hero.rank?.icon && hero.rank.id != 'agent'"
                            class="badge"
                        >
                            <img :src="hero.rank?.icon" :alt="`${hero.rank.name} Icon`" draggable="false" />
                        </div>
                    </li>
                </ul>

                <div v-if="selectedRemainingHero && selectedRemainingHeroData" class="selected-hero">
                    <div class="hero-info">
                        <FormCheckbox
                            v-if="selectedRemainingHeroData.type == 'both'"
                            :model-value="
                                overwriteToggles[selectedRemainingHeroData.heroId]!
                             || overwriteUnknownHeroToggles[selectedRemainingHeroData.heroId]!
                            "
                            @update:model-value="$event => {
                                overwriteToggles[selectedRemainingHeroData!.heroId] = $event;
                                overwriteUnknownHeroToggles[selectedRemainingHeroData!.heroId] = $event;
                                overwriteUnknownHeroImagesToggles[selectedRemainingHeroData!.heroId] = $event;
                            }"

                            size="small"
                        />
                        <div class="icon">
                            <img
                                :src="selectedRemainingHeroData.type == 'unknown' || selectedRemainingHeroData.type == 'both'
                                    ? (
                                        imageURLsToBeImported[selectedRemainingHeroData.heroId]
                                     ?? `${selectedRemainingHeroData.hero.dataDir}head.webp`
                                    )
                                    : `${selectedRemainingHeroData.hero.dataDir}head.webp`
                                "
                                :alt="`${selectedRemainingHeroData.hero.name}`"
                                draggable="false"
                            />
                        </div>
                        <h3>
                            {{ selectedRemainingHeroData.hero.name }}
                        </h3>
                    </div>

                    <div class="toggle">
                        <FormCheckbox
                            v-if="selectedRemainingHeroData.type == 'both' || selectedRemainingHeroData.type == 'stats'"
                            v-model="overwriteToggles[selectedRemainingHeroData.heroId]!"  

                            size="small"
                            append-slot
                        >
                            <h4>Import stats</h4>
                        </FormCheckbox>
                        <FormCheckbox
                            v-if="selectedRemainingHeroData.type == 'both' || selectedRemainingHeroData.type == 'unknown'"
                            v-model="overwriteUnknownHeroToggles[selectedRemainingHeroData.heroId]!"  

                            size="small"
                            append-slot
                        >
                            <h4>Import hero info</h4>
                        </FormCheckbox>
                        <FormCheckbox
                            v-if="selectedRemainingHeroData.type == 'both' || selectedRemainingHeroData.type == 'unknown'"
                            v-model="overwriteUnknownHeroImagesToggles[selectedRemainingHeroData.heroId]!"

                            size="small"
                            append-slot
                        >
                            <h4>Import hero images</h4>
                        </FormCheckbox>

                        <Tex
                            image="cross"
                            color="var(--light-blue)"
                            hover="color"
                            hover-color="var(--blue-highlight)"

                            clickable
                            @click="selectedRemainingHero = null"

                            width="20px"
                            height="20px"
                            title="Close"
                        />
                    </div>
                </div>
            </template>

            <template v-if="heroesWithData.length && overwriteCheck.conflicting.length">
                <div>
                    <h2>
                        We found conflicts with your current data
                    </h2>
                    <p>The following heroes already have data attached to them. Choose which ones to <b>overwrite</b>.</p>
                </div>
                <ul class="heroes">
                    <li
                        v-for="hero in overwriteCheck.conflicting"
                        :class="{
                            checked: overwriteToggles[hero.heroId]
                               || overwriteUnknownHeroToggles[hero.heroId]
                               || overwriteUnknownHeroImagesToggles[hero.heroId],
                            selected: selectedHero == hero.heroId
                        }"

                        @click="clickHero(hero)"
                        
                        v-tooltip="({
                            text: hero.hero.name + (hero.type == 'unknown' || hero.type == 'both' ? ' (Custom Added)' : ''),
                            icon: hero.type == 'unknown' || hero.type == 'both'
                                ? {
                                    image: 'unknownHero',
                                    width: '20px',
                                    height: '15px'
                                }
                                : undefined
                        } satisfies TooltipBinding)"
                    >
                        <!--
                            :class="{selected: selectedHero == hero.heroId}"
                            @click="clickHero(hero.heroId)"
                        -->
                        <div
                            v-if="overwriteToggles[hero.heroId]
                               || overwriteUnknownHeroToggles[hero.heroId]
                               || overwriteUnknownHeroImagesToggles[hero.heroId]
                            "
                            class="check"
                        >
                            <Tex
                                image="checkCorner"

                                width="35px"
                                height="35px"
                            />
                        </div>
                        <div class="icon">
                            <img
                                :src="hero.type == 'unknown' || hero.type == 'both'
                                    ? (imageURLsToBeImported[hero.heroId] ?? `${hero.hero.dataDir}head.webp`)
                                    : `${hero.hero.dataDir}head.webp`
                                "
                                :alt="hero.hero.name" draggable="false"
                            />
                        </div>
                        <div
                            v-if="hero.rank?.icon && hero.rank.id != 'agent'"
                            class="badge"
                        >
                            <img :src="hero.rank?.icon" :alt="`${hero.rank.name} Icon`" draggable="false" />
                        </div>
                    </li>
                </ul>
            </template>

            <div v-if="selectedHero && selectedHeroData" class="selected-hero">
                <div class="hero-info">
                    <FormCheckbox
                        v-if="selectedHeroData.type == 'both'"
                        :model-value="
                            overwriteToggles[selectedHeroData.heroId]!
                         || overwriteUnknownHeroToggles[selectedHeroData.heroId]!
                         || overwriteUnknownHeroImagesToggles[selectedHeroData.heroId]!
                        "
                        @update:model-value="$event => {
                            overwriteToggles[selectedHeroData!.heroId] = $event;
                            overwriteUnknownHeroToggles[selectedHeroData!.heroId] = $event;
                            overwriteUnknownHeroImagesToggles[selectedHeroData!.heroId] = $event;
                        }"

                        size="small"
                    />
                    <div class="icon">
                        <img
                            :src="selectedHeroData.type == 'unknown' || selectedHeroData.type == 'both'
                                ? (
                                    imageURLsToBeImported[selectedHeroData.heroId]
                                    ?? `${selectedHeroData.hero.dataDir}head.webp`
                                )
                                : `${selectedHeroData.hero.dataDir}head.webp`
                            "
                            :alt="selectedHeroData.hero.name"
                            draggable="false"
                        />
                    </div>
                    <h3>
                        {{ selectedHeroData.hero.name }}
                    </h3>
                </div>

                <div class="toggle">
                    <FormCheckbox
                        v-if="selectedHeroData.type == 'both' || selectedHeroData.type == 'stats'"
                        v-model="overwriteToggles[selectedHeroData.heroId]!"  

                        size="small"
                        append-slot
                    >
                        <h4>Overwrite stats</h4>
                    </FormCheckbox>
                    <FormCheckbox
                        v-if="selectedHeroData.type == 'both' || selectedHeroData.type == 'unknown'"
                        v-model="overwriteUnknownHeroToggles[selectedHeroData.heroId]!"  

                        size="small"
                        append-slot
                    >
                        <h4>Overwrite hero info</h4>
                    </FormCheckbox>
                    <FormCheckbox
                        v-if="selectedHeroData.type == 'both' || selectedHeroData.type == 'unknown'"
                        v-model="overwriteUnknownHeroImagesToggles[selectedHeroData.heroId]!"  

                        size="small"
                        append-slot
                    >
                        <h4>Overwrite hero images</h4>
                    </FormCheckbox>
                    <Tex
                        image="cross"
                        color="var(--light-blue)"
                        hover="color"
                        hover-color="var(--blue-highlight)"

                        clickable
                        @click="selectedHero = null"

                        width="20px"
                        height="20px"

                        title="Close"
                    />
                </div>
            </div>

            <p>
                I acknowledge that by importing the data, my current data, stats of / data of (for manually added) heroes that are checked above, preferences and favourites, will be overwritten or modified.
            </p>
        </div>

        <div class="buttons">
            <FormButton
                v-if="dataSegment"
                size="small"

                @click="importData"
            >
                IMPORT DATA
            </FormButton>
            <FormButton
                v-if="dataSegment"
                size="small"

                @click="clearData()"
            >
                CLEAR
            </FormButton>
        </div>

        <p>
            <i>
                You can also import data from the <a href="https://oceanhillman.github.io/download" target="blank" rel="noopener">oceanhillman fork</a> (the one with the costumes).
                <br/>
                Your owned costumes will be automatically converted so you don't lose anything!
            </i>
        </p>

        <p>
            You can download your data from other devices
            <NuxtLink to="/download">here</NuxtLink>.
        </p>

        <input
            ref="fileUploadInput"
            id="file-upload"
            type="file"

            accept=".mrprof"

            @change="importFiles(fileUploadInput?.files)"
        >
    </div>
</template>

<style lang="sass" scoped>
.upload-container
    width: 700px
    padding: 40px 60px

    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    gap: 10px

    background: color-mix(in srgb, $light-blue 20%, transparent)
    border: 3px dashed $light-blue-highlight

    +media-mobile
        width: 100%
        padding: 20px 10px

    &.active
        background: color-mix(in srgb, $light-blue 40%, transparent)
        border: 3px dashed $light-blue

    p:not(.or)
        font-size: 18px
        text-align: center
        color: $light-blue

        +media-mobile
            font-size: 16px

    p.or
        color: $light-blue-highlight

        +media-mobile
            font-size: 16px

    > ul
        display: flex
        gap: 20px

        li
            font-size: 18px
            color: $blue-accent

            cursor: pointer
            user-select: none

            padding: 5px 10px
            border: 3px solid $light-blue-highlight
            background: color-mix(in srgb, $light-blue 40%, white)

            +media-mobile
                font-size: 16px

            +hover
                color: $light-blue
                background: color-mix(in srgb, $light-blue-highlight 20%, white)

.overwrite-check
    $width: 900px
    width: $width
    
    display: flex
    align-items: center
    flex-direction: column
    gap: 20px

    +media-mobile
        width: 100%

    h2
        text-align: center

    .icon
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

    .import-list
        list-style: disc

    .heroes
        width: 100%

        display: flex
        flex-wrap: wrap
        justify-content: start
        align-items: center
        gap: 10px

        margin-top: 10px

        +media-mobile
            justify-content: center

        li
            position: relative
            cursor: pointer

            +hover('&.selected')
                .icon
                    border: 3px solid $color !important

            &:not(.checked)
                .icon
                    border: 3px solid $light-blue-highlight
                    background: color-mix(in srgb, $light-blue-highlight 40%, white)

                    img
                        filter: grayscale(0.5)

            .check
                position: absolute
                top: 0
                right: 0

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

    > p
        max-width: 600px
        font-size: 14px
        text-align: center
        color: $light-blue

        width: 100%

    .selected-hero
        width: 100%
        display: flex
        justify-content: space-between
        align-items: center

        padding: 10px 20px

        border: 3px solid $light-blue
        background: color-mix(in srgb, $light-blue-highlight 60%, white)

        color: $blue
        user-select: none

        +media-mobile
            flex-direction: column
            gap: 25px

        // +hover
        //     color: $light-blue
        //     border: 3px solid $light-blue-highlight
        //     background: color-mix(in srgb, $light-blue-highlight 40%, white)

        .hero-info
            display: flex
            align-items: center
            gap: 10px

            .icon
                width: 60px
                height: 60px
            h3
                font-size: 26px
                text-transform: uppercase

        .toggle
            display: flex
            flex-wrap: wrap
            justify-content: center
            align-items: center
            gap: 10px

            h4
                font-size: 18px
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
p
    color: $light-blue
    text-align: center

    a
        text-decoration: underline

        +hover
            color: $blue

#file-upload
    display: none
</style>

<script setup lang="ts">
import type { Achievement } from '~/assets/data/achievements/achievements';
import {
    AnySegmentSchema,
    DEFAULT_HERO_STORE,
    DEFAULT_PREFERENCES_STORE,
    DEFAULT_PROFILE_STORE,
    fixUnknownHeroesImagePaths,
    levelToRank,
    PreferencesStoreSchema,
    ProfileStoreSchema,
    type AnySerializableDataSegment,
    type HeroData,
    type PlayerHeroStore,
    type PreferencesStore,
    type ProficiencyRank,
} from '~/assets/data/common';
import { convertCostumeId, CostumeCollectionStoreSchema } from '~/assets/data/cosmetics/costumes/costumes';
import { DEFAULT_NAMEPLATE_ID } from '~/assets/data/cosmetics/nameplates/nameplates';
import { HERO_LIST } from '~/assets/data/heroes';
import type { TooltipBinding } from '~/directives/tooltip';
import { saveCostumeImage } from '~/services/costume-image-operations';
import { HERO_IMAGES, saveHeroImage } from '~/services/hero-image-operations';

useSeoMeta({
    title: 'Import | MR Proficiency Calculator',
    description: 'Import data into the calculator from any other device',
    
    ogTitle: 'Import | MR Proficiency Calculator',
    ogUrl: useCanonicalUrl('import'),
    
    twitterTitle: 'Import | MR Proficiency Calculator',
    twitterDescription: 'Import data into the calculator from any other device',
})

useHead({
    link: [
        {
            rel: "canonical",
            href: useCanonicalUrl('import')
        }
    ]
})

const { notify } = useNotificationManager();

const storedHeroes = Object.entries(localStorage ?? {})
                           .filter(([key]) => key.startsWith('hero_'))
                           .map(([key, v]) => {
                                return {
                                    id: key.substring(5),
                                    ...JSON.parse(v)
                                }
                           }) as ({id: string} & PlayerHeroStore)[];
const favourites = useLocalStorage<HeroData['id'][]>(`favourite_heroes`, []);
const unknownHeroes = useLocalStorage<HeroData[]>('unknown_heroes', []);
const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);
const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);
const achievementsStore = useLocalStorage<Achievement[]>('achievements', []);
const ownedNameplates = useLocalStorage<string[]>('nameplates_owned', [DEFAULT_NAMEPLATE_ID]);
const ownedFrames = useLocalStorage<string[]>('frames_owned', []);

const costumeCollections = useLocalStorage('costume_collections', [], CostumeCollectionStoreSchema);

const heroesWithData = computed(() => {
    return storedHeroes.map(heroStore => {
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

        return {
            hero: heroData,
            stored: store,
            rank: levelToRank(heroStore.level),
            isFavourite: favourites.value.includes(heroStore.id),
            isUnknownHero
        }
    }).filter(h => h !== null);
});

const selectedHero = ref<string|null>(null);
const selectedHeroData = computed(() => 
    overwriteCheck.value?.conflicting.find(h => h.heroId == selectedHero.value)
)

const selectedRemainingHero = ref<string|null>(null);
const selectedRemainingHeroData = computed(() => 
    overwriteCheck.value?.remaining.find(h => h.heroId == selectedRemainingHero.value)
)

function clickHero(hero: OverwriteCheck[0], remaining = false) {
    if (hero.type == 'stats') {
        overwriteToggles.value[hero.heroId] = !overwriteToggles.value[hero.heroId];
        
        if (!remaining)
            selectedHero.value = null;
        else
            selectedRemainingHero.value = null;

        return;
    }

    if (!remaining) {
        if (selectedHero.value == hero.heroId)
            selectedHero.value = null;
        else
            selectedHero.value = hero.heroId;
    }
    else {
        if (selectedRemainingHero.value == hero.heroId)
            selectedRemainingHero.value = null;
        else
            selectedRemainingHero.value = hero.heroId;
    }
}

const dataSegment = ref<AnySerializableDataSegment|null>(null);
const imageURLsToBeImported = ref<Record<string, string>>({});

const overwriteToggles = ref<Record<string, boolean>>({});
const overwriteUnknownHeroToggles = ref<Record<string, boolean>>({});
const overwriteUnknownHeroImagesToggles = ref<Record<string, boolean>>({});

type OverwriteCheck = {
    type: 'stats'|'unknown'|'both',
    heroId: string,
    hero: HeroData,
    store?: PlayerHeroStore,
    rank?: ProficiencyRank
}[]
const overwriteCheck = computed<{ conflicting: OverwriteCheck, remaining: OverwriteCheck}|null>(() => {
    overwriteToggles.value = {};
    overwriteUnknownHeroToggles.value = {};

    if (!dataSegment.value)
        return null;

    if (dataSegment.value.type === 'hero') {
        const heroSegmentData = dataSegment.value.data;

        overwriteToggles.value[heroSegmentData.id] = true;
        if (heroSegmentData.__unknownHero) {
            overwriteUnknownHeroToggles.value[heroSegmentData.id] = true;
            overwriteUnknownHeroImagesToggles.value[heroSegmentData.id] = true;
        }

        const existingHero = heroesWithData.value.find(h => h.hero.id == heroSegmentData.id);
        if (existingHero) {
            return {
                conflicting: [{
                    type: heroSegmentData.__unknownHero ? 'both' : 'stats',
                    heroId: heroSegmentData.id,
                    hero: existingHero.hero,
                    store: heroSegmentData.stored
                }],
                remaining: []
            };
        }

        let heroData = null;
        if (heroSegmentData.__unknownHero && heroSegmentData.hero)
            heroData = heroSegmentData.hero;
        else
            heroData = HERO_LIST.find(h => h.id == heroSegmentData.id);

        const remaining: OverwriteCheck = [];
        if (heroData)
            remaining.push({
                type: heroSegmentData.__unknownHero ? 'both' : 'stats',
                heroId: heroData.id,
                hero: heroData,
                store: heroSegmentData.stored
            });

        return { conflicting: [], remaining }
    }
    else {
        const profileSegmentData = dataSegment.value.data;

        const conflicting: OverwriteCheck = [];

        for (const hero of heroesWithData.value) {
            const heroInSegmentStore = profileSegmentData.storedHeroes.find(h => h.id == hero.hero.id);
            const heroInSegmentUnknownHeroes = profileSegmentData.unknownHeroes?.find(h => h.id == hero.hero.id);

            if (!!heroInSegmentStore || !!heroInSegmentUnknownHeroes) {
                overwriteToggles.value[hero.hero.id] = true;

                if (heroInSegmentUnknownHeroes) {
                    overwriteUnknownHeroToggles.value[hero.hero.id] = true;
                    overwriteUnknownHeroImagesToggles.value[hero.hero.id] = true;
                }

                conflicting.push({
                    type: heroInSegmentStore && heroInSegmentUnknownHeroes ? 'both' : (heroInSegmentStore ? 'stats' : 'unknown'),
                    heroId: hero.hero.id,
                    hero: hero.hero,
                    store: heroInSegmentStore,
                    rank: heroInSegmentStore ? levelToRank(heroInSegmentStore.level) : undefined,
                });
            }
        }

        const remaining: OverwriteCheck = [];

        profileSegmentData.storedHeroes.forEach(heroStore => {
            if (conflicting.find(conflictingHero => conflictingHero.heroId == heroStore.id))
                return;

            // look for hero in existing heroes and unknown heroes
            let hero = HERO_LIST.find(h => h.id == heroStore.id);
            if (!hero)
                hero = profileSegmentData.unknownHeroes?.find(h => h.id == heroStore.id);

            if (hero) {
                remaining.push({
                    type: 'stats',
                    heroId: hero.id,
                    hero,
                    store: heroStore,
                    rank: levelToRank(heroStore.level)
                });

                overwriteToggles.value[hero.id] = true;
            }
        });

        profileSegmentData.unknownHeroes?.forEach(hero => {
            if (conflicting.find(conflictingHero => conflictingHero.heroId == hero.id))
                return;

            // if it exists, change type to both
            const index = remaining.findIndex(h => h.heroId == hero.id);
            if (index != -1)
                remaining[index]!.type = 'both'
            // otherwise add unknown hero as standalone
            else
                remaining.push({
                    type: 'unknown',
                    heroId: hero.id,
                    hero
                });

            overwriteUnknownHeroToggles.value[hero.id] = true;
            overwriteUnknownHeroImagesToggles.value[hero.id] = true;
        });

        return { conflicting, remaining };
    }
});

let dragCounter = 0;
const uploadDragOver = ref(false);

function onDragEnter(e: DragEvent) {
    dragCounter++;
    uploadDragOver.value = true;
}

function onDragLeave(e: DragEvent) {
    dragCounter--;
    if (dragCounter === 0)
        uploadDragOver.value = false;
}

function onDrop(e: DragEvent) {
    dragCounter = 0;
    uploadDragOver.value = false;
    if (e.dataTransfer?.files)
        importFiles(e.dataTransfer.files);
}

const fileUploadInput: Ref<HTMLInputElement|null> = ref(null);

function convertDataSegmentToVersion(version: number, dataSegment: AnySerializableDataSegment) {
    switch (version) {
        // removed previous conversions as v2's reset is no longer necessary
        // conversion of heroes_* local storage entries is not that necessary
        // and too complex to implement
        case 3:
            if (dataSegment.type == 'profile') {
                if (dataSegment.data.preferences)
                    if (!dataSegment.data.preferences?.heroList) {
                        dataSegment.data.preferences.heroList = DEFAULT_PREFERENCES_STORE().heroList;
                    }
            }
    }

    return dataSegment;
}

function convertOHMCostumeIdsToMRCostumeIds(dataSegment: AnySerializableDataSegment) {
    // convert costume ids from oceanhillman's ids to mr ids
    if (
        dataSegment.type === 'profile'
        && dataSegment.data.ownedCostumes
        // check to see if any costumes have text names instead of numeric ids
        && Object.values(dataSegment.data.ownedCostumes).some(costumes => costumes.some(cId => /([^0-9])/g.test(cId)))
    ) {
        const newMap: Record<string, string[]> = {};
        Object.entries(dataSegment.data.ownedCostumes).forEach(([heroId, costumeIds]) => {
            if (!newMap[heroId])
                newMap[heroId] = [];

            newMap[heroId].push(
                ...costumeIds.map(cId => {
                    if (!(/([^0-9])/g.test(cId)))
                        return cId;

                    return convertCostumeId(cId);
                })
                .filter(Boolean) as string[]
            );
        });

        dataSegment.data.ownedCostumes = newMap;
    }

    if (
        dataSegment.type === 'hero'
     && dataSegment.data.ownedCostumes
     // check to see if any costumes have text names instead of numeric ids
     && dataSegment.data.ownedCostumes.some(cId => /([^0-9])/g.test(cId))
    ) {
        dataSegment.data.ownedCostumes = dataSegment.data.ownedCostumes.map(cId => {
            if (!(/([^0-9])/g.test(cId)))
                return null;

            return convertCostumeId(cId);
        })
        .filter(Boolean) as string[];
    }

    return dataSegment;
}

function convertDataSegment(data: AnySerializableDataSegment) {
    if (data.version > config.dataVersion)
        return null;

    if (data.version == config.dataVersion)
        return data;

    // i starts at +1 since we dont want to convert current version to itself
    for (let i = data.version + 1; i <= config.dataVersion; i++)
        data = convertDataSegmentToVersion(i, data);

    return data;
}

function processContent(content: string) {
    let data = JSON.parse(content)
    let result = AnySegmentSchema.safeParse(data);

    // validation failed, try to convert versions
    if (!result.success) {
        try {
            data = convertDataSegment(data);
        }
        catch {
            data  = null;
        }

        // conversion failed
        if (data === null) {
            notify(
                `Failed to parse imported file, version mismatch could not be resolved. Try hard refreshing (Shift + R) the website or try again later.`,
                5000,
                { image: 'warning', color: '#c94f36' }
            );

            return;
        }

        // conversion didn't fail, validate again
        result = AnySegmentSchema.safeParse(data);

        // validation was still unsuccessful, throw
        if (!result.success)
            throw new Error('Failed to parse imported file', { cause: result.error });
    }

    // validation was finally successful, set the dataSegment in place
    // convert costume ids in case needed
    dataSegment.value = convertOHMCostumeIdsToMRCostumeIds(result.data);

    // create blobs for hero images we're going to use to display (only head)
    if (dataSegment.value.type == 'hero') {
        if (!dataSegment.value.data.__unknownHero || !dataSegment.value.data.hero?.heroImages)
            return;

        const headData = dataSegment.value.data.hero.heroImages['head'];
        if (!headData)
            return;

        const blob = dataUrlToBlob(headData);
        imageURLsToBeImported.value[dataSegment.value.data.hero.id] = URL.createObjectURL(blob);
    }
    else if (dataSegment.value.type == 'profile') {
        if (!dataSegment.value.data.unknownHeroes)
            return dataSegment.value;

        Object.values(dataSegment.value.data.unknownHeroes).forEach(hero => {
            if (!hero.heroImages)
                return;

            const headData = hero.heroImages['head'];
            if (!headData)
                return;

            const blob = dataUrlToBlob(headData);
            imageURLsToBeImported.value[hero.id] = URL.createObjectURL(blob);
        });
    }
}

function importFiles(files?: FileList|null) {
    if (!files)
        return;

    for (const file of files) {
        if (!file.name.endsWith('.mrprof')) {
            notify(
                `${file.name} could not be imported as it is the wrong type of file`,
                3000,
                { image: 'warning', color: '#c94f36' }
            );
            continue;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (typeof e.target?.result !== 'string')
                    throw new Error(`${file.name} could not be imported as it is the wrong type of file`)

                processContent(e.target!.result as string);
            }
            catch (e) {
                notify(
                    `The file \"${file.name}\" is invalid`,
                    3000,
                    { image: 'warning', color: '#c94f36' }
                );

                console.error('Error thrown while parsing/validating imported data file', e);
            }
        }

        reader.readAsText(file)
    }
}

function paste() {
    navigator.clipboard.readText()
        .then(text => processContent(text))
        .catch(err => {
            notify(
                `We were unable to read your clipboard`,
                3000,
                { image: 'warning', color: '#c94f36' }
            );

            console.error(err);
        })
}

// PWA file handler
onMounted(async () => {
    if (!('launchQueue' in window))
        return;

    (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        const files = launchParams.files as FileSystemFileHandle[]

        if (!files?.length)
            return
        
        const file = await files[0]!.getFile()
        const text = await file.text()
        
        try {
            processContent(text);
        }
        catch (e) {
            notify(
                `The file \"${file.name}\" is invalid`,
                3000,
                { image: 'warning', color: '#c94f36' }
            );

            console.error('Error thrown while parsing/validating imported data file', e);
        }
    });
})

async function importData() {
    // revoke & delete temporary head images
    Object.entries(imageURLsToBeImported.value).forEach(([heroId, blobURL]) => {
        delete imageURLsToBeImported.value[heroId];
        URL.revokeObjectURL(blobURL);
    });

    if (!dataSegment.value)
        return;

    if (dataSegment.value.type == 'hero') {
        const id = dataSegment.value.data.id;

        if (
            dataSegment.value.data.__unknownHero
         && dataSegment.value.data.hero
        ) {
            const hero = dataSegment.value.data.hero;

            if (overwriteUnknownHeroImagesToggles.value[id]) {
                // import images to idb
                await Promise.all(objectEntries(hero.heroImages ?? {}).map(async ([key, data]) => {
                    if (!data)
                        return;

                    const blob = dataUrlToBlob(data);

                    await saveHeroImage(hero.id, key, blob).catch(() => {
                        notify(
                            `An unexpected error occured. We couldn't save the "${HERO_IMAGES[key]!.name}" image.`,
                            5000,
                            { image: 'warning', color: '#c94f36' }
                        );
                    })
                }));

                await Promise.all(hero.customCostumes?.map(async c => {
                    if (!c.customImage)
                        return;

                    const blob = dataUrlToBlob(c.customImage);

                    await saveCostumeImage(c.id, blob).catch(() => {
                        notify(
                            `An unexpected error occured. We couldn't save "${c.name}"'s image.`,
                            5000,
                            { image: 'warning', color: '#c94f36' }
                        );
                    })
                }) ?? []);
            }

            // delete images from hero to prevent them from getting stored in local storage (since 5mb limit)
            delete hero.heroImages;
            hero.customCostumes?.forEach(c => delete c.customImage);

            
            if (overwriteUnknownHeroToggles.value[id]) {
                // add unknown hero to store
                const existingIndex = unknownHeroes.value.findIndex(h => h.id == id);
                if (existingIndex != -1)
                    unknownHeroes.value[existingIndex] = hero;
                else
                    unknownHeroes.value.push(hero);
            }
        }

        if (overwriteToggles.value[id])
            localStorage.setItem(`hero_${id}`, JSON.stringify(dataSegment.value.data.stored));

        if (
            typeof dataSegment.value.data.isFavourite !== 'undefined'
         && !favourites.value.includes(id)
        )
            favourites.value.push(id);

        if (dataSegment.value.data.achievements) {
            dataSegment.value.data.achievements.forEach(a => {
                const existing = achievementsStore.value.find(existing => existing.id == a.id);
                if (existing)
                    existing.current = a.current;
                else
                    achievementsStore.value.push(a);
            });
        }

        if (dataSegment.value.data.ownedCostumes)
            localStorage.setItem(`cosmetics_owned_${id}`, JSON.stringify(dataSegment.value.data.ownedCostumes));
    }
    else if (dataSegment.value.type == 'profile') {
        if (dataSegment.value.data.unknownHeroes) {
            for (const unknownHero of dataSegment.value.data.unknownHeroes) {
                if (overwriteUnknownHeroImagesToggles.value[unknownHero.id]) {
                    // import images to idb
                    await Promise.all(objectEntries(unknownHero.heroImages ?? {}).map(async ([key, data]) => {
                        if (!data)
                            return;

                        const blob = dataUrlToBlob(data);

                        await saveHeroImage(unknownHero.id, key, blob).catch(() => {
                            notify(
                                `An unexpected error occured. We couldn't save the "${HERO_IMAGES[key]!.name}" image.`,
                                5000,
                                { image: 'warning', color: '#c94f36' }
                            );
                        })
                    }));

                    
                    await Promise.all(unknownHero.customCostumes?.map(async c => {
                        if (!c.customImage)
                            return;

                        const blob = dataUrlToBlob(c.customImage);

                        await saveCostumeImage(c.id, blob).catch(() => {
                            notify(
                                `An unexpected error occured. We couldn't save "${c.name}"'s image.`,
                                5000,
                                { image: 'warning', color: '#c94f36' }
                            );
                        })
                    }) ?? []);
                }

                // delete images from hero to prevent them from getting stored in local storage (since 5mb limit)
                delete unknownHero.heroImages;
                unknownHero.customCostumes?.forEach(c => delete c.customImage);

                if (!overwriteUnknownHeroToggles.value[unknownHero.id])
                    continue;

                // add unknown hero to store
                const existingIndex = unknownHeroes.value.findIndex(h => h.id == unknownHero.id);
                if (existingIndex != -1)
                    unknownHeroes.value[existingIndex] = unknownHero;
                else
                    unknownHeroes.value.push(unknownHero);
            }
        }

        for (const hero of dataSegment.value.data.storedHeroes) {
            const { id, ...stored } = hero;

            if (overwriteToggles.value[id])
                localStorage.setItem(`hero_${hero.id}`, JSON.stringify(stored));
        }

        if (dataSegment.value.data.favourites)
            favourites.value = dataSegment.value.data.favourites;

        if (dataSegment.value.data.preferences)
            preferences.value = dataSegment.value.data.preferences;
        if (dataSegment.value.data.profile)
            profile.value = dataSegment.value.data.profile;

        if (dataSegment.value.data.achievements) {
            dataSegment.value.data.achievements.forEach(a => {
                const existing = achievementsStore.value.find(existing => existing.id == a.id);
                if (existing)
                    existing.current = a.current;
                else
                    achievementsStore.value.push(a);
            });
        }

        if (dataSegment.value.data.ownedCostumes !== undefined) {
            Object.keys(localStorage)
                .filter(key => key.startsWith('cosmetics_owned_'))
                .forEach(key => localStorage.removeItem(key));

            for (const [heroId, ownedList] of Object.entries(dataSegment.value.data.ownedCostumes))
                localStorage.setItem(`cosmetics_owned_${heroId}`, JSON.stringify(ownedList));
        }

        if (dataSegment.value.data.ownedNameplates)
            ownedNameplates.value = dataSegment.value.data.ownedNameplates;
        if (dataSegment.value.data.ownedFrames)
            ownedFrames.value = dataSegment.value.data.ownedFrames;

        if (dataSegment.value.data.collections) {
            costumeCollections.value = dataSegment.value.data.collections.costumes;
        }
    }

    nextTick(() => {
        resetLocalStorageCache();
        revokeHeroImageCache();

        nextTick(fixUnknownHeroesImagePaths)
    });

    dataSegment.value = null;

    notify(
        `The data was imported successfully.`,
        3000,
        { image: 'check', color: '#458a14' }
    );
}

function clearData() {
    dataSegment.value = null;

    Object.entries(imageURLsToBeImported.value).forEach(([heroId, blobURL]) => {
        delete imageURLsToBeImported.value[heroId];
        URL.revokeObjectURL(blobURL);
    }); 
}

</script>