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
            <div class="costume-image-panel" :style="{ '--hero-color': heroColor, '--hero-image': `url(${src})` }">
            <div
                :class="['hero-image', costume.rarity ? `rarity-${costume.rarity}` : '']"
                :style="{
                    '--hero-image': `url(${src})`,
                    '--hero-color': heroColor
                }"
            >
                <div class="stroke" />
                <img
                    :src="src"
                    :alt="costume.name"
                    :style="imageScale !== 1 ? { transform: `scale(${imageScale})`, transformOrigin: imageOrigin } : undefined"
                />
            </div>
        </div>

        <div class="details-panel">
            <img class="hero-badge" :src="`/img/heroes/data/${heroId}/logo.webp`" alt="" />
                <h2>
                    {{ costume.name }}
                    <FormCheckbox
                        :model-value="ownedCostumes.includes(costume.id)"
                        @update:model-value="toggleCostumeOwned"
                    />
                </h2>
                <UiSeparator class="title-divider" />
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

                    <p class="detail">
                        <span class="label">Category</span>
                        {{ costume.category }}
                    </p>
                    <p v-if="costume.source" class="detail">
                        <span class="label">Source</span>
                        {{ costume.source }}
                    </p>
                    <div v-if="costume.theme" class="detail">
                        <span class="label">Theme</span>
                        <div class="with-icon">
                            <Tex
                                :src="`/img/heroes/costume-themes/${toKebabCase(costume.theme)}.webp`"
                                color="var(--blue)"

                                width="23px"
                                height="23px"
                            />

                            {{ costume.theme }}
                        </div>
                    </div>

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
    position: relative
    padding: 0px
    max-width: 1000px
    min-height: 500px

    overflow: hidden !important

    // Compressed side-by-side for tablet
    +media-mobile
        max-width: calc(100% - 24px)
        min-height: 420px
        padding-bottom: 0 !important

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

        max-width: 1000px
        min-height: 500px

        display: flex
        flex-direction: row
        align-items: stretch
        gap: 0

        overscroll-behavior: contain
        overflow-x: hidden
        overflow-y: auto

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
    justify-content: center
    gap: 16px
    padding: 36px 36px
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
        gap: 10px
        justify-content: flex-start

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

    h2
        width: 100%
        text-align: center !important
        padding: 0 !important

        display: flex
        justify-content: space-evenly
        align-items: center
        gap: 10px

    .title-divider
        width: 100%
        margin-bottom: 4px

    .details
        width: 100%
        display: flex
        flex-direction: column
        gap: 14px
        margin-left: 18px
        position: relative
        z-index: 1

        +media-mobile
            gap: 12px
            margin-left: 8px

        +media-max-tablet
            margin-left: 0
            gap: 10px

    .spacer
        width: 100%
        height: 10px

    div.detail
        +media-mobile
            padding: 0 20px

    .detail
        display: flex
        flex-direction: column
        gap: 2px
        font-size: 1.2em

        +media-mobile
            font-size: 1.05em

        +media-max-tablet
            font-size: 1em

        .label
            font-size: 0.7em
            text-transform: uppercase
            letter-spacing: 0.08em
            color: $blue-gray

        .with-icon
            display: flex
            align-items: center
            gap: 5px
</style>

<script setup lang="ts">
import type { Costume, CostumeRarity } from '~/assets/data/costumes';
import type { TextureKey } from '~/assets/data/textures';

const props = withDefaults(defineProps<{
    costume: Costume;
    heroId: string;
    heroColor?: string;
    imageScale?: number;
    imageOrigin?: string;
}>(), {
    heroColor: 'var(--color)',
    imageScale: 1,
    imageOrigin: 'center center',
});

defineEmits<{ cancel: [] }>();

const ownedCostumes = useLocalStorage<string[]>(`cosmetics_owned_${props.heroId}`, []);
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
}

const src = computed(() => `/img/heroes/data/${props.heroId}/costumes/${props.costume.id}.webp`);

const formattedDate = computed(() => {
    if (!props.costume.releaseDate)
        return null;

    let formatted = new Date(props.costume.releaseDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (formatted === 'Invalid Date')
        formatted = props.costume.releaseDate;

    return formatted
});
</script>
