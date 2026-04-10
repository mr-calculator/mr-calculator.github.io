<template>
    <ul class="switcher">
        <li
            :class="{ selected: selectedType == 'quickmatch' }"
            @click="selectedType = 'quickmatch'"
        >
            <Tex
                image="quickMatchIcon"

                width="35px"
                height="35px"
                object-fit="contain"
            />
        </li>

        <li
            :class="{ selected: selectedType == 'competitive' }"
            @click="selectedType = 'competitive'"
        >
            <Tex
                image="competitiveIcon"

                width="35px"
                height="35px"
                object-fit="contain"
            />
        </li>

        <li
            :class="{ selected: selectedType == 'arcade' }"
            @click="selectedType = 'arcade'"
        >
            <Tex
                image="arcadeIcon"

                width="35px"
                height="35px"
                object-fit="contain"
            />
        </li>
    </ul>
</template>

<style lang="sass" scoped>
.switcher
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    gap: 10px

    li
        cursor: pointer

        &:not(.selected)
            .texture ::v-deep(img)
                filter: grayscale(0.8)

        &:hover,
        &.selected
            .texture ::v-deep(img)
                filter: grayscale(0)

    .texture
        width: 35px
        display: inline-block
</style>

<script setup lang="ts">

const selectedType = defineModel<'normal'|'quickmatch'|'competitive'|'arcade'>();

</script>