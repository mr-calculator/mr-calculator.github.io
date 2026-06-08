<template>
    <div :class="{ 'search-box': 1, small }">
        <input
            ref="searchInput"
            type="text"
            placeholder="Search..."

            v-bind="$attrs"

            v-model="searchText"
        />
        <div
            :class="{'search-icon-wrapper': 1, hoverable: searchText != ''}"
            @click="searchText = ''"
        >
            <Tex
                :image="searchText == '' ? 'search' : 'close'"
                color="var(--light-blue-highlight)"

                :width="small ? '20px' : '25px'"
                :height="small ? '20px' : '25px'"
                object-fit="contain"
            />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.search-box
    position: relative

    &.small
        input
            width: 100% !important
            height: 46px
            padding: 4px 37.5px 4px 10px

            font-size: 18px

            border-width: 2px !important

            +media-mobile
                font-size: 16px
                padding: 4px 37.5px 4px 10px

        .search-icon-wrapper
            width: 37.5px
            height: 50px

    input
        width: 100%
        height: 60px
        padding: 10px 60px 10px 20px
        background: #d6dcee

        border: 3px solid $light-blue-highlight
        outline: none

        font-size: 20px
        font-family: $font-body

        +media-desktop
            width: 320px

        +media-large-desktop
            width: 450px

        &::placeholder
            color: $light-blue-highlight

        &:focus
            border: 3px solid #fff

    .search-icon-wrapper
        position: absolute
        top: 0
        right: 0
        width: 60px
        height: 60px

        display: flex
        justify-content: center
        align-items: center

        &.hoverable
            cursor: pointer

            +hover
                .texture
                    --tex-color: #{$blue} !important
</style>

<script setup lang="ts">
defineProps<{
    small?: boolean
}>();

const searchInput = useTemplateRef('searchInput');

const searchText = defineModel<string>({ required: true });

defineExpose({
    focus: () => searchInput.value?.focus()
})
</script>