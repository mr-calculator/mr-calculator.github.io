<template>
    <div
        v-for="item in props.items"
        :key="(item as any)[keyFieldId as any]"

        :class="`v-item-container-${containerId}`"
        :data-id="(item as any)[keyFieldId as any]"
    >
        <slot
            v-if="visible.has((item as any)[keyFieldId as any])"
            :item="item"
        />
        <div
            v-else
            class="placeholder"
            :style="placeholderSize"
        />
    </div>
</template>

<script setup lang="ts" generic="TItem">
type KeyValue = string | number;
type KeyFieldResolver<TItem = unknown> = (item: TItem, index: number) => KeyValue;
type KeyFieldValue<TItem = unknown> = string | KeyFieldResolver<TItem>;

const props = defineProps<{
    items: TItem[],
    itemSize: { width?: number, height: number },
    keyFieldId: KeyFieldValue<TItem>,
}>();

const placeholderSize = computed(() => {
    const width = props.itemSize.width;
    const height = props.itemSize.height;

    return {
        width: width ? width + 'px' : undefined,
        height: height + 'px'
    }
})

const containerId = useId();

const visible = reactive(new Set<string>(
    // populate visible with all items for ssr and seo
    props.items.map(item => (item as any)[props.keyFieldId as any]) 
));

let intersectionObserver: IntersectionObserver;
onMounted(() => {
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = (entry.target as HTMLElement).dataset.id!;
            
            if (entry.isIntersecting)
                visible.add(id);
            // remove when out of view to save memory:
            else
                visible.delete(id);
        });
    }, {
        rootMargin: (props.itemSize.height < 200 ? 200 : props.itemSize.height) + 'px'
    }); // buffer above and below

    document.querySelectorAll(`.v-item-container-${containerId}`)
            .forEach(el => intersectionObserver.observe(el));
});

watch(() => props.items, (newItems, oldItems) => {
    const added = newItems.filter(i => !oldItems.includes(i));

    nextTick(() => added.forEach(i => {
        const el = document.querySelector(
            `.v-item-container-${containerId}[data-id="${(i as any)[props.keyFieldId as any]}"]`
        );

        if (el)
            intersectionObserver.observe(el);
    }));
})
</script>