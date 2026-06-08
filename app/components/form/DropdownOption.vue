<template>
    <div
        v-if="typeof option.separator === 'undefined'"
        :class="{ option: 1, selected }"

        v-tooltip="(selected && singleWord && option.label) ? ({
            text: option.label
        } satisfies TooltipBinding) : undefined"
    >
        <div class="option-content">
            <div
                v-if="option.leftIcon && (option.leftIcon.key || option.leftIcon.url)"
                class="icon"
                :style="{
                    '--img-bg': option.leftIcon.key ?
                        texUrl(option.leftIcon.key) : `url('${option.leftIcon.url}')`,
                    ...leftIconSize
                }"
            />
            <div
                :class="{
                    text: 1,
                    'single-word': singleWord
                }"
                v-html="option.label"
            />
        </div>
        <div
            :class="{icon: 1, checkmark: 1, forceShow: !!option.rightIcon}"
            :style="{
                '--img': !selected && option.rightIcon ?
                    texUrl(option.rightIcon) : texUrl('dropdownCheck')
            }"
        />
    </div>
    <div
        v-else-if="option.separator"
        :class="{separator: 1, collapsible: option.separator === 'collapsible'}"
    >
        <span v-if="option.label">
            {{ option.label }}
        </span>
        <Tex
            v-if="option.separator === 'collapsible'"

            :image="collapsed ? 'chevronDown' : 'chevronUp'"
            color="var(--light-blue-highlight)"

            width="10px"
            height="8px"
        />
    </div>
</template>

<style src="@/assets/style/components/dropdown.sass" scoped></style>

<script setup lang="ts">
import { texUrl } from '~/assets/data/textures';
import { leftIconSizeToCSS, type Option } from './Dropdown.vue';
import type { TooltipBinding } from '~/directives/tooltip';

const props = defineProps<{
    option: Option,
    selected: boolean,
    /**
     * Only for separators
     */
    collapsed?: boolean
}>();

const leftIconSize = computed(() =>
    leftIconSizeToCSS(props.option)
);

const singleWord = computed(() => (props.option.label?.split(/([^A-Za-z0-9])/g).length ?? 0) <= 1);
</script>