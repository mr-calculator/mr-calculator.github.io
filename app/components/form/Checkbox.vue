<template>
    <label
        :class="['checkbox', `size-${size}`, `theme-${colorScheme}`]"
        :for="id"
    >
        <input
            :id="id"
            type="checkbox"

            :checked="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement)?.checked)"
        />

        <div v-if="$slots.default && appendSlot" class="slot">
            <slot />
        </div>
        <div class="checkmark">
            <Tex
                class="normal"
                image="checkbox"

                width="100%"
                height="100%"
            />
            <Tex
                class="hover"
                image="checkbox"
                state="hover"

                width="100%"
                height="100%"
            />
            <Tex
                class="check"
                image="checkboxCheck"

                width="100%"
                height="100%"
            />
        </div>

        <div v-if="$slots.default && !appendSlot" class="slot">
            <slot />
        </div>
    </label>
</template>

<style lang="sass" scoped>
.checkbox
    display: flex
    align-items: center
    gap: 10px

    cursor: pointer
    user-select: none
    -webkit-user-drag: none

    border: 5px solid transparent

    +hover
        background: $light
        outline: 3px solid $light-blue-highlight

        .slot
            color: $light-blue

        .checkmark .texture
            &.normal
                display: none
            &.hover
                display: block

    &.size-medium
        .checkmark
            width: 30px
            height: 30px

        .slot
            font-size: 24px

    &.size-small
        .checkmark
            width: 25px
            height: 25px

        .slot
            font-size: 20px

    // theme-light is default
    &.theme-dark
        +hover
            .slot
                color: #5b75bb

        .slot
            color: $light-blue-highlight

    input
        position: absolute
        left: -99999px

        &:checked + .checkmark,
        &:checked + .slot + .checkmark
            .texture.check
                display: block

    .checkmark
        flex-shrink: 0
        position: relative
        width: 35px
        height: 35px

        .texture
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%

            -webkit-user-drag: none

            &.hover
                display: none
            &.check
                display: none
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)
                width: 25px
                height: 25px

    .slot
        font-size: 26px
        font-family: $font-bold
        font-weight: 400
        color: $light

</style>

<script setup lang="ts">
withDefaults(defineProps<{
    size?: 'large'|'medium'|'small',
    colorScheme?: 'light'|'dark',
    modelValue: boolean,
    appendSlot?: boolean
}>(), {
    modelValue: false
})

defineEmits<{
    'update:modelValue': [state: boolean],
}>();

const id = useId();

</script>