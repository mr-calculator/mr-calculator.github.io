<template>
    <div class="corners">
        <Tex
            v-if="leftTop"
            class="left-top"
            image="cornerDecoLeftTop"
            color="var(--light)"

            width="60px"
            height="60px"
            object-fit="contain"
        />
        <Tex
            v-if="leftBottom"
            class="left-bottom"
            image="cornerDecoLeftBottom"
            color="var(--light)"

            width="60px"
            height="60px"
            object-fit="contain"
        />
        <Tex
            v-if="rightTop"
            class="right-top"
            image="cornerDecoRightTop"
            color="var(--light)"

            width="60px"
            height="60px"
            object-fit="contain"
        />
        <Tex
            v-if="rightBottom"
            class="right-bottom"
            image="cornerDecoRightBottom"
            color="var(--light)"

            width="60px"
            height="60px"
            object-fit="contain"
        />
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    leftTop?: boolean,
    leftBottom?: boolean,
    rightTop?: boolean,
    rightBottom?: boolean
}>(), {
    leftTop: true,
    leftBottom: true,
    rightTop: true,
    rightBottom: true,
})

</script>