<template>
    <div
        :class="{toggle: 1, large, small}"
    >
        <div
            v-for="(slot, id) in $slots"
            :class="{state: 1, selected: model == id}"
            @click="model = id"
        >
            <slot
                :name="id"
            />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.toggle
    width: auto
    display: inline-flex
    
    background: #a8b0d4
    border: 3px solid transparent
    outline: 3px solid transparent

    cursor: pointer
    user-select: none

    +hover
        background: #c3cbed
        border: 3px solid #cdd4ea
        outline: 3px solid #e6eaf4

        .state
            border: 3px solid #fff

            ::v-deep(.texture)
                --tex-color: #{$light-blue} !important

    &.large
        .state
            min-height: 48px
            padding: 5px 20px

    &.small
        .state
            min-width: 60px
            min-height: 25px
            

    .state:not(.selected)
        border: 3px solid transparent
        background: transparent
        color: $blue-highlight

    .state
        min-width: 110px
        min-height: 37px
        padding: 5px 10px
        background: #edf4ff
        border: 3px solid #595f82

        display: flex
        justify-content: center
        align-items: center

        font-family: $font-bold
        font-size: 20px
        color: #48577f
        text-transform: uppercase
        text-align: center

        +hover
            ::v-deep(.texture)
                --tex-color: #{$blue-highlight} !important


        ::v-deep(img)
            width: 22px

            -webkit-user-drag: none

        &.selected
            ::v-deep(.texture)
                --tex-color: #{$blue-highlight} !important


</style>


<script setup lang="ts">
const props = defineProps<{
    large?: boolean,
    small?: boolean
}>();

const slots = useSlots();

const model = defineModel<string>();
</script>