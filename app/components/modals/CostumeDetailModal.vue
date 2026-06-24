<template>
    <div :class="['modal', 'costume-detail-modal', costume.rarity ? `rarity-${costume.rarity}` : '']">
        <Tex
            class="close-btn"
            image="cross"

            color="#fff"
            hover="color"
            hover-color="var(--blue)"
            clickable

            width="36px"
            height="36px"
            object-fit="contain"

            title="Close"

            @click="$emit('cancel')"
        />
        <div class="scroll-container">
            <div
                class="costume-image-panel"
                :style="{
                    '--hero-color': props.heroColor ?? hero.color,
                    '--hero-image': `url(${src})`
                }
            ">
                <div
                    :class="['hero-image', costume.rarity ? `rarity-${costume.rarity}` : '']"
                    :style="{
                        '--hero-image': `url(${src})`,
                        '--hero-color': props.heroColor ?? hero.color
                    }"
                >
                    <div class="stroke" />
                    <img
                        :src="src"
                        :alt="costume.name"
                        :style="imageScale !== 1 ? {
                            transform: `scale(${imageScale})`,
                            transformOrigin: imageOrigin
                        } : undefined"
                        draggable="false"
                    />
                </div>
            </div>

            <div class="details-panel">
                <img
                    class="hero-badge"
                    :src="hero ? useHeroImage('logo', hero).value : `/img/heroes/data/${heroId}/logo.webp`"
                    alt="Hero Badge"
                    draggable="false"
                />

                <div class="title-wrapper">
                    <h2 :class="{ custom: costume.custom }">
                        <FormCheckbox
                            :model-value="ownedCostumes.includes(costume.id)"
                            @update:model-value="toggleCostumeOwned"

                            v-tooltip="({
                                text: `${ownedCostumes.includes(costume.id) ? 'Unmark' : 'Mark'} costume as <b>owned</b>`,
                                icon: 'mouseLeft'
                            } satisfies TooltipBinding)"
                        />
                        <div class="title">
                            {{ costume.name }}
                            <a
                                v-if="costume.wikiLink && !costume.custom"
                                class="wiki-link large"
                                
                                :href="toWikiLink(costume.wikiLink)"
                                target="_blank"
                                rel="noopener noreferrer"

                                v-tooltip="({
                                    text: 'Open the <b>wiki page</b>',
                                    icon: 'mouseLeft'
                                } satisfies TooltipBinding)"
                            >
                                Wiki
                                <Tex
                                    image="arrowBox"
                                    color="var(--text-color)"

                                    width="20px"
                                    height="20px"
                                />
                            </a>
                        </div>
                        <Tex
                            v-if="costume.custom"
                            class="edit"
                            image="edit"

                            color="#8695bb"
                            hover="color"
                            hover-color="#5d75b2"

                            square
                            clickable

                            width="40px"
                            height="40px"

                            @click="$emit('confirm', true)"
                        />
                    </h2>
                    <UiSeparator class="title-divider" />    
                </div>


                <div class="details">
                    <div v-if="costume.customizable" class="detail">
                        <div class="label">
                            <div class="with-icon">
                                <Tex
                                    image="costumeCustomizable"

                                    width="20px"
                                    height="20px"
                                />
                                Customizable
                            </div>
                        </div>
                    </div>

                    <div class="detail">
                        <span class="label">Rarity</span>
                        <div class="with-icon">
                            <Tex
                                :image="RARITY_MAP[costume.rarity]"

                                width="20px"
                                height="20px"
                            />
                            {{ costume.rarity.charAt(0).toUpperCase() + costume.rarity.slice(1) }}
                        </div>
                    </div>
                    
                    <div class="spacer" />

                    <NuxtLink
                        class="detail"
                        
                        :to="costume.custom ? undefined : createCostumesLink(costume.category, 'category')"
                        @click="$emit('cancel')"

                        v-tooltip="costume.custom ? undefined : ({
                            text: createCostumeTooltipLabel(costume.category),
                            icon: 'mouseLeft'
                        } satisfies TooltipBinding)"
                    >
                        <span class="label">Category</span>
                        <div class="name">
                            {{ costume.category }}
                        </div>
                    </NuxtLink>
                    <NuxtLink
                        v-if="costume.source"
                        class="detail"

                        :to="costume.custom ? undefined : createCostumesLink(costume.source, 'source')"
                        @click="$emit('cancel')"

                        v-tooltip="costume.custom ? undefined : ({
                            text: createCostumeTooltipLabel(costume.source),
                            icon: 'mouseLeft'
                        } satisfies TooltipBinding)"
                    >
                        <span class="label">Source</span>
                        <div class="with-wiki-link">
                            <div class="name">
                                {{ costume.source }}
                            </div>
                            <a
                                v-if="costume.sourceLink && !costume.custom"
                                class="wiki-link"
                                
                                :href="toWikiLink(costume.sourceLink)"
                                target="_blank"
                                rel="noopener noreferrer"

                                @click="e => {
                                    e.stopPropagation();
                                }"

                                v-tooltip="({
                                    text: 'Open the <b>wiki page</b>',
                                    icon: 'mouseLeft'
                                } satisfies TooltipBinding)"
                            >
                                Wiki
                                <Tex
                                    image="arrowBox"
                                    color="var(--text-color)"

                                    width="14px"
                                    height="14px"
                                />
                            </a>
                        </div>
                    </NuxtLink>
                    <NuxtLink
                        v-if="costume.theme"
                        class="detail"
                        :to="costume.custom ? undefined : createCostumesLink(costume.theme, 'theme')"
                        @click="$emit('cancel')"

                        v-tooltip="costume.custom ? undefined : ({
                            text: createCostumeTooltipLabel(costume.theme),
                            icon: 'mouseLeft'
                        } satisfies TooltipBinding)"
                    >
                        <span class="label">Theme</span>
                        <div :class="{'with-icon': themeIconExists(costume.theme)}">
                            <Tex
                                v-if="themeIconExists(costume.theme)"
                                :src="`/img/cosmetics/themes/${toKebabCase(costume.theme)}.webp`"
                                color="var(--blue)"

                                width="23px"
                                height="23px"
                            />

                            <div class="name">
                                {{ costume.theme }}
                            </div>

                            <a
                                v-if="costume.theme && !costume.custom"
                                class="wiki-link"
                                
                                :href="toWikiLink(`/wiki/Themes#${costume.theme.replaceAll(' ', '_')}`)"
                                target="_blank"
                                rel="noopener noreferrer"

                                @click="e => {
                                    e.stopPropagation();
                                }"

                                v-tooltip="({
                                    text: 'Open the <b>wiki page</b>',
                                    icon: 'mouseLeft'
                                } satisfies TooltipBinding)"
                            >
                                Wiki
                                <Tex
                                    image="arrowBox"
                                    color="var(--text-color)"

                                    width="14px"
                                    height="14px"
                                />
                            </a>
                        </div>
                    </NuxtLink>

                    <div class="spacer" />

                    <p v-if="formattedDate" class="detail">
                        <span class="label">Release Date</span>
                        {{ formattedDate }}
                    </p>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="sass">
// Breakpoint strategy (Option B):
//   desktop (≥993px):  side-by-side, full size
//   tablet  (769–992): side-by-side, compressed
//   phone   (≤768px):  stacked

.costume-detail-modal
    $max-width: 1200px
    $max-height: 600px
    $max-height-tablet: 500px

    position: relative
    padding: 0px
    max-width: $max-width
    min-height: $max-height

    overflow: hidden !important

    // Compressed side-by-side for tablet
    +media-mobile
        max-width: calc(100% - 24px)
        min-height: 420px
        padding-bottom: 0 !important

    +media-tablet
        min-height: $max-height-tablet

    // Only phones stack
    +media-max-tablet
        min-height: unset

    &.rarity-rare,
    &.rarity-epic,
    &.rarity-legendary
        &::before,
        &::after
            content: ""
            position: absolute
            width: 100%
            height: 8px
            z-index: 10
            pointer-events: none

        &::after
            bottom: 0
            left: 0
            transform: skewX(88.5deg) scaleX(5) translateX(-50%)

        &::before
            top: 0
            right: 0
            transform: skewX(88.5deg) scaleX(5) translateX(50%) scaleY(-1)

    &.rarity-rare
        box-shadow: 0 0 0 2px #65AFE3
        &::before, &::after
            background: #65AFE3
    &.rarity-epic
        box-shadow: 0 0 0 2px #BE85EF
        &::before, &::after
            background: #BE85EF
    &.rarity-legendary
        box-shadow: 0 0 0 2px #FFA72E
        &::before, &::after
            background: #FFA72E

    .scroll-container
        width: 100%
        height: auto

        max-width: $max-width
        min-height: $max-height

        display: flex
        flex-direction: row
        align-items: stretch
        gap: 0

        overscroll-behavior: contain
        overflow-x: hidden
        overflow-y: auto

        +media-tablet
            min-height: $max-height-tablet

        +media-max-tablet
            min-height: 100%
            flex-direction: column

.close-btn
    position: absolute
    top: 36px
    right: 36px
    z-index: 20

.costume-image-panel
    background-color: color-mix(in srgb, var(--hero-color) 40%, transparent)
    position: relative
    width: 400px
    flex-shrink: 0
    overflow: hidden

    +media-mobile
        width: 320px

    +media-max-tablet
        width: 100%
        height: 280px

    // Blurred backdrop fills the panel behind the contained character image
    &::before
        content: ""
        position: absolute
        inset: -1px
        background-image: var(--hero-image)
        background-size: cover
        background-position: center
        filter: blur(14px) brightness(0.45) saturate(1.1)
        z-index: 0

        +media-max-tablet
            display: none

    // Coloured divider between image panel and details panel
    &::after
        content: ""
        position: absolute
        top: 0
        right: 0
        width: 2px
        height: 100%
        background: linear-gradient(to bottom, transparent, var(--light) 30%, var(--light) 70%, transparent)
        opacity: 0.6
        z-index: 3
        pointer-events: none

        +media-max-tablet
            top: unset
            bottom: 0
            right: unset
            left: 0
            width: 100%
            height: 2px
            background: linear-gradient(to right, transparent, var(--hero-color) 30%, var(--hero-color) 70%, transparent)

    .hero-image
        position: absolute
        inset: 0
        overflow: hidden
        z-index: 1

        img
            width: 100%
            height: 100%
            // Side-by-side: cover fills the tall panel cleanly (source is ~square, panel is portrait — only ~50px horizontal trim).
            // Stacked phone: contain so a short wide panel shows the full character instead of cropping head-only.
            object-fit: cover
            object-position: center
            position: relative
            z-index: 1

            user-select: none
            -webkit-user-drag: none

            +media-max-tablet
                object-fit: contain
                object-position: center

        // Soft coloured silhouette echo behind the character — must use the SAME fit
        // mode and position as the img above, otherwise the echo desyncs from the
        // character. Both sides shifted left by the same amount for the offset look.
        .stroke
            position: absolute
            inset: 0
            pointer-events: none

            &::before,
            &::after
                content: ""
                position: absolute
                inset: 0
                mask-image: var(--hero-image)
                mask-size: cover
                mask-position: center
                mask-repeat: no-repeat
                -webkit-mask-image: var(--hero-image)
                -webkit-mask-size: cover
                -webkit-mask-position: center
                -webkit-mask-repeat: no-repeat

                +media-max-tablet
                    mask-size: contain
                    -webkit-mask-size: contain

            &::before
                background: #fff
                opacity: 0.12
                transform: translateX(-8px)

            &::after
                background: var(--hero-color)
                opacity: 0.3
                transform: translateX(-4px)

.details-panel
    position: relative
    flex: 1
    display: flex
    flex-direction: column
    align-items: flex-start
    justify-content: start
    gap: 16px
    padding: 55px 36px
    padding-right: 140px !important
    // overflow: hidden

    // Tablet — same direction, tighter
    +media-mobile
        padding: 26px 24px
        padding-right: 120px !important
        gap: 12px

    // Phone — stacked, content flows from top
    +media-max-tablet
        padding: 18px 18px !important
        padding-bottom: 30px !important
        gap: 10px
        justify-content: flex-start

    .wiki-link
        flex-shrink: 0
        flex-grow: 0
        width: fit-content
        height: fit-content

        padding: 3px 10px
        background: $color

        font-size: 14px
        font-family: $font-bold
        font-weight: 400
        color: $dark
        text-transform: uppercase
        font-style: normal

        display: flex
        align-items: center
        gap: 3px

        +hover
            background: $blue
            color: $color

            .texture
                --tex-color: #{$color} !important

        &.large
            padding: 12px 16px
            height: 40px
            font-size: 24px
            gap: 10px
            

    .hero-badge
        position: absolute
        bottom: 0px
        right: 60px
        width: 220px
        height: 220px
        object-fit: contain
        pointer-events: none
        user-select: none
        -webkit-user-drag: none
        mask-image: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 1.0) 100%)

        +media-mobile
            width: 160px
            height: 160px
            right: 12px

        +media-max-tablet
            width: 180px
            height: 180px
            right: 10px

    .title-wrapper
        width: 100%
        display: flex
        flex-direction: column
        align-items: stretch
        justify-content: start
        gap: 16px

        h2
            position: relative
            width: 100%
            text-align: center !important
            padding: 0 0 0 55px !important

            display: flex
            justify-content: space-evenly
            align-items: center
            gap: 10px

            &.custom
                padding: 0 55px 0 55px !important

            .title
                display: inline-flex
                align-items: center
                gap: 20px

                +media-max-tablet
                    .texture ::v-deep(.tex-image)
                        width: 20px !important
                        height: 20px !important

                > *
                    flex-shrink: 0

            .checkbox
                position: absolute
                left: 10px
                top: 50%

                transform: translateY(-50%)

            .edit
                position: absolute
                right: 10px
                top: 50%

                transform: translateY(-50%)

        .title-divider
            width: 100%
            margin-bottom: 20px

    .details
        position: relative
        margin-left: 18px

        width: 100%

        display: flex
        flex-direction: column
        justify-content: center
        gap: 14px

        z-index: 1

        +media-mobile
            gap: 12px
            margin-left: 8px

        +media-tablet
            min-height: 350px

        +media-max-tablet
            margin-left: 0
            gap: 10px

    .spacer
        width: 100%
        height: 10px

    a.detail
        width: fit-content
        .name
            text-decoration: underline

            +hover
                color: $color-accent

    .detail
        display: flex
        flex-direction: column
        gap: 2px
        font-size: 1.2em

        +media-mobile
            font-size: 1.05em
            padding: 0 20px

        +media-max-tablet
            font-size: 1em

        .label
            font-size: 0.7em
            text-transform: uppercase
            letter-spacing: 0.08em
            color: $blue-gray

        .with-wiki-link
            width: fit-content
            display: inline-flex
            align-items: center
            gap: 10px

        > a
            width: fit-content
            text-decoration: underline

            display: inline-flex
            align-items: center
            gap: 4px
            
            +hover
                color: $blue

                .texture
                    --tex-color: #{$blue} !important

        .with-icon
            display: flex
            align-items: center
            gap: 5px
</style>

<script setup lang="ts">
import type { HeroData } from '~/assets/data/common';
import { getAllThemes, getCategoryIcon, type Costume, type CostumeRarity } from '~/assets/data/cosmetics/costumes/costumes';
import { tex, type TextureKey } from '~/assets/data/textures';
import type { TooltipBinding } from '~/directives/tooltip';
import { loadCostumeImage } from '~/services/costume-image-operations';

const props = withDefaults(defineProps<{
    costume: Costume;
    hero: HeroData;
    heroId?: string,
    heroColor?: string,
    imageScale?: number;
    imageOrigin?: string;
}>(), {
    heroColor: 'var(--color)',
    imageScale: 1,
    imageOrigin: 'center center',
});

defineEmits<{ confirm: [ edit: boolean ], cancel: [] }>();

const ownedCostumes = useLocalStorage<string[]>(`cosmetics_owned_${props.heroId ?? props.hero.id}`, []);
function toggleCostumeOwned() {
    const index = ownedCostumes.value.indexOf(props.costume.id);
    if (index === -1)
        ownedCostumes.value.push(props.costume.id);
    else
        ownedCostumes.value.splice(index, 1);
}

const RARITY_MAP: Partial<Record<CostumeRarity, TextureKey>> = {
    legendary: 'rarityLegendary',
    epic: 'rarityEpic',
    rare: 'rarityRare',
    common: 'rarityCommon'
}

const toWikiLink = (id: string) => `https://marvelrivals.fandom.com${id}`;

const customURL = ref<string|null>(null);
async function createCustomCostumeURL() {
    if (customURL.value)
        URL.revokeObjectURL(customURL.value);

    const image = await loadCostumeImage(props.costume.id);

    if (!image) {
        customURL.value = tex('allHeroesCostume');
        return;
    }

    customURL.value = URL.createObjectURL(image);
}

onMounted(createCustomCostumeURL);
onUnmounted(() => customURL.value ? URL.revokeObjectURL(customURL.value) : null);
watch(() => props.costume, createCustomCostumeURL);

const src = computed(() => props.costume.custom
    ? (customURL.value ?? tex('allHeroesCostume'))
    : `/img/heroes/data/${props.heroId ?? props.hero.id}/costumes/${props.costume.id}.webp`
);

const formattedDate = computed(() => {
    if (!props.costume.releaseDate)
        return null;

    let formatted = new Date(props.costume.releaseDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (formatted === 'Invalid Date')
        formatted = props.costume.releaseDate;

    return formatted
});

function createCostumesLink(id: string, type: 'category'|'source'|'theme') {
    let link = '/costumes?';
    switch (type) {
        case 'category':
            link += 'categories=' + RouteConverter.stringArray.to([id]);
            break;
        case 'source':
            link += 'sources=' + RouteConverter.stringArray.to([id]);
            break;
        case 'theme':
            link += 'themes=' + RouteConverter.stringArray.to([id]);
            break;
    }

    return link;
}

function createCostumeTooltipLabel(type: string) {
    return `See <b>${type}</b>` + (type.toLowerCase().endsWith('costumes') ? '' : ' costumes');
}

const existingThemes = getAllThemes();
function themeIconExists(theme: string) {
    return existingThemes.includes(theme);
}
</script>
