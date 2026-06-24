<template>
    <div class="modal">
        <h2 v-if="title" v-html="title"/>
        <UiSeparator class="separator" />
        <br/>

        <div class="color">
            <h3>COLOUR</h3>
            <div class="input">
                <input
                    type="color"
                    v-model="hero.color"
                />
                <Tex
                    image="reset"
                    color="var(--blue)"
                    hover="color"
                    hover-color="var(--light-blue)"
                    clickable
                    square

                    width="30px"
                    height="30px"

                    @click="hero.color = UNKNOWN_HERO().color"
                />
            </div>
        </div>
        <div class="images">
            <ul>
                <li
                    v-for="([key, { name, description }]) in objectEntries(HERO_IMAGES)"
                    :key="key"
                >
                    <h3>{{ name }}</h3>
                    <div class="images-layout">
                        <div class="wrapper">
                            <div
                                :class="{
                                    'upload-container': 1,
                                    active: uploadDragOver == key,
                                    'show-ui': !heroImages[key]
                                }"
                                :style="{
                                    '--selected-image': heroImagesURLs[key] ? `url(${heroImagesURLs[key]})` : undefined
                                }"

                                @dragenter.prevent="onDragEnter(key)"
                                @dragleave.prevent="onDragLeave"
                                @dragover.prevent

                                @drop.prevent="onDrop(key, $event)"
                            >
                                <Tex
                                    image="upload"

                                    width="40px"
                                    height="40px"
                                />
                                <p>Drag and drop your image here</p>
                                <p class="or">or</p>
                                <ul>
                                    <li class="button-style" @click="fileUploadInputs[key]?.click()">
                                        Select image
                                    </li>
                                </ul>

                                <input
                                    :ref="el => fileUploadInputs[key] = (el as HTMLInputElement)"
                                    :id="`file-upload-${key}`"
                                    type="file"

                                    accept="image/png,image/webp,image/jpeg,image/jfif"

                                    @change="addImage(key, fileUploadInputs[key]?.files)"
                                >
                            </div>

                            <div v-if="heroImages[key]" class="actions">
                                <div @click="fileUploadInputs[key]?.click()" class="button-style">
                                    Change
                                </div>
                                <div @click="removeImage(key)" class="button-style">
                                    Remove
                                </div>
                            </div>
                        </div>
                        <div class="wrapper">
                            <div class="example-container">
                                <img
                                    :src="`${hero.dataDir}${key}.webp`"
                                    draggable="false"
                                    :alt="`Hero Image ${name}`"
                                >
                            </div>
                            <div class="actions">
                                <div @click="downloadExample(key)" class="button-style">
                                    Download
                                </div>
                            </div>
                        </div>
                    </div>
                    <p v-if="description">
                        {{ description }}
                    </p>

                    <div
                        v-if="key == 'bust-champion' && heroImages[key] && heroAnimatedIconReward"
                        class="champion-image-position"
                    >
                        <div class="normal">
                            <div class="container">
                                <div class="upload-wrapper">
                                    <UiAnimatedIcon
                                        :reward="heroAnimatedIconReward"
                                        :size="240"
                                    />
                                </div>
                            </div>

                            <div class="options">
                                <FormAdvancedInput 
                                    input-placeholder="X"
                                    :number-input="{ step: 10 }"
                                    :model-value="`${animationProperties.iconAnimationOffset?.[0] ?? ''}`"
                                    @update:model-value="animationProperties.iconAnimationOffset =
                                        setInArray(0, parseInt($event), animationProperties.iconAnimationOffset)
                                    "
                                />
                                <FormAdvancedInput 
                                    input-placeholder="Y"
                                    :number-input="{ step: 10 }"
                                    :model-value="`${animationProperties.iconAnimationOffset?.[1] ?? ''}`"
                                    @update:model-value="animationProperties.iconAnimationOffset =
                                        setInArray(1, parseInt($event), animationProperties.iconAnimationOffset)
                                    "
                                />
                            </div>
                        </div>
                        <div class="large">
                            <div class="container">
                                <UiAnimatedIconLarge
                                    :reward="{
                                        ...heroAnimatedIconReward,
                                        iconAnimation: {
                                            ...heroAnimatedIconReward.iconAnimation!,
                                            offset: animationProperties.iconLargeAnimationOffset ?? heroAnimatedIconReward.iconAnimation?.offset
                                        }
                                    }"
                                    :hero-role="heroRolesAsArray(hero.roles)[0]"
                                />
                            </div>

                            <div class="options">
                                <FormAdvancedInput 
                                    :input-placeholder="`${animationProperties.iconAnimationOffset?.[0] ?? 'X'}`"
                                    :number-input="{ step: 10 }"
                                    :model-value="`${animationProperties.iconLargeAnimationOffset?.[0] ?? ''}`"
                                    @update:model-value="animationProperties.iconLargeAnimationOffset =
                                        setInArray(0, parseInt($event), animationProperties.iconLargeAnimationOffset)
                                    "
                                />
                                <FormAdvancedInput 
                                    :input-placeholder="`${animationProperties.iconAnimationOffset?.[1] ?? 'Y'}`"
                                    :number-input="{ step: 10 }"
                                    :model-value="`${animationProperties.iconLargeAnimationOffset?.[1] ?? ''}`"
                                    @update:model-value="animationProperties.iconLargeAnimationOffset =
                                        setInArray(1, parseInt($event), animationProperties.iconLargeAnimationOffset)
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div class="buttons">
            <FormButton size="small" @click="confirm">
                Confirm
            </FormButton>
            <FormButton size="small" color-scheme="white" @click="$emit('cancel')">Cancel</FormButton>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.modal
    padding-bottom: 0 !important

    .button-style
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

    .color
        width: 200px
        margin-bottom: 60px

        h3
            font-size: 24px
            font-weight: 400
            text-transform: uppercase
            text-align: center
            color: $blue

            margin-bottom: 20px

        .input
            width: 100%
            display: flex
            align-items: center
            gap: 10px

            input
                height: 30px
                cursor: pointer

    .images
        width: 100%

        display: flex
        justify-content: center

        > ul
            width: 100%
            max-width: 800px
            padding: 0 20px

            display: flex
            flex-direction: column
            gap: 60px

            > li
                width: 100%
                display: flex
                flex-direction: column
                align-items: center
                gap: 20px

                > h3
                    font-size: 24px
                    font-weight: 400
                    text-transform: uppercase
                    color: $blue

                > p
                    font-size: 16px
                    text-align: center

                .images-layout
                    display: flex
                    flex-direction: column
                    justify-content: center
                    align-items: center
                    gap: 20px

                    +media-tablet
                        flex-direction: row
                        align-items: start


                    .wrapper
                        flex-shrink: 0
                        display: flex
                        flex-direction: column
                        gap: 10px

                        .actions
                            display: flex
                            justify-content: stretch
                            gap: 10px

                            .button-style
                                width: 100%
                                text-align: center

                    .upload-container,
                    .example-container
                        flex-shrink: 0
                        width: 300px
                        height: 300px

                        img
                            width: 100%
                            height: 100%
                            object-fit: contain


                    .upload-container
                        position: relative
                        padding: 40px 60px

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

                        input
                            display: none
                    
                    .example-container
                        background: $light

                        border: 3px solid $light-blue-highlight

                .champion-image-position
                    width: 100%
                    display: grid
                    grid-template-columns: 1fr 1fr
                    justify-items: center
                    align-items: center

                    +media-mobile
                        display: flex
                        flex-direction: column
                        gap: 60px

                    .normal,
                    .large
                        width: 100%
                        display: grid
                        grid-template-columns: 100%
                        grid-template-rows: 150px auto
                        justify-items: center
                        align-items: center
                        gap: 20px

                        .container
                            pointer-events: none

                        .options
                            display: flex
                            flex-direction: column
                            gap: 5px

                        ::v-deep(.input-wrapper)
                            padding: 0 !important
                            
                            .small-button,
                            .input
                                padding: 5px 8px
                                font-size: 18px

                                .texture
                                    .tex-image
                                        width: 15px !important
                                        height: 15px !important

                            .input
                                width: 60px

                                &::-webkit-inner-spin-button,
                                &::-webkit-outer-spin-button
                                    appearance: none

                            .step
                                width: 50px

                    .normal
                        .container
                            position: relative
                            width: 100px
                            height: 100px

                            background: var(--tex-itemBackground) center no-repeat
                            background-size: 100% 100%

                            border: 3px solid $light-blue-highlight

                            overflow: hidden

                            .upload-wrapper
                                position: absolute
                                top: 50%
                                left: 50%
                                transform: translate(-50%, -50%)

    .buttons
        position: sticky
        bottom: 0

        padding-bottom: calc(15px + env(safe-area-inset-bottom))
        z-index: 3
</style>

<script lang="ts">
export type AnimationProperties = {
    iconAnimationSize?: [number, number],
    iconAnimationOffset?: [number, number],
    iconLargeAnimationOffset?: [number, number],
}
</script>

<script setup lang="ts">
import type { HeroData, Reward } from '~/assets/data/common';
import { heroRolesAsArray, UNKNOWN_HERO } from '~/assets/data/heroes';
import { getImageDimensions, type HeroImages, HERO_IMAGES } from '~/services/hero-image-operations';

const { notify } = useNotificationManager();

const props = defineProps<{
    title: string,
    hero: HeroData
    heroImages: HeroImages,
}>();

const emit = defineEmits<{
    confirm: [ result: { color: string, images: HeroImages, animation: AnimationProperties } ],
    cancel: []
}>();

const fileUploadInputs = ref<Partial<Record<keyof HeroImages, HTMLInputElement>>>({});

const heroImages = ref<HeroImages>(props.heroImages);
const heroImagesURLs = ref<Partial<Record<keyof HeroImages, string>>>(
    Object.fromEntries(Object.entries(heroImages.value)
        .filter(([_, blob]) => !!blob)
        .map(([key, blob]) => [ key, URL.createObjectURL(blob!) ])
    )
);
onUnmounted(() => Object.values(heroImagesURLs.value).forEach(url => URL.revokeObjectURL(url)));

let dragCounter = 0;
const uploadDragOver = ref<keyof HeroImages|null>(null);

function onDragEnter(key: keyof HeroImages) {
    dragCounter++;
    uploadDragOver.value = key;
}

function onDragLeave() {
    dragCounter--;
    if (dragCounter === 0)
        uploadDragOver.value = null;
}

function onDrop(key: keyof HeroImages, e: DragEvent) {
    dragCounter = 0;
    uploadDragOver.value = null;
    if (e.dataTransfer?.files)
        addImage(key, e.dataTransfer.files);
}

function downloadExample(key: keyof HeroImages) {
    const a = document.createElement('a');
    a.href = `${props.hero.dataDir}${key}.webp`;
    a.download = `${key}.webp`;
    a.click();
}

async function addImage(key: keyof HeroImages, files?: FileList|null) {
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
    heroImages.value[key] = blob;

    if (key == 'bust-champion') {
        const imgDimensions = await getImageDimensions(blob);
        animationProperties.value.iconAnimationSize = [imgDimensions.width, imgDimensions.height];
    }

    if (heroImagesURLs.value[key])
        URL.revokeObjectURL(heroImagesURLs.value[key]);

    heroImagesURLs.value[key] = URL.createObjectURL(heroImages.value[key]);
}

function removeImage(key: keyof HeroImages) {
    heroImages.value[key] = null;
    delete heroImagesURLs.value[key];

    if (key === 'bust-champion')
        animationProperties.value = {};
}

function setInArray<T extends any[]>(idx: number, value: T[number], array: T|undefined) {
    if (!array)
        array = [] as any;
    array![idx] = value;

    return array;
}

const animationProperties = ref<AnimationProperties>({
    iconAnimationSize: props.hero.iconAnimationSize,
    iconAnimationOffset: props.hero.iconAnimationOffset,
    iconLargeAnimationOffset: props.hero.iconLargeAnimationOffset,
});

const heroAnimatedIconReward = computed<Reward|null>(() => {
    if (!heroImagesURLs.value['bust-champion'])
        return null;

    const fps = props.hero.ranks.find(r => r.type.id == 'champion')!.type.rewards[0]!.iconAnimation!.fps;

    return {
        level: 50,
        name: 'Champion Icon',
        icon: heroImagesURLs.value['bust-champion'],
        iconAnimation: {
            size: animationProperties.value.iconAnimationSize ?? [3600, 4000],
            columns: 6,
            rows: 10,
            fps,
            offset: animationProperties.value.iconAnimationOffset
        },
        rarity: 'legendary'
    }
});

function confirm() {
    emit('confirm', {
        color: props.hero.color,
        images: heroImages.value,
        animation: animationProperties.value
    })
}

useEvent('keyup', (e: KeyboardEvent) => {
    if (e.code !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey)
        return;

    confirm();
});
</script>