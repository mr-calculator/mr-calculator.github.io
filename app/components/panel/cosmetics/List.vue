<template>
    <div class="cosmetics-list">
        <ul v-if="displayType == 'categorized'" class="categories">
            <li
                v-for="([id, category]) in Object.entries(items as CategorizedCosmeticItemRecord<CosmeticType>)"
                :key="id"
            >
                <div
                    class="category-title"
                    @click="tryCollapseCategory(id, category)"
                >
                    <h3>{{ category.name }}</h3>
                    <div class="opts">
                        <p v-if="category.showCount" class="count">
                            <template v-if="category.showCount === 'no-owned'">
                                {{ category.items.length }}
                            </template>
                            <template v-else>
                                {{ category.items.filter(i => i.owned).length }}/{{ category.items.length }}
                            </template>
                        </p>
                        <Tex
                            class="caret"
                            :image="!collapsedCategories[id] ? 'dropdownCaretUp' : 'dropdownCaret'"
                            color="#666f80"

                            width="15px"
                            height="15px"
                        />
                    </div>
                </div>
                
                <PanelCosmeticsItems
                    v-if="!collapsedCategories[id]"

                    :display="display"
                    :items="category.items"
                    :checked-items="checkedItems"

                    :marked-items="markedItems"
                    :mark-name="markName"

                    :show-image="!category.hideImage"
                    :show-name="!category.hideName"

                    :selected="selected"
                    @item-click="itemClick"
                    @item-rick-click="$emit('itemRickClick', $event as CosmeticType)"
                />
            </li>
        </ul>

        <div v-else-if="displayType == 'all'" class="list">
            <PanelCosmeticsItems
                :display="display"
                :items="(items as CosmeticType[])"
                :checked-items="checkedItems"

                :marked-items="markedItems"
                :mark-name="markName"

                :show-image="!hideImage"
                :show-name="!hideName"

                :selected="selected"
                @item-click="itemClick"
                @item-rick-click="$emit('itemRickClick', $event as CosmeticType)"
            />
        </div>
    </div>
</template>

<style lang="sass">
.cosmetics-list
    width: 100%

    .categories
        display: flex
        flex-direction: column
        align-items: stretch
        
        > li
            position: relative
            .category-title
                position: sticky
                top: 0

                padding: 5px 10px
                background: #c1c8e8

                display: flex
                justify-content: space-between
                align-items: center

                cursor: pointer
                user-select: none

                z-index: 2

                +hover
                    background: color-mix(in srgb, #c1c8e8 80%, white)

                    h3
                        color: #6f707f

                    .opts
                        color: #6f707f

                        .caret
                            --tex-color: #858c99 !important

                h3,
                .opts .count
                    font-family: $font-bold
                    font-weight: 400
                    font-size: 24px
                    text-transform: uppercase
                    color: #454658

                .opts
                    display: flex
                    align-items: center
                    gap: 10px


    .list
        .cosmetics-items
            padding: 0
</style>

<script lang="ts">
export type CosmeticItem = {
    id: string,
    name?: string,
    rarity: Rarity,

    image?: string,
    owned?: boolean,
    tooltip?: TooltipBinding
}
export type Category<CosmeticType> = {
    name: string,
    collapsible?: boolean,
    showCount?: boolean|'no-owned',
    hideName?: boolean,
    hideImage?: boolean,

    items: CosmeticType[]
};
export type CategorizedCosmeticItemRecord<CosmeticType extends CosmeticItem> = 
    Record<string, Category<CosmeticType>>;
</script>

<script setup lang="ts" generic="CosmeticType extends CosmeticItem">
import type { Rarity } from '~/assets/data/common';
import type { TooltipBinding } from '~/directives/tooltip';

const props = defineProps<{
    display: 'list'|'grid',
    items: CosmeticType[]|CategorizedCosmeticItemRecord<CosmeticType>,
    checkedItems?: string[],

    markedItems?: string[],
    markName?: string,

    showCount?: boolean|'no-owned',
    hideName?: boolean,
    hideImage?: boolean,
}>();

const emit = defineEmits<{
    itemClick: [item: CosmeticType],
    itemRickClick: [item: CosmeticType]
}>();

const displayType = computed<'categorized'|'all'>(() =>
    Array.isArray(props.items) ? 'all' : 'categorized'
);

const collapsedCategories = ref<Record<string, boolean>>({});
watch([() => props.items, () => props.display], () => collapsedCategories.value = {});

function tryCollapseCategory(id: string, category: Category<any>) {
    if (!category.collapsible)
        return;

    collapsedCategories.value[id] = !collapsedCategories.value[id];
}

const selected = defineModel<string|Set<string>>({ required: false });

function itemClick(item: CosmeticItem) {
    if (selected.value instanceof Set) {
        if (selected.value.has(item.id))
            selected.value.delete(item.id)
        else
            selected.value.add(item.id)
    }
    else
        selected.value = item.id;

    emit('itemClick', item as CosmeticType);
}

</script>