<template>
    <div ref="dropdown" :class="{dropdown: 1, small}">
        <div class="option current" @click="expanded = !expanded">
            <div class="option-content" v-html="currentOptionLabel ?? ''"/>
            <div
                class="icon"
                :style="{'--img': texUrl('dropdownCaret')}"
            />
        </div>
        <div v-if="expanded" class="options">
            <template
                v-for="option in options"
                :key="option.value ?? randomId()"
            >
                <div
                    v-if="!option.separator"
                    :class="{ option: 1, selected: isSelected(option) }"
                    @click="optionClick(option)"
                >
                    <div class="option-content" v-html="option.label"/>
                    <div
                        class="icon checkmark"
                        :style="{'--img': texUrl('dropdownCheck')}"
                    />
                </div>
                <div v-else class="separator">
                    <span v-if="option.label">
                        {{ option.label }}
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.dropdown
    position: relative
    width: 250px
    height: 50px

    background: $light-blue

    cursor: pointer
    user-select: none

    +media-desktop
        width: 350px
        height: 60px

    &:hover
        background: $light-blue-highlight

    &.small
        width: 200px
        height: 45px

        .option
            &.current
                padding: 0 10px

            .option-content
                font-size: 18px
                line-height: 18px
        

    .options
        position: absolute
        top: 100%
        left: 0

        width: 100%
        max-height: 75vh
        background: $gray

        display: flex
        flex-direction: column

        overflow-x: hidden
        overflow-y: auto

        z-index: 15

        +scrollbar(5px, $gray, $light-blue, $blue)

        +media-desktop
            max-height: 600px

        .option
            flex-shrink: 0

            position: relative
            height: auto !important
            min-height: 60px

            &:hover
                background: var(--tex-dropdownHover) no-repeat
                background-size: 100% 100%

        .option:not(:last-of-type)::before
            content: ""
            position: absolute
            left: 50%
            bottom: 0

            transform: translate(-50%, 1px)
            width: calc(100% - 20px)
            height: 0
            border: 2px solid $light-blue-highlight

            +media-desktop
                width: calc(100% - 40px)

        .separator
            flex-shrink: 0

            position: relative
            width: 100%
            min-height: 15px

            padding: 5px 10px

            cursor: default

            +media-desktop
                padding: 10px 20px

            &:not(:first-of-type)
                padding-top: 20px

            &::before
                content: ""
                position: absolute
                left: 50%
                bottom: 0

                transform: translate(-50%, 1px)
                width: 100%
                height: 0
                border: 2px solid $light-blue-highlight

            span
                font-size: 16px
                color: $light-blue-highlight

    .option
        width: 100%
        height: 60px
        padding: 5px 10px
        
        display: flex
        justify-content: space-between
        align-items: center

        +media-desktop
            height: 60px
            padding: 10px 20px

        &.selected
            .option-content
                color: $color

            .checkmark
                display: block

            .icon,
            ::v-deep(.icon)
                background: var(--img-bg, #{$color})

                img
                    display: none

        &.current
            height: 100%
            padding: 0 20px
            align-items: center

        .option-content
            display: flex
            align-items: center
            gap: 15px

            font-family: MRBody
            font-size: 18px
            color: $light

            +media-desktop
                font-size: 22px

            ::v-deep(img)
                width: 32px
                height: 32px
                object-fit: contain

        .icon,
        ::v-deep(.icon)
            flex-shrink: 0
            
            width: var(--width, 40px)
            height: var(--height, var(--width, 40px))

            mask: var(--img) no-repeat
            mask-size: 100%
            mask-position: center

            background: var(--img-bg, #fff)
            background-size: 100%
            background-position: center

        .checkmark
            flex-shrink: 0

            display: none

            width: 30px
            height: 30px


</style>

<script lang="ts">
export interface Option {
    label?: string,
    value?: string,
    whenCurrentLabel?: string,

    separator?: boolean
}
</script>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { texUrl } from '~/assets/data/textures';

const props = defineProps<{
    small?: boolean,
    options: Option[],
    multi?: boolean,
    placeholder?: string,
}>()

const model = defineModel<string|string[]>();
const currentOptionLabel = computed(() => {
    if (!props.multi && !Array.isArray(model.value)) {
        const option = props.options.find(o => o.value == model.value);
        return option?.whenCurrentLabel ?? option?.label ?? option?.value ?? '<unknown>';
    }

    const selected = props.options.filter(o => (model.value as string[])?.includes(o.value!));
    if (selected.length === 0)
        return props.placeholder ?? 'ALL';
    if (selected.length === 1)
        return selected[0]!.whenCurrentLabel ?? selected[0]!.label;

    return `${selected.length} SELECTED`;
});

const expanded = ref(false);

const dropdown = useTemplateRef<HTMLElement>('dropdown');
onClickOutside(dropdown, _ => expanded.value = false);

function isSelected(option: Option) {
    if (!props.multi && !Array.isArray(model.value))
        return model.value == option.value;
    else if (props.multi && Array.isArray(model.value)) {
        return model.value.includes(option.value!)
    }

    return false;
}

function optionClick(option: Option) {
    if (!props.multi && !Array.isArray(model.value)) {
        model.value = option.value;
        expanded.value = false;
    }
    else if (props.multi && Array.isArray(model.value)) {
        const next = [...model.value];
        const optIndex = next.indexOf(option.value!);

        if (optIndex == -1)
            next.push(option.value!);
        else
            next.splice(optIndex, 1);

        model.value = next;
    }
}

</script>