<template>
    <div
        ref="dropdown"
        :class="{dropdown: 1, small, square, fitContent, [`${openedDirection}`]: 1}"
    >
        <div
            class="option current"
            @click="expanded = !expanded"

            v-tooltip="({
                text: tooltipText
            } satisfies TooltipBinding)"
        >
            <div
                :class="{
                    'option-content': 1,
                    concatenated: shouldConcatenate && ![0, 1].includes(currentOptions.length),
                }"
            >
                <template v-if="!currentOptions.length">
                    <div
                        v-if="typeof placeholder !== 'string' && !!placeholder
                           && (placeholder.leftIcon?.key || placeholder.leftIcon?.url)"
                        class="icon"
                        :style="{
                            '--img-bg': placeholder.leftIcon.key ?
                                texUrl(placeholder.leftIcon.key) : `url('${placeholder.leftIcon.url}')`,
                            ...leftIconSizeToCSS(placeholder)
                        }"
                    />
                    <div
                        v-if="!square"
                        class="text"
                        v-html="placeholderText"
                    />
                </template>
                <template
                    v-else-if="shouldConcatenate || currentOptions.length == 1"
                    v-for="(opt, idx) in currentOptions"
                >
                    <div
                        v-if="opt.leftIcon && (opt.leftIcon.key || opt.leftIcon.url)"
                        class="icon"
                        :style="{
                            '--img-bg': opt.leftIcon.key ?
                                texUrl(opt.leftIcon.key) : `url('${opt.leftIcon.url}')`,
                            ...opt.leftIconSize
                        }"
                    />
                    {{ !opt.selectedLabel && idx != currentOptions.length - 1 ? '&bull;' : '' }}
                    <div
                        v-if="opt.selectedLabel && !square"
                        :class="{
                            text: 1,
                            'single-word': opt.selectedLabel.split(/([^A-Za-z0-9])/g).length <= 1
                        }"
                        v-html="opt.selectedLabel"
                    />
                </template>
                <template v-else-if="!square">
                    <div class="text">
                        {{ currentOptions.length + ' SELECTED' }}
                    </div>
                </template>
            </div>

            <div
                v-if="!square"
                class="icon caret"
                :style="{'--img': expanded ? texUrl('dropdownCaretUp') : texUrl('dropdownCaret')}"
            />
        </div>
        <div
            v-if="
                ((mobileOverlayEnabled && !mobileOverlay) || !mobileOverlayEnabled)
             && expanded
            "
            class="options"
        >
            <div
                v-if="search"
                class="option search"
            >
                <FormSearchBox
                    ref="search-box"
                    v-model="searchText"
                    small
                />
            </div>

            <template
                v-for="option in displayOptions"
                :key="option.value ?? option.label"
            >
                <FormDropdownOption
                    v-if="!isOptionCollapsed(option.value ?? option.label)"
                    :option="option"
                    :selected="isSelected(option)"
                    :collapsed="collapsedCategories[option.value ?? option.label ?? '']"

                    @click="optionClick(option)"
                />
            </template>
        </div>

        <Teleport to="body">
            <div
                v-if="mobileOverlayEnabled && mobileOverlay && expanded"
                class="dropdown-mobile-overlay-wrapper"
                ref="dropdown-overlay"

                @click="clickOutsideOnOverlay"
            >
                <Tex
                    image="cross"
                    color="var(--light)"
                    hover="color"
                    hover-color="var(--blue)"

                    width="35px"
                    height="35px"

                    @click="expanded = false"
                />
                <div ref="dropdown-overlay-container" class="container">
                    <div class="options">
                        <div
                            v-if="search"
                            class="option search"
                        >
                            <FormSearchBox
                                ref="overlay-search-box"
                                v-model="searchText"
                                small
                            />
                        </div>

                        <template
                            v-for="option in displayOptions"
                            :key="option.value ?? option.label"
                        >
                            <FormDropdownOption
                                v-if="!isOptionCollapsed(option.value ?? option.label)"

                                :option="option"
                                :selected="isSelected(option)"
                                :collapsed="collapsedCategories[option.value ?? option.label ?? '']"

                                @click="optionClick(option)"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style src="@/assets/style/components/dropdown.sass" scoped></style>

<script lang="ts">
export type Option = {
    label?: string,
    value?: string,
    
    /**
     * Whether to change the label or show only the icon when selected
     * 
     * If left empty, default behaviour happens (shows icon + label, count or concatenate with default label)
     * 
     * `label` will work regardless of concatenate or whether there are multiple options selected
     * `showOnlyLeftIcon` Will only show the `leftIcon` if it's set and if there are multiple selected options
     */
    whenSelected?: { label: string }|{
        showOnlyLeftIcon: boolean
    },
    
    leftIcon?: {
        key?: TextureKey,
        url?: string,
        size?: number | [width?: number, height?: number],
    },
    rightIcon?: TextureKey

    separator?: boolean|'collapsible'
    /**
     * When placed on a separator, it will affect all options under it until the next separator
     */
    pushCheckedToTop?: boolean
}
export type Placeholder = Pick<Option, 'label'|'leftIcon'>;

export function leftIconSizeToCSS(opt: Option|Placeholder) {
    if (!opt.leftIcon?.size)
        return {}

    const size = opt.leftIcon.size;
    if (Array.isArray(size))
        return {
            '--width': size[0] ? size[0] + 'px' : undefined,
            '--height': size[1] ? size[1] + 'px' : undefined
        }

    return {
        '--width': size + 'px'
    }
}
</script>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { texUrl, type TextureKey } from '~/assets/data/textures';
import type { TooltipBinding } from '~/directives/tooltip';

const props = withDefaults(defineProps<{
    options: Option[],
    placeholder?: string|Placeholder,

    search?: boolean,
    pushCheckedToTop?: boolean,

    small?: boolean,
    fitContent?: boolean,
    square?: boolean,
    concatenateSelectedOptions?: boolean|number|((selected: Option[]) => { enabled: boolean, max: number }),
    mobileOverlay?: boolean,
    openedDirection?: 'up'|'down'
}>(), {
    openedDirection: 'down'
})

const model = defineModel<string|string[]>();
const expanded = ref(false);

const mobile = isMobile();
const screenDimensions = useScreenDimensions();
const mobileOverlayEnabled = computed(() =>
    mobile.value || screenDimensions.value.height < 570
)

const searchText = ref('');
const searchBox = useTemplateRef('search-box');

// ============================ CATEGORIES ===============================
// based on separators
const categories = computed(() => {
    const categories: Record<string, Option[]> = {};
    let currentCategory: string|null = null;
    props.options.forEach(opt => {
        // if separator exists or is collapsible, set category as this separator's label or value
        if (opt.separator) {
            const categoryId = opt.value ?? opt.label;
            if (!categoryId)
                return;

            categories[categoryId] = [];
            currentCategory = categoryId;

            return; // do not add category option inside itself
        }

        // if there isn't a current category, the option cannot be part of a category collapse
        if (!currentCategory)
            return;

        // add option to category
        categories[currentCategory]?.push(opt);
    });

    return categories;
});
const collapsedCategories = ref<Record<string, boolean>>({});
function findOptionCategory(valueOrLabel: string) {
    return Object.entries(categories.value).find(([_, options]) =>
        !!options.find(opt => (opt.value ?? opt.label) == valueOrLabel)
    )?.[0]
}
function isOptionCollapsed(valueOrLabel: string|undefined) {
    if (typeof valueOrLabel === 'undefined')
        return false;

    const cat = findOptionCategory(valueOrLabel);
    return cat ? collapsedCategories.value[cat] : false;
}

// ======================== FILTERING & SORTING ==========================
const filteredOptions = computed(() => {
    if (!searchText.value)
        return props.options;

    return props.options.filter(opt => {
        if (opt.separator)
            return true;

        return opt.label?.toLowerCase().includes(searchText.value.toLowerCase())
    })
});

// set sorted options to initial filtered options value
const sortedOptions = ref(filteredOptions.value.slice());
// watch filtered options change, update sorted as the order was provided
watch(filteredOptions, newOptions => sortedOptions.value = newOptions.slice());
// only when the dropdown becomes unexpanded (or on immediately after mount), sort options by checked
function modelContains(value: string) {
    if (Array.isArray(model.value))
        return model.value.includes(value);

    return model.value == value;
}
function isCheckedAndAllows(opt: Option) {
    const parentCat = findOptionCategory(opt.value ?? opt.label ?? '');
    const parentCatOpt = props.options.find(opt => (opt.value ?? opt.label) == parentCat);
    
    const categoryAllows = parentCatOpt ?
        (typeof parentCatOpt.pushCheckedToTop === 'undefined' ? 'default' : parentCatOpt.pushCheckedToTop)
        :
        'default'
    ;
    const optAllows = typeof opt.pushCheckedToTop === 'undefined' ? 'default' : opt.pushCheckedToTop;
    const isChecked = modelContains(opt.value ?? '');

    let allows = categoryAllows || optAllows;
    if (typeof categoryAllows === 'boolean' && optAllows === 'default')
        allows = categoryAllows;
    if (typeof optAllows === 'boolean')
        allows = optAllows;

    return isChecked && !!allows;
}
watch(expanded, expanded => {
    if (expanded || !props.pushCheckedToTop)
        return;

    sortedOptions.value = filteredOptions.value.toSorted((a,b) => {
        const isCheckedAndAllowsA = isCheckedAndAllows(a);
        const isCheckedAndAllowsB = isCheckedAndAllows(b);

        return sortByBool(isCheckedAndAllowsA, isCheckedAndAllowsB);
    })
}, { immediate: true });

const displayOptions = computed(() =>
    props.pushCheckedToTop ? sortedOptions.value : filteredOptions.value
);


// ========================== CURRENT OPTIONS =============================
const currentOptions = computed(() => {
    if (!model.value)
        return [];

    let selected: Option[] = [];
    if (Array.isArray(model.value))
        selected = props.options.filter(o => model.value!.includes(o.value ?? ''));
    else {
        const foundOpt = props.options.find(o => o.value == model.value);
        if (foundOpt)
            selected.push(foundOpt);
    }

    return selected.map(opt => {
        let selectedLabel: string|undefined = opt.label ?? '<unknown>';
        if (opt.whenSelected) {
            type WithLabel = Extract<Option['whenSelected'], { label: string }>;
            type WithIcon = Extract<Option['whenSelected'], { showOnlyLeftIcon: boolean }>;

            const whenSelectedLabel = (opt.whenSelected as WithLabel).label;
            const whenSelectedIcon = (opt.whenSelected as WithIcon).showOnlyLeftIcon;
            if (typeof whenSelectedLabel !== 'undefined')
                selectedLabel = whenSelectedLabel;
            else if (whenSelectedIcon && selected.length > 1)
                selectedLabel = undefined;
        }

        return {
            ...opt,
            leftIconSize: leftIconSizeToCSS(opt),
            selectedLabel
        }
    });
});
const shouldConcatenate = computed(() => {
    if (typeof props.concatenateSelectedOptions === 'undefined')
        return false;
    if (typeof props.concatenateSelectedOptions === 'boolean')
        return props.concatenateSelectedOptions;

    if (typeof props.concatenateSelectedOptions === 'function') {
        const result = props.concatenateSelectedOptions(currentOptions.value);
        return result.enabled && currentOptions.value.length <= result.max;
    }

    return currentOptions.value.length <= props.concatenateSelectedOptions;
});

const tooltipText = computed(() =>
    currentOptions.value.map(opt => opt.label).join(', ')
);

const placeholderText = computed(() => {
    if (typeof props.placeholder === 'object')
        return props.placeholder.label ?? null;

    return props.placeholder ?? 'ALL';
})

// ============================ EXPANDING ===============================

const emit = defineEmits<{
    expand: [expanded: boolean]
}>();
watch(expanded, (expanded) => {
    if (expanded && !(mobileOverlayEnabled.value && props.mobileOverlay))
        setTimeout(() => searchBox.value?.focus(), 100);

    emit('expand', expanded);
});

const dropdown = useTemplateRef<HTMLElement>('dropdown');
const dropdownOverlay = useTemplateRef<HTMLElement>('dropdown-overlay');
onClickOutside(dropdown, _ => {
    if (dropdownOverlay.value)
        return;

    expanded.value = false;
});

const dropdownOverlayContainer = useTemplateRef<HTMLElement>('dropdown-overlay-container');
function clickOutsideOnOverlay(e: PointerEvent) {
    if (!dropdownOverlayContainer.value?.contains(e.target as HTMLElement))
        expanded.value = false;
}

// ============================ UTIL ===============================

function isSelected(option: Option) {
    if (!Array.isArray(model.value))
        return model.value == option.value;
    else if (Array.isArray(model.value))
        return model.value.includes(option.value!)

    return false;
}

function optionClick(option: Option) {
    if (option.separator) {
        if (option.separator !== 'collapsible')
            return;
        if (!option.value && !option.label)
            return;

        const valueOrLabel = (option.value ?? option.label)!
        collapsedCategories.value[valueOrLabel] = !collapsedCategories.value[valueOrLabel];

        return;
    }
    

    if (!Array.isArray(model.value)) {
        model.value = option.value;
        expanded.value = false;
    }
    else if (Array.isArray(model.value)) {
        const next = [...model.value];
        const optIndex = next.indexOf(option.value!);

        if (optIndex == -1)
            next.push(option.value!);
        else
            next.splice(optIndex, 1);

        model.value = next;
    }
}

defineExpose({
    mobileOverlay: props.mobileOverlay,
    mobileOverlayEnabled,
    setExpanded(toggle: boolean) {
        expanded.value = toggle;
    }
});

</script>