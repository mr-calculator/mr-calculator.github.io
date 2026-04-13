<template>
    <div class="common-page">
        <NuxtLink to="/" class="logo-standalone">
            <Tex
                image="logo"

                width="50px"
                height="50px"

                object-fit="contain"
            />
        </NuxtLink>
        <main class="content masked">
            <div class="mask-wrapper">
                <div class="scroll-container">
                    <h1>CHANGELOG</h1>

                    <ul class="log">
                        <li
                            v-for="(log, index) in changelogEntries"
                            :key="log.version.number"
                        >
                            <div class="version">
                                <div v-if="index == 0" class="latest">LATEST</div>
                                <h3>v{{ log.version.number }}</h3>
                                <p>{{ log.version.date }}</p>
                            </div>
                            <div class="body">
                                <h2>{{ log.title }}</h2>
                                <p v-if="log.description" v-html="log.description" />
                                
                                <template v-if="hasMore(log)">
                                    <FormButton
                                        size="tiny"
                                        @click="changelogExpanded[log.version.number] = !changelogExpanded[log.version.number]"
                                    >
                                        <span v-if="!changelogExpanded[log.version.number]">
                                            SEE MORE

                                            <Tex
                                                image="chevronDown"
                                                color="var(--text-color)"

                                                width="20px"
                                                height="16px"
                                            />
                                        </span>
                                        <span v-else>
                                            SEE LESS

                                            <Tex
                                                image="chevronUp"
                                                color="var(--text-color)"

                                                width="20px"
                                                height="16px"
                                            />
                                        </span>
                                    </FormButton>
                                    <br/>
                                </template>

                                <div v-if="!changelogExpanded[log.version.number] && log.images?.length">
                                    <ul class="images presentation">
                                        <li @click="lightBoxedImage = log.images[0]">
                                            <img :src="log.images[0]" />
                                        </li>
                                    </ul>
                                </div>
                                <div v-else-if="changelogExpanded[log.version.number]" class="more">
                                    <template v-if="log.list?.length">
                                        <h3>{{ log.listTitle ?? `Changes` }}</h3>
                                        <ul class="changes">
                                            <li
                                                v-for="change in log.list"
                                                v-html="change"
                                            />
                                        </ul>
                                    </template>
                                    <ul v-if="log.images" class="images">
                                        <li
                                            v-for="image in log.images"

                                            @click="lightBoxedImage = image"
                                        >
                                            <img :src="image" />
                                        </li>
                                    </ul>

                                    <br/>
                                    <FormButton
                                        v-if="hasMore(log)"

                                        size="tiny"
                                        @click="changelogExpanded[log.version.number] = !changelogExpanded[log.version.number]"
                                    >
                                        <span>
                                            SEE LESS

                                            <Tex
                                                image="chevronUp"
                                                color="var(--text-color)"

                                                width="20px"
                                                height="16px"
                                            />
                                        </span>
                                    </FormButton>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <br/>
                    <p class="disclaimer">
                        This is a filtered changelog that covers significant changes, for all modifications head over to our
                        <a
                            :href="`https://github.com/${config.githubUser}/${config.githubRepo}/commits/main/`"
                            target="_blank"
                        >
                            GitHub Commits</a>.
                    </p>
                    <br/>
                </div>
            </div>
        </main>

        <Teleport to="body">
            <div v-if="lightBoxedImage" class="lightbox-wrapper" @click="lightBoxedImage = undefined">
                <img :src="lightBoxedImage">
            </div>
        </Teleport>
    </div>
</template>

<style lang="sass" scoped>
.disclaimer
    text-align: center

    a
        text-decoration: underline

.lightbox-wrapper
    position: fixed
    top: 0
    left: 0

    width: 100%
    height: var(--u100vh)
    
    background: #1b172eaf
    backdrop-filter: blur(5px)

    display: flex
    justify-content: center
    align-items: center

    z-index: 21

    cursor: zoom-out

    img
        width: 90%
        height: 90%

        object-fit: contain


.log
    display: flex
    flex-direction: column
    gap: 60px

    > li
        display: grid

        padding: 0 20px
        grid-template-columns: 100%
        max-width: 600px
        gap: 20px

        +media-tablet
            grid-template-columns: 200px 450px
            max-width: unset
            gap: 0

        +media-desktop
            grid-template-columns: 200px 600px

        +media-large-desktop
            grid-template-columns: 200px 700px

        .version
            display: flex
            flex-direction: column
            justify-content: start
            align-items: center
            gap: 10px
            
            h3
                background: var(--tex-promoHeroNameplate) center no-repeat
                background-size: 100% 70%
                padding: 5px 20px 9px 20px

                font-size: 28px
                color: $blue

            p
                font-size: 18px
                color: $blue

            .latest
                background: $color
                padding: 3px 10px 3px 10px
                font-family: RefrigeratorDeluxeHeavy
                color: $blue

                box-shadow: 0 1px 2px 1px rgba(0,0,0,0.2)

        .body
            width: 100%
            display: grid
            grid-template-columns: 100%
            grid-auto-rows: auto

            h2
                font-size: 44px
                text-transform: uppercase
                color: $text-color

                margin-bottom: 20px

            h3
                font-size: 28px
                text-transform: uppercase
                color: $blue

                margin-bottom: 10px

            p
                font-size: 18px
                color: $blue-accent
                text-align: justify

                margin-bottom: 30px

            .button
                justify-self: end

                span
                    display: block
                    width: 100%
                    display: flex
                    align-items: center

                    .texture
                        margin-right: 0

            .changes
                list-style-type: disc

                margin-bottom: 40px

                li
                    margin-left: 30px
                    color: $blue-accent
                    text-align: justify

            .images
                width: 100%
                display: flex
                flex-direction: column
                gap: 20px

                &.presentation
                    li
                        img
                            max-height: 300px
                            object-fit: cover

                li
                    width: 100%

                    cursor: pointer

                    img
                        width: 100%
</style>

<script setup lang="ts">
interface ChangeLogEntry {
    version: {
        number: string,
        date: string,
    },
    title: string,
    description?: string,
    listTitle?: string,
    list?: string[],
    images?: string[],
}

const changelogEntries = ref<ChangeLogEntry[]>([
    {
        version: {
            number: '1.0.0',
            date: 'Mar 25, 2026'
        },
        title: 'Initial Release',
        description: `The Marvel Rivals Proficiency Calculator allows anyone to calculate the time it takes to reach proficiency reward goals on every hero in the game. With detailed progression and the ability to type in your own stats you are guaranteed to get the most accurate estimates for your playstyle!`,
        listTitle: 'Features',
        list: [
            'All heroes in the game',
            'All rewards for every hero',
            'Calculate based on your own stats',
            'Total, per-rank, and match count time and proficiency points (gain) estimates',
            'Plan your journey to your goal using the planner',
            'Use generic stats for all heroes if you play like the Top 500',
            'Quick Match and Competitive mode estimates',
            'Progression and data is stored permanently on your device',
            'Export/Import your data across devices using .mrprof files',
            'Add heroes if they are missing'
        ],
        images: [
            '/img/seo/og-image.webp',
            '/img/changelog/v1.0.0/hero-page.webp'
        ]
    },
    {
        version: {
            number: '1.1.0',
            date: 'Mar 26, 2026'
        },
        title: 'Improved Missing Hero Feature',
        description: 'Added ability to convert a user-added missing hero to an existing hero in case it was added in the meantime',
        images: [
            '/img/changelog/v1.1.0/convert-hero.webp'
        ]
    },
    {
        version: {
            number: '1.1.1',
            date: 'Apr 9, 2026'
        },
        title: 'Improved Hero Generic Stats Visibility',
        description: 'Added the ability to see generic average stats on a hero\'s page (not only in the landing page)',
        images: [
            '/img/changelog/v1.1.1/hero-stats.webp'
        ]
    },
    {
        version: {
            number: '1.2.0',
            date: 'Apr 10, 2026'
        },
        title: 'Arcade Mode',
        description: 'Arcade Mode lets you type in your arcade stats (from any game mode, preferrably 18v18 Annihilation for fastest results) and get detailed estimates on how long it will take to get to your goal by playing arcade instead of Quick/Competitive matches.',
        listTitle: 'Features',
        list: [
            'Set your Arcade average stats per 10 minutes',
            'Personalised estimates (time and match count) for your arcade stats',
            'Planner also includes arcade mode',
            '<i>Arcade Mode <b>does not</b> have generic stats</i>'
        ],
        images: [
            '/img/changelog/v1.2.0/average-stats-modal.webp',
            '/img/changelog/v1.2.0/estimates.webp',
            '/img/changelog/v1.2.0/estimates-rank.webp',
            '/img/changelog/v1.2.0/planner.webp'
        ]
    },
    {
        version: {
            number: '1.2.1',
            date: 'Apr 13, 2026'
        },
        title: 'Added the Changelog',
        description: 'Added this very changelog. You can now see all the updates and additions to the calculator, including new heroes and other QoL changes!',
    },
    {
        version: {
            number: '1.2.2',
            date: 'Apr 14, 2026'
        },
        title: 'QoL changes and bug fixes',
        description: `Made small improvements to the home page, hero pages, and fixed a few issues.
        <br/>
        You can now quickly change your current level by pressing on it!
        `,
        list: [
            'Added "Go to hero" button in the home page under the Generic Hero Stats section',
            'Added a shortcut to changing current level on the hero page by pressing on the level header (below the hero prestige image)',
            'Fixed an issue with the sticky header of the hero list',
            'Fixed an unknown long-standing issue with the active state (on click) of the main tabs on the hero pages. Now it shows a flicker of yellow just like the game client',
            'Fixed an uncaught error with the math-enabled numerical inputs'
        ]
    }
])
changelogEntries.value.reverse();

function hasMore(entry: ChangeLogEntry) {
    return entry.list?.length || entry.images;
}

const changelogExpanded = ref<Record<string, boolean>>({});

const lightBoxedImage = ref<string|undefined>();

</script>