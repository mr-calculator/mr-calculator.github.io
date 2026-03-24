<template>
    <div
        :class="{toggle: 1, both, large}"
        @click="toggle"
    >
        <div
            v-if="!model || both" 
            :class="{state: 1, off: 1, selected: !model}"
            @click="model = false"
        >
            <slot
                v-if="$slots.off"
                name="off"
            />
            <Tex
                v-else
                image="crossBlue"

                width="22px"
                height="22px"
            />
        </div>
        <div
            v-if="model || both"
            :class="{state: 1, on: 1, selected: model}"
            @click="model = true"
        >
            <slot
                v-if="$slots.on"
                name="on"
            />
            <Tex
                v-else
                image="checkBlue"

                width="22px"
                height="22px"
            />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.toggle
    width: auto
    display: inline-grid
    grid-template-columns: 1fr 1fr
    
    background: #a8b0d4
    border: 3px solid transparent
    outline: 3px solid transparent

    cursor: pointer
    user-select: none

    &:hover
        background: #c3cbed
        border: 3px solid #cdd4ea
        outline: 3px solid #e6eaf4

        .state
            border: 3px solid #fff

    &.large
        .state
            min-height: 48px
            padding: 5px 20px
            
    
    &.both
        gap: 5px

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

        font-family: RefrigeratorDeluxeBold
        font-size: 20px
        color: #48577f
        text-transform: uppercase
        text-align: center

        &.off
            grid-column: 1 / 2
        &.on
            grid-column: 2 / 3

        ::v-deep(img)
            width: 22px

            -webkit-user-drag: none


</style>


<script setup lang="ts">
const props = defineProps<{
    large?: boolean,
    both?: boolean
}>();

const model = defineModel<boolean>({ default: false });

function toggle() {
    if (props.both)
        return;

    model.value = !model.value;
}
</script>