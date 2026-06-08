<template>
    <ul :class="['cosmetics-items', `type-${display}`]">
        <li
            v-for="item in items"
            :key="item.id"
            :data-item-id="item.id"

            :class="{
                selected: isSelected(item),
                checked: checkedItems?.includes(item.id),
            }"

            @click="$emit('itemClick', item)"
            @contextmenu.prevent.stop="$emit('itemRickClick', item)"

            v-tooltip="item.tooltip"
        >
            <div :class="['rarity', `rarity-${item.rarity}`]" />
            <img
                v-if="item.image && showImage"
                :src="item.image"
                :alt="item.name"
                draggable="false"
            />
            <p v-if="item.name && showName">
                {{ item.name }}
            </p>

            <ClientOnly>
                <Tex
                    v-if="checkedItems?.includes(item.id)"
                    class="check-corner"

                    image="checkCorner"

                    width="40px"
                    height="40px"
                />
                <div v-if="markedItems?.includes(item.id)" class="mark">
                    {{ markName ?? 'Owned' }}
                </div>
            </ClientOnly>
        </li>
    </ul>
</template>

<style lang="sass">
.cosmetics-items
    display: flex
    justify-content: start
    align-items: center

    &.type-grid
        flex-wrap: wrap
        gap: 5px

        padding: 10px 0
        background: color-mix(in srgb, #959bb8 60%, transparent)

        li
            $size: 125px - calc(5px * 3px / 4px)
            position: relative
            width: $size
            height: $size

            background: var(--tex-itemBackground) no-repeat
            background-size: cover
            background-position: center

            padding: 20px

            transition: .1s ease
            cursor: pointer
            user-select: none

            > *
                opacity: 0.5

            +hover
                padding: 18px

                > *
                    opacity: 1

            &.selected::after
                content: ""
                position: absolute
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)

                width: calc(100% + 20px)
                height: calc(100% + 20px)

                background: var(--tex-cosmeticsGridItemSelected) no-repeat
                background-size: 100%
                background-position: center

                z-index: 1


            .rarity
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%

                overflow: clip

                &::before
                    content: ""
                    position: absolute
                    bottom: 0
                    left: 0
                    transform: skewX(88.5deg) scaleX(5) translateX(-50%)

                    width: 100%
                    height: 12px

                    pointer-events: none

                &.rarity-rare::before
                    background: #65AFE3
                &.rarity-epic::before
                    background: #BE85EF
                &.rarity-legendary::before
                    background: #FFA72E

            img
                display: block
                width: 100%
                height: 100%

                object-fit: cover

                user-select: none
                -webkit-user-drag: none

            .check-corner
                position: absolute
                top: 0
                right: 0

                opacity: 1


            .mark
                position: absolute
                right: 0
                bottom: 0

                font-family: $font-bold
                font-weight: 400
                font-size: 16px
                text-transform: uppercase
                letter-spacing: -0.3px
                color: $text-color

                padding: 3px 6px 3px 12px
                background: var(--tex-markBackground) no-repeat
                background-size: 100% 100%

                opacity: 1
                z-index: 1
</style>

<script setup lang="ts" generic="CosmeticType extends CosmeticItem">
import type { CosmeticItem } from './List.vue';

const props = withDefaults(defineProps<{
    display: 'list'|'grid',
    items: CosmeticType[],
    checkedItems?: string[],

    markedItems?: string[],
    markName?: string,

    showName?: boolean,
    showImage?: boolean,

    selected?: string|Set<string>
}>(), {
    showName: true,
    showImage: true,
});

const emit = defineEmits<{
    itemClick: [item: CosmeticType],
    itemRickClick: [item: CosmeticType]
}>();

function isSelected(item: CosmeticType) {
    if (props.selected instanceof Set)
        return props.selected.has(item.id);
    
    return props.selected === item.id;
}
</script>