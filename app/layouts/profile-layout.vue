<template>
    <div class="profile-layout">
        <UiNavBar
            class="navbar"

            :marks="{
                customize: !preferences.sawNameplatesPage || !preferences.sawFramesPage ? 'new' : 'none',
                _customize_nameplate: preferences.sawNameplatesPage ? 'none' : 'new',
                _customize_frame: preferences.sawFramesPage ? 'none' : 'new'
            }"

            links
            :link-map="LINK_MAP"
            :selected="routeToTabId"
        >
            <template #prepend>
                <div class="head">
                    <NuxtLink class="back-arrow" :to="backPath">
                        <Tex
                            image="chevronLeft"
                            hover="color"
                            clickable

                            width="23px"
                            height="23px"
                            object-fit="contain"
                        />
                    </NuxtLink>

                    <div class="title">
                        <h1>Profile</h1>
                    </div>

                    <div class="mobile-spacer" />
                </div>
            </template>

            <template #overview>
                Overview
            </template>
            <template #customize>
                Customize
            </template>
            <template #_customize_nameplate>
                Nameplate
            </template>
            <template #_customize_frame>
                Frame
            </template>
        </UiNavBar>

        <slot />
    </div>
</template>

<style src="@/assets/style/profile-layout.sass" scoped></style>

<script setup lang="ts">
import { DEFAULT_PREFERENCES_STORE, PreferencesStoreSchema, type PreferencesStore } from '~/assets/data/common';

const route = useRoute();

const NAV_TAB_LINKS: Record<string, string> = {
    '/profile': 'overview',
    '/profile/customize': 'customize',
    '/profile/customize/nameplate': '_customize_nameplate',
    '/profile/customize/frame': '_customize_frame'
}
const LINK_MAP = invertRecord(NAV_TAB_LINKS);

const routeToTabId = computed(() => {
    const tab = NAV_TAB_LINKS[route.path as string];
    if (!tab) {
        const pathComponents = trimFirst('/', route.path).split('/');
        if (pathComponents.length <= 1)
            return null;

        return NAV_TAB_LINKS['/profile/' + pathComponents[1]!] ?? null;
    }

    return tab;
});

const { back, backPath } = useBackButton({
    currentSection: ['/profile', '/heroes/'],
    fallback: '/'
});

const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);

</script>