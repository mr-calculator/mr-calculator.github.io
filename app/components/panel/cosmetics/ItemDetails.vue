<template>
    <div class="item-details-wrapper">
        <div class="details">
            <div class="spacer" />
            
            <div class="title">
                <h2 :class="`font-size-${titleFontSize(selectedItem.name)}`">
                    {{ selectedItem.name }}
                </h2>
                <div class="rarity">
                    <Tex
                        :image="RARITY_DATA[selectedItem.rarity].tex"

                        width="30px"
                        height="30px"
                    />
                    <p>
                        {{ RARITY_DATA[selectedItem.rarity].name }}
                    </p>
                </div>
                <div class="divider" />

                <div class="ownership">
                    <ClientOnly>
                        <FormCheckbox
                            :model-value="ownedItems.includes(selectedItem.id)"
                            @update:model-value="$emit('toggleOwned', selectedItem.id)"

                            size="small"
                            color-scheme="dark"
                        >
                            OWNED
                        </FormCheckbox>
                    </ClientOnly>
                </div>
            </div>

            <div ref="selected-item-info" class="info">
                <div v-if="selectedItem.category" class="item">
                    <div class="label">
                        Category
                    </div>
                    <div class="data">
                        {{ selectedItem.category }}
                    </div>
                </div>

                <div v-if="getHeroForItem?.(selectedItem.id)" class="item">
                    <div class="label">
                        Hero
                    </div>
                    <div class="data">
                        <NuxtLink
                            :to="`/heroes/${getHeroForItem(selectedItem.id)!.id}`"
                        >
                            {{ getHeroForItem(selectedItem.id)!.name }}
                        </NuxtLink>
                    </div>
                </div>

                <div v-if="selectedItem.source || selectedItem.sourceFull" class="item">
                    <div class="label">
                        Source
                    </div>
                    <div class="data">
                        <NuxtLink
                            v-if="selectedItem.source === 'Achievements'"
                            :to="tryCreateAchievementLink(selectedItem.sourceFull)"
                        >
                            {{ selectedItem.source ?? selectedItem.sourceFull }}
                        </NuxtLink>
                        <template v-else>
                            {{ selectedItem.source ?? selectedItem.sourceFull }}
                        </template>

                        <a
                            v-if="selectedItem.sourceLink"
                            class="external-link"
                            
                            :href="selectedItem.sourceLink.startsWith('http')
                                ? selectedItem.sourceLink
                                : toWikiLink(selectedItem.sourceLink)
                            "
                            target="_blank"
                            rel="noopener noreferrer"

                            v-tooltip="({
                                text: !selectedItem.sourceLink.startsWith('http')
                                    ? 'Open the <b>wiki page</b>'
                                    : 'Open the <b>link</b>',
                                icon: 'mouseLeft'
                            } satisfies TooltipBinding)"
                        >
                            <template v-if="!selectedItem.sourceLink.startsWith('http')">
                                Wiki
                            </template>
                            <Tex
                                image="arrowBox"
                                color="var(--text-color)"

                                width="14px"
                                height="14px"
                            />
                        </a>
                    </div>

                    <div v-if="selectedItem.source" class="data extra">
                        {{ selectedItem.sourceFull }}
                    </div>
                </div>

                <div v-if="selectedItem.theme" class="item">
                    <div class="label">
                        Theme
                    </div>
                    <div class="data">
                        <div class="with-icon">
                            <Tex
                                :src="`/img/cosmetics/themes/${toKebabCase(selectedItem.theme)}.webp`"
                                color="var(--text-color)"

                                width="23px"
                                height="23px"
                            />
                            {{ selectedItem.theme }}
                        </div>

                        <a
                            class="external-link"
                            
                            :href="toWikiLink(`/wiki/Themes#${selectedItem.theme.replaceAll(' ', '_')}`)"
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

                                width="14px"
                                height="14px"
                            />
                        </a>
                    </div>
                </div>

                <div v-if="selectedItem.releaseDate" class="item">
                    <div class="label">
                        Release Date
                    </div>
                    <div class="data">
                        {{ formatDate(selectedItem.releaseDate) }}
                    </div>
                </div>

                <div v-if="equippable" class="button-wrapper">
                    <FormButton
                        :color-scheme="unequippable && equipped ? 'dark' : 'yellow'"
                        size="small"
                        :disabled="!unequippable && equipped"
                        @click="$emit('toggleEquipped', selectedItem.id)"
                    >
                        <template v-if="!unequippable">
                            {{ equipped ? 'Equipped' : 'Equip' }}
                        </template>
                        <template v-else>
                            {{ equipped ? 'Remove' : 'Equip' }}
                        </template>
                    </FormButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.item-details-wrapper
    width: 100%
    height: 100%

    display: flex
    justify-content: center
    align-items: center

    .details
        width: 100%
        height: 100%

        display: flex
        flex-direction: column
        justify-content: space-between
        align-items: stretch

        .spacer
            display: none
            
            +media-xl-desktop
                display: block

        .title
            position: relative
            display: flex
            flex-direction: column
            gap: 10px

            padding-bottom: 10px
            padding-left: 10px

            .divider
                width: 100%
                height: 2px
                background: #c3c9dc

            h2
                // prevents letters from cutting off due
                // to parent having overflow auto
                padding-right: 6px

                font-size: 56px
                font-family: $font-heavy
                font-weight: 400
                line-height: 1
                font-style: italic
                text-transform: uppercase

                &.font-size-small
                    font-size: 56px

                &.font-size-medium
                    font-size: 62px

                &.font-size-large
                    font-size: 74px


            .rarity
                display: flex
                align-items: center
                gap: 2px

                p
                    font-family: $font-bold
                    font-size: 20px
                    font-style: italic
                    text-transform: uppercase
                    color: $light-blue-highlight

            .ownership
                display: flex
                justify-content: start

        .info
            display: flex
            flex-direction: column
            gap: 10px

            overflow-x: clip
            overflow-y: auto

            padding-left: 10px

            +scrollbar($thickness: 8px, $background: transparent, $thumb: $light-blue, $active: $color)

            +media-ml-desktop
                display: grid
                grid-template-columns: 1fr 1fr
                justify-content: start
                gap: 10px 20px

            +media-xl-desktop
                display: flex
                flex-direction: column
                gap: 10px

            .item
                display: flex
                flex-direction: column

                .label
                    font-size: 14px
                    text-transform: uppercase
                    letter-spacing: 1px
                    
                    color: $blue-gray

                .data
                    font-size: 18px

                    width: fit-content
                    display: inline-flex
                    align-items: center
                    gap: 10px

                    &.extra
                        font-size: 16px
                        font-style: italic
                        color: $blue-gray

                    a:not(.external-link)
                        text-decoration: underline

                        +hover
                            color: $color-accent

                    .with-icon
                        display: flex
                        gap: 5px

                    .external-link
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

            .button-wrapper
                display: flex
                justify-content: start
                
                margin-top: 40px
                margin-left: -10px

                +media-phone
                    .button
                        width: 100%
</style>

<script setup lang="ts">
import { RARITY_DATA, type HeroData } from '~/assets/data/common';
import type { CosmeticItem } from './ListView.vue';
import type { TooltipBinding } from '~/directives/tooltip';
import { ACHIEVEMENT_CATEGORIES } from '~/assets/data/achievements/achievements';

const props = defineProps<{
    selectedItem: CosmeticItem,
    ownedItems: string[],

    getHeroForItem?: (itemId: string) => HeroData|undefined,

    equippable?: boolean,
    equipped?: boolean,
    unequippable?: boolean
}>();

const emit = defineEmits<{
    toggleOwned: [id: string],
    toggleEquipped: [id: string]
}>();

const selectedItemInfo = useTemplateRef('selected-item-info');

const toWikiLink = (id: string) => `https://marvelrivals.fandom.com${id}`;

function formatDate(date: string) {
    let formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    if (formatted === 'Invalid Date')
        formatted = date;

    return formatted;
}

function tryCreateAchievementLink(source: string) {
    let categoryId = null;
    ACHIEVEMENT_CATEGORIES.forEach(cat => {
        if (source.includes(cat.name))
            categoryId = cat.id;
    });

    return `/achievements` + categoryId ? `/${categoryId}` : '';
}

function titleFontSize(title: string) {
    if (title.length > 15)
        return 'small';
    if (title.length > 10)
        return 'medium';

    return 'large';
}

defineExpose({
    scrollInfoContainer(options: ScrollToOptions) {
        selectedItemInfo.value?.scrollTo(options);
    }
})
</script>