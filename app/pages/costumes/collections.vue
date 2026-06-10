<template>
    <div class="costume-collections-page simple-page">
        <div class="bg-panes" />
        
        <div class="mobile-title dark">
            <h1>
                Collections
            </h1>
        </div>
        <UiSeparator class="mobile-separator with-spacing" dark />

        <div class="container">
            <ClientOnly>
                <div v-if="collectionsStore.length" class="collections">
                    <NuxtLink
                        v-for="collection, idx in collectionsStore"
                        :key="collection.title + idx"

                        class="collection"
                        :to="collectionLink(collection)"
                    >
                        <div
                            v-for="skin, i in collection.items.slice(0, mobile ? 3 : 6)"
                            class="skin"
                            :style="{
                                '--image': `url(${skinImage(skin)})`,
                                '--index': i,
                                '--height-diff': (10 * (
                                    isPastHalf(i, (mobile ? 3 : 6))
                                        ? (mobile ? 2 : 5) - i
                                        : i
                                )) + 'px',
                                zIndex: isPastHalf(i, (mobile ? 3 : 6))
                                    ? i
                                    : (mobile ? 3 : 6) - i
                            }"
                        >
                            <img
                                :src="skinImage(skin)"
                                :alt="costumesById[skin]!.name"
                            />
                        </div>

                        <div class="bar">
                            <h3 class="title">{{ collection.title }}</h3>
                            <Tex
                                v-if="!!collection.owner"
                                image="userId"

                                width="20px"
                                height="20px"
                            />
                        </div>
                    </NuxtLink>
                </div>
                <div v-else class="no-collections">
                    <p>You haven't created any collections</p>
                    <FormButton
                        size="tiny"
                        to="/costumes?create-collection=1"
                    >
                        Make a collection
                    </FormButton>
                </div>
            </ClientOnly>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.costume-collections-page
    overflow-x: hidden
    
    +media-desktop
        padding-top: 80px + 40px
        
    .mobile-title
        h1
            font-size: 35px

    .mobile-separator
        margin-bottom: 60px
    
    .container
        .collections
            position: relative
            width: 100%
            height: auto

            display: flex
            flex-wrap: wrap
            justify-content: center
            align-items: center
            gap: 60px

            .collection
                position: relative
                --width: 250px
                width: var(--width)
                height: 225px
                background: var(--tex-heroCardFeatured) no-repeat
                background-size: 100% 100%

                cursor: pointer
                transition: .1s ease-out

                +media-tablet
                    --width: 400px

                +media-desktop
                    --width: 600px

                +hover
                    transform: scale(1.03)

                    z-index: 8

                    &::before
                        content: ""
                        position: absolute
                        top: 0
                        left: 0
                        width: 100%
                        height: 100%
                        background: $color

                        mask: var(--tex-heroCardFeatured) no-repeat
                        mask-size: 100% 100%

                        mix-blend-mode: color

                        +mediaIOS
                            opacity: 0.5

                    .skin
                        &::before
                            left: -6px
                        &::after
                            left: -12px

                @mixin bg-mask($position: bottom)
                    mask: var(--tex-heroCardFeatured) no-repeat
                    mask-size: var(--width) 225px
                    mask-position: $position

                .skin
                    position: absolute
                    top: calc(-40px - var(--height-diff))
                    left: calc(var(--width) / 6 / 2 + (var(--width) / 6 * var(--index)))
                    transform: translateX(-50%)

                    width: 200px

                    display: flex
                    justify-content: center
                    align-items: center

                    mask: var(--tex-heroDisplayMask)
                    mask-size: 100% 100%
                    mask-position: 0

                    +media-mobile
                        left: calc(var(--width) / 3 / 2 + (var(--width) / 3 * var(--index)))

                    &::before
                        content: ""
                        position: absolute
                        top: 0
                        left: -3px
                        width: 100%
                        height: 100%
                        mask-image: var(--image)
                        mask-size: 100% 100%

                        background: #fff

                        transition: left .05s ease-out
                        z-index: -1

                    &::after
                        content: ""
                        position: absolute
                        left: -6px
                        width: 100%
                        height: 100%
                        mask-image: var(--image)
                        mask-size: 100% 100%

                        background: $color

                        transition: left .05s ease-out
                        z-index: -2

                    img
                        display: block
                        width: 100%

                .bar
                    position: absolute
                    bottom: 0
                    left: 0
                    width: 100%
                    height: 50px

                    padding: 0 40px 0 20px
                    background: $dark

                    +bg-mask
                    mask-size: calc(var(--width) + 2px) 225px

                    display: flex
                    justify-content: space-between
                    align-items: center

                    z-index: 8

                    +media-mobile
                        padding: 0 30px 0 20px

                    .title
                        width: 100%

                        font-family: $font-heavy
                        font-size: 22px
                        font-weight: 400
                        color: $light
                        text-transform: uppercase

                        overflow: hidden
                        text-overflow: ellipsis
                        white-space: nowrap

        .no-collections
            width: 100%
            height: 100%

            display: flex
            flex-direction: column
            justify-content: center
            align-items: center
            gap: 25px

            padding-top: 20px

            +media-mobile
                min-height: 80vh

            p
                font-family: $font-heavy
                font-size: 22px
                text-transform: uppercase
                text-align: center
                color: $blue

</style>

<script setup lang="ts">
import { CostumeCollectionStoreSchema, getCostumesAsList, type CostumeCollection } from '~/assets/data/cosmetics/costumes/costumes';

const title = `Costume Collections | MR Proficiency Calculator`;
useSeoMeta({
    title
});

const mobile = isMobile();

const collectionsStore = useLocalStorage('costume_collections', [], CostumeCollectionStoreSchema);

const costumesById = Object.fromEntries(getCostumesAsList().map(c => [c.id, c]));

function isPastHalf(idx: number, length: number) {
    return idx >= Math.floor(length / 2);
}
function skinImage(skinId: string) {
    return `/img/heroes/data/${costumesById[skinId]!.heroId}/costumes/${skinId}_200.webp`;
}

function collectionLink(collection: CostumeCollection) {
    return `/costumes?collection=${toBase64(JSON.stringify(collection))}`;
}
</script>