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
            <div v-if="collectionsStore.length" class="create-wrapper">
                <FormButton to="/costumes?create-collection=1" size="tiny" color-scheme="dark">
                    <Tex
                        image="plus"

                        width="20px"
                        height="20px"
                    />
                    NEW COLLECTION
                </FormButton>
            </div>

            <ClientOnly>
                <PanelCollectionList
                    v-if="collectionsStore.length"

                    :collections="collectionsStore"
                    :costumes-by-id="costumesById"
                />
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

            <template v-if="officialCollections.length">
                <h2>OFFICIAL COLLECTIONS</h2>
                <PanelCollectionList
                    v-if="collectionsStore.length"

                    :collections="officialCollections"
                    :costumes-by-id="costumesById"
                />
            </template>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.costume-collections-page
    padding-top: 30px
    overflow-x: hidden
    
    +media-desktop
        padding-top: 30px + 40px
        
    .mobile-title
        h1
            font-size: 35px

    .mobile-separator
        margin-bottom: 60px
    
    .container
        display: flex
        align-items: end
        flex-direction: column
        gap: 60px

        +media-mobile
            align-items: center

        .create-wrapper
            +media-desktop
                padding-right: 30px

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

        h2
            align-self: center
            margin-top: 40px
            margin-bottom: 20px

            font-family: $font-heavy
            font-weight: 400
            font-size: 48px
            text-align: center
            line-height: 1
            color: $blue

            +media-mobile
                font-size: 38px

</style>

<script setup lang="ts">
import { CostumeCollectionStoreSchema, getCostumesAsList, OFFICIAL_COLLECTIONS, type CostumeCollection } from '~/assets/data/cosmetics/costumes/costumes';

const title = `Costume Collections | MR Proficiency Calculator`;
useSeoMeta({
    title
});

const collectionsStore = useLocalStorage('costume_collections', [], CostumeCollectionStoreSchema);
const costumesById = Object.fromEntries(getCostumesAsList().map(c => [c.id, c]));

const officialCollections = Object.entries(OFFICIAL_COLLECTIONS()).map(([id, col]) => ({ ...col, link: `/costumes?collection=${id}` }));
</script>