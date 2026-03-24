<template>
    <div class="separator">
        <Tex
            image="separatorLinesLeft"
            color="#e1e5f1"

            width="16px"
            height="16px"
            object-fit="contain"
        />
        <div class="line" />
        <Tex
            image="separatorLinesRight"
            color="#e1e5f1"

            width="16px"
            height="16px"
            object-fit="contain"
        />
    </div>
</template>

<style lang="sass" scoped>
.separator
    width: 100%
    height: 5px
    display: flex
    align-items: center
    gap: 3px

    opacity: 0.5

    user-select: none

    .line
        width: 100%
        height: 2px

        background: #e1e5f1

</style>