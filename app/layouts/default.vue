<template>
    <div class="layout">
        <UiNavBar
            ref="nav-bar"
            class="app-nav"
            :breakpoint="800"
            :marks="{
                heroes: 'special',

                achievements: preferences.sawAchievementsPage ? 'none' : 'new',
                costumes: preferences.sawCostumesPage ? 'none' : 'new',

                // this will not apply to anything, but will make the hamburger menu show the excl mark for the profile append
                ___profile: !preferences.sawNameplatesPage || !preferences.sawFramesPage ? 'new' : 'none'
            }"

            :transparent="!safari"
            full-width

            :selected="routeToTabId"

            links
            :link-map="{
                home: '/',
                _costumes_all: '/costumes'
            }"
        >
            <template #prepend>
                <NuxtLink to="/" class="logo">
                    <Tex
                        image="logo"

                        width="65px"
                        height="65px"

                        object-fit="contain"
                    />
                    <h2 class="marvel">
                        MR
                    </h2>
                    <h2 class="calc">
                        <span>PROFICIENCY</span>
                        <span>CALCULATOR</span>
                    </h2>
                </NuxtLink>
            </template>

            <template #home>
                <div class="home">
                    <Tex
                        image="logo"

                        width="70px"
                        height="70px"

                        object-fit="contain"
                    />
                    Home
                </div>
            </template>
            <template #heroes>
                Heroes
            </template>
            <template #achievements>
                Achievements
            </template>
            <template #costumes>
                Costumes
            </template>
            <template #_costumes_all>
                All
            </template>
            <template #_costumes_collections>
                Collections
            </template>

            <template #append v-if="shouldShowAppend">
                <div class="currency-list">
                    <div
                        class="currency"
                        v-tooltip="({
                            text: 'Your Total <b>Proficiency Points</b>'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            image="proficiencyIcon"

                            width="28px"
                            height="28px"
                        />
                        <ClientOnly>
                            <span>
                                {{ totalPoints.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
                            </span>
                            <template #fallback>
                                —
                            </template>
                        </ClientOnly>
                    </div>
                </div>
                <div class="icons">
                    <NuxtLink
                        class="icon"
                        to="/download"
                        active-class="selected"

                        @click="navBar?.closeMenu()"
                        
                        v-tooltip="({
                            text: '<b>Download</b> your data'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            image="download"
                            color="#bcc0cd"

                            width="25px"
                            height="25px"
                        />
                    </NuxtLink>
                    <NuxtLink
                        class="icon"
                        to="/import"
                        active-class="selected"

                        @click="navBar?.closeMenu()"

                        v-tooltip="({
                            text: '<b>Import</b> data'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            image="upload"
                            color="#bcc0cd"

                            width="25px"
                            height="25px"
                        />
                    </NuxtLink>
                    <a
                        class="icon"
                        :href="appConfig.discordServer"
                        active-class="selected"

                        v-tooltip="({
                            text: 'Join the <b>Discord Server</b>'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            image="discordIcon"
                            color="#bcc0cd"

                            width="25px"
                            height="25px"
                        />
                    </a>
                </div>
                <div
                    :class="{
                        'profile-icon-wrapper': 1,
                        'warning-wrapper': !preferences.sawNameplatesPage || !preferences.sawFramesPage
                    }"
                >
                    <UiProfileIcon />

                    <ClientOnly>
                        <Tex
                            v-if="!preferences.sawNameplatesPage || !preferences.sawFramesPage"
                            class="warning-bubble"
                            image="redDotExcl"

                            object-fit="contain"
                        />
                    </ClientOnly>
                </div>
            </template>
            <template #append v-else>
                <ClientOnly>
                    <div class="large-device-menu-icon-wrapper">
                        <div class="menu-icon" @click="menuOpen = !menuOpen">
                            <Tex
                                :image="menuOpen ? 'cross' : 'hamburger'"
                                color="#fff"

                                clickable
                                :width="menuOpen ? 25 : 28"
                                height="25px"
                            />
                        </div>
                    </div>
                </ClientOnly>
            </template>
        </UiNavBar>

        <slot />

        <Footer />

        <Teleport to="body">
            <div v-if="!shouldShowAppend && menuOpen" class="append-menu">
                <div class="currency-list">
                    <div
                        class="currency"
                        v-tooltip="({
                            text: 'Your Total <b>Proficiency Points</b>'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            image="proficiencyIcon"

                            width="28px"
                            height="28px"
                        />
                        <ClientOnly>
                            <span>
                                {{ totalPoints.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
                            </span>
                            <template #fallback>
                                —
                            </template>
                        </ClientOnly>
                    </div>
                </div>
                <div class="icons">
                    <NuxtLink
                        class="icon"
                        to="/download"
                        active-class="selected"

                        v-tooltip="({
                            text: '<b>Download</b> your data'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            image="download"
                            color="#bcc0cd"

                            width="25px"
                            height="25px"
                        />
                    </NuxtLink>
                    <NuxtLink
                        class="icon"
                        to="/import"
                        active-class="selected"

                        v-tooltip="({
                            text: '<b>Import</b> data'
                        } satisfies TooltipBinding)"
                    >
                        <Tex
                            image="upload"
                            color="#bcc0cd"

                            width="25px"
                            height="25px"
                        />
                    </NuxtLink>
                </div>
                <div
                    :class="{
                        'profile-icon-wrapper': 1,
                        'warning-wrapper': !preferences.sawNameplatesPage || !preferences.sawFramesPage
                    }"
                >
                    <UiProfileIcon />

                    <ClientOnly>
                        <Tex
                            v-if="!preferences.sawNameplatesPage || !preferences.sawFramesPage"
                            class="warning-bubble"
                            image="redDotExcl"

                            object-fit="contain"
                        />
                    </ClientOnly>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style src="@/assets/style/layout.sass" scoped></style>

<script setup lang="ts">
import { calcTotalXp, PreferencesStoreSchema, type PlayerHeroStore, type PreferencesStore, DEFAULT_PREFERENCES_STORE } from '~/assets/data/common';
import appConfig from '~/composables/config';
import type { TooltipBinding } from '~/directives/tooltip';

const route = useRoute();

const NAV_TAB_LINKS: Record<string, string> = {
    '/': 'home',
    '/heroes': 'heroes',
    '/achievements': 'achievements',
    '/costumes': '_costumes_all',
    '/costumes/collections': '_costumes_collections'
}

const routeToTabId = computed(() => {
    if (route.path == '/costumes' && !!route.query.collection)
        return 'costumes';

    const tab = NAV_TAB_LINKS[route.path as string];
    if (!tab) {
        const pathComponents = trimFirst('/', route.path).split('/');
        if (!pathComponents.length)
            return null;

        return NAV_TAB_LINKS['/' + pathComponents[0]!] ?? null;
    }

    return tab;
});

const navBar = useTemplateRef('nav-bar');

const safari = ref(false)
onMounted(() => {
    if (import.meta.server)
        return;

    safari.value = isSafari();
});

const preferences = useLocalStorage<PreferencesStore>('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);

const totalPoints = computed(() => {
    const allHeroStores = useAllHeroStores();

    return allHeroStores.value.reduce((sum, current) => {
        return sum + calcTotalXp(current.level, current.points)
    }
    , 0);
});

const screenDimensions = useScreenDimensions();

const showAppend = ref(false);
const shouldShowAppend = computed(() => {
    if (screenDimensions.value.width < 800 || screenDimensions.value.width > 1200)
        return true;

    return showAppend.value;
});

const menuOpen = ref(false);
</script>