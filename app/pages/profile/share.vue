<template>
    <div class="profile-share">
        <div v-if="!sheetData || error" class="broken">
            <Tex
                image="chainBroken"
                color="var(--blue)"

                width="52px"
                height="44px"
            />
            Uh-oh, looks like this link is broken... We're sorry.
        </div>
        <img
            v-else-if="profileSheetUrl"
            :src="profileSheetUrl !== 'loading'
                ? profileSheetUrl
                : tex('pageLoadingBg')
            "
        />

        <div class="cta">
            <FormButton size="small" to="/">
                Check out the Calculator!
            </FormButton>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.profile-share
    position: relative
    width: 100%
    height: var(--u100vh)

    display: flex
    justify-content: center
    align-items: center

    background: var(--tex-lordsBackground) 0 0 no-repeat
    background-size: cover

    .broken
        width: 100%
        max-width: 600px
        height: 100%
        max-height: 200px

        display: flex
        justify-content: center
        align-items: center
        gap: 20px

        font-family: $font-bold
        font-size: 28px
        color: $blue
        text-align: center

        background: $light

        .texture
            transform: rotate(-30deg)

    img
        width: 100%
        height: 100%
        object-fit: contain

    .cta
        position: absolute
        bottom: 0
        left: 50%
        transform: translateX(-50%)

        .button
            max-width: 100vw
            font-family: $font-heavy
</style>

<script setup lang="ts">
import { parseProfileSheetData } from '~/assets/data/common';
import { tex } from '~/assets/data/textures';
import { generateProfileSheet } from '~/services/generate-profile-sheet';

definePageMeta({
    layout: 'no-layout'
});

useDeveloperLetterOptions().setDisplay(false);

const route = useRoute();
const sheetData = computed(() => route.query.s as string);

const profileSheetUrl = ref<string|null>(null);
const error = ref(false);
async function createProfileSheet() {
    if (!sheetData.value)
        return;

    const parsed = await parseProfileSheetData(sheetData.value);
    if (!parsed) {
        error.value = true;
        return;
    }

    const who = safeFilename(parsed.profile.name);
    const possesive = who.endsWith('s') ? '\'' : '\'s';
    useSeoMeta({
        title: `${who}${possesive} Profile | MR Proficiency Calculator`
    })

    profileSheetUrl.value = 'loading';
    const blob = await generateProfileSheet(parsed);
    const url = URL.createObjectURL(blob);

    if (profileSheetUrl.value)
        URL.revokeObjectURL(profileSheetUrl.value);

    profileSheetUrl.value = url;
}

onMounted(createProfileSheet);
</script>