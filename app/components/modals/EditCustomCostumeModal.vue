<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <UiSeparator class="separator" />
        <br/>

        <div class="configure-costume">
            <div class="setting">
                <label>Name</label>
                <FormAdvancedInput
                    input-placeholder="e.g.: Breezy Helmet"
                    v-model="costumeModel.name"
                />
            </div>

            <div class="setting">
                <label>Rarity</label>
                <FormDropdown
                    :options="RARITIES"
                    v-model="costumeModel.rarity"

                    placeholder="SELECT RARITY"
                />
            </div>

            <br/>
            <div class="setting">
                <FormCheckbox
                    color-scheme="dark"
                    v-model="costumeModel.customizable"
                >
                    Customizable
                </FormCheckbox>
            </div>

            <div class="setting">
                <label>Category</label>
                <FormDropdown
                    :options="CATEGORIES"
                    v-model="costumeModel.category"
                    search
                    mobile-overlay

                    placeholder="SELECT CATEGORY"
                />
            </div>

            <div class="setting">
                <label>Source</label>
                <div class="bi-input">
                    <FormAdvancedInput
                        input-placeholder="e.g.: Summer Special"
                        v-model="costumeModel.source"
                    />
                    <FormDropdown
                        :options="SOURCES"
                        v-model="costumeModel.source"
                        search
                        mobile-overlay

                        placeholder="SELECT SOURCE"
                    />
                </div>
            </div>

            <div class="setting">
                <label>Theme</label>
                <div class="bi-input">
                    <FormAdvancedInput
                        input-placeholder="e.g.: Swimsuit Special"
                        v-model="costumeModel.theme"
                    />
                    <FormDropdown
                        :options="THEMES"
                        v-model="costumeModel.theme"
                        search
                        mobile-overlay

                        placeholder="SELECT THEME"
                    />
                </div>
            </div>

            <br/>
            <div class="setting">
                <label>Costume Image</label>
                <p>A 684x684 (1:1) image.</p>

                <div
                    :class="{
                        'upload-container': 1,
                        active: uploadDragOver,
                        'show-ui': !imageURL
                    }"

                    :style="{
                        '--selected-image': imageURL ? `url(${imageURL})` : undefined
                    }"

                    @dragenter.prevent="onDragEnter"
                    @dragleave.prevent="onDragLeave"
                    @dragover.prevent

                    @drop.prevent="onDrop"
                >
                    <Tex
                        image="upload"

                        width="40px"
                        height="40px"
                    />
                    <p>Drag and drop your costume image here</p>
                    <p class="or">or</p>
                    <ul>
                        <li @click="fileUploadInput?.click()">
                            Select image
                        </li>
                        <li @click="removeImage">
                            Remove image
                        </li>
                    </ul>
                </div>
            </div>

            <br/>
            <FormButton size="small" color-scheme="dark" @click="deleteCostume">
                Delete Costume
            </FormButton>
        </div>

        <div class="buttons">
            <FormButton size="small" @click="confirm">
                Confirm
            </FormButton>
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Cancel</FormButton>
        </div>

        <input
            ref="fileUploadInput"
            type="file"

            accept="image/png,image/webp,image/jpeg,image/jfif"

            @change="addImage(fileUploadInput?.files)"
        >
    </div>
</template>

<style lang="sass" scoped>
.modal
    height: var(--u100vh)

    padding-bottom: 0

    .configure-costume
        display: flex
        align-items: center
        flex-direction: column
        gap: 10px

        padding: 0 20px

        +media-desktop
            width: 650px

        h3
            color: $blue
            font-size: 26px
            font-family: $font-bold
            text-transform: uppercase

            margin-top: 20px

        .input-wrapper
            padding: 0

        .setting
            position: relative
            width: 100%

            &.preview
                border: 3px solid $light-blue-highlight

            label
                color: $blue
                font-size: 22px
                font-family: $font-bold
                text-transform: uppercase

                &.with-image
                    display: flex
                    align-items: center

                    &.small
                        img
                            width: 20px
                            height: 20px
                            margin-right: 5px

                + *:not(p)
                    margin-top: 5px
                + p
                    margin-bottom: 5px

                img
                    width: 30px
                    height: 30px

                    object-fit: contain

            p
                color: $light-blue
                font-size: 16px
                font-family: $font-body

                padding: 0

                &.info
                    margin-top: 5px

                &.clickable
                    u
                        cursor: pointer

                        +hover
                            color: $blue

            ::v-deep(input)
                width: 100% !important

            .checkbox
                width: fit-content

            .bi-input
                width: 100%
                display: grid
                grid-template-columns: 1fr 1fr
                gap: 10px

                +media-mobile
                    display: flex
                    flex-direction: column

            .upload-container
                position: relative
                padding: 40px 60px

                width: 100%
                aspect-ratio: 1 / 1

                display: flex
                flex-direction: column
                justify-content: center
                align-items: center
                gap: 2px

                background-color: color-mix(in srgb, $light-blue 20%, transparent)
                background-image: var(--selected-image)
                background-repeat: no-repeat
                background-size: contain
                background-position: center

                border: 3px dashed $light-blue-highlight

                +media-mobile
                    padding: 20px 10px

                &:not(.show-ui)
                    > *
                        display: none

                    &:hover
                        &::before
                            content: ""
                            position: absolute
                            top: 0
                            left: 0
                            width: 100%
                            height: 100%

                            background: color-mix(in srgb, #fff 80%, transparent)

                            z-index: 1

                        > *
                            z-index: 2

                        .texture
                            display: block
                        p
                            display: block
                        > ul
                            display: flex

                &.active
                    background: color-mix(in srgb, $light-blue 40%, transparent)
                    border: 3px dashed $light-blue

                .texture
                    margin-bottom: 10px

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
                        width: fit-content
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

                input
                    display: none

            .popup
                position: absolute
                top: 20px
                left: 50%

                transform: translate(-50%, -100%)

    .buttons
        position: sticky
        bottom: 0

        padding-bottom: calc(15px + env(safe-area-inset-bottom))
        z-index: 3

    input[type="file"]
        display: none
</style>

<script setup lang="ts">
import { getAllCategories, getAllSources, getAllThemes, getCategoryIcon, type Costume } from '~/assets/data/cosmetics/costumes/costumes';
import type { Option } from '../form/Dropdown.vue';
import { deleteCostumeImage, loadCostumeImage } from '~/services/costume-image-operations';
import ConfirmModal from './ConfirmModal.vue';
import { DEFAULT_PROFILE_STORE, ProfileStoreSchema, type HeroData } from '~/assets/data/common';

const { notify } = useNotificationManager();
const { openModal } = useModalManager();

const props = defineProps<{
    title?: string,
    heroId: string,
    costume?: Costume
}>();

const emit = defineEmits<{
    confirm: [ res: { costume: Costume, image: Blob|null } ],
    cancel: []
}>();

const costumeModel = ref<Costume>(props.costume ?? {
    heroId: props.heroId,
    id: crypto.randomUUID(),
    name: '',
    rarity: 'common',
    customizable: false,
    category: 'Premium Event Reward',
    source: '',
    theme: '',
    custom: true,
    releaseDate: new Date().toISOString().slice(0, 10)
});


const RARITIES: Option[] = [
    {
        leftIcon: {
            key: 'rarityLegendary',
            size: 20
        },

        label: `LEGENDARY`,
        value: 'legendary',
    },
    {
        leftIcon: {
            key: 'rarityEpic',
            size: 20
        },

        label: `EPIC`,
        value: 'epic',
    },
    {
        leftIcon: {
            key: 'rarityRare',
            size: 20
        },

        label: `RARE`,
        value: 'rare',
    },
];

const CATEGORIES = getAllCategories().map(c => ({
    leftIcon: {
        url: getCategoryIcon(c),
        size: 30
    },

    value: c,
    label: c,
}));

const SOURCES = getAllSources().map(c => ({
    value: c,
    label: c,
}));

const THEMES = getAllThemes().map(t => ({
    leftIcon: {
        url: `/img/cosmetics/themes/${toKebabCase(t)}.webp`,
        size: 23
    },

    value: t,
    label: t,
}));

const image = ref<Blob|null>(props.costume ? (await loadCostumeImage(props.costume.id) ?? null) : null);
const imageURL = ref<string|null>(image.value ? URL.createObjectURL(image.value) : null);

const fileUploadInput: Ref<HTMLInputElement|null> = ref(null);
async function addImage(files?: FileList|null) {
    if (!files || !files[0] || !files[0].type.startsWith('image/')) {
        notify(
            `File could not be imported!`,
            3000,
            { image: 'warning', color: '#c94f36' }
        );

        return;
    }

    const bytes = await files[0].arrayBuffer();
    const blob = new Blob([bytes], { type: files[0].type });
    image.value = blob;

    if (imageURL.value)
        URL.revokeObjectURL(imageURL.value);
    imageURL.value = URL.createObjectURL(blob);
}

function removeImage() {
    image.value = null;

    if (imageURL.value)
        URL.revokeObjectURL(imageURL.value)
    imageURL.value = null;
}

onUnmounted(() => {
    if (imageURL.value)
        URL.revokeObjectURL(imageURL.value);
})

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
        addImage(e.dataTransfer.files);
}

function confirm() {
    const res = {
        costume: costumeModel.value,
        image: image.value
    }

    emit('confirm', res);
}

async function deleteCostume() {
    openModal(ConfirmModal, {
        title: 'Delete Costume',
        message: 'Are you sure you want to delete this costume? This action is irreversible.',
    })
    .promise
    .then(async () => {
        const unknownHeroes = useLocalStorage<HeroData[]>('unknown_heroes', []);
        const hero = unknownHeroes.value.find(h => h.id == props.heroId);
        if (!hero)
            return;

        const costumeIndex = hero.customCostumes?.findIndex(c => c.id == costumeModel.value.id) ?? -1;
        if (costumeIndex == -1)
            return;

        hero.customCostumes?.splice(costumeIndex, 1);

        deleteCostumeImage(costumeModel.value.id);

        const profile = useLocalStorage('profile', await DEFAULT_PROFILE_STORE(), ProfileStoreSchema);

        if (profile.value.selectedHero.skin == costumeModel.value.id)
            profile.value.selectedHero.skin = undefined;

        emit('cancel');
    })
    .catch(() => null)
}

useEvent('keyup', (e: KeyboardEvent) => {
    if (e.code !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey)
        return;

    confirm();
});
</script>