<template>
    <footer>
        <div class="info">
            <div class="logo">
                <img src="/img/icons/logo-large-light.webp" alt="Marvel Rivals Proficiency Calculator Logo" />
            </div>

            <p>
                This website is not affiliated with nor endorsed by NetEase Games or Marvel Entertainment.
                <br/><br/>
                All visual assets, character names, character likenesses, game logos, trademarks, and other intellectual property appearing on this site are the property of NetEase Games and/or Marvel Entertainment.
                <br/>
                Marvel Rivals™ is a trademark of NetEase Games. Marvel characters and related marks are trademarks of Marvel Entertainment, LLC. All rights reserved by their respective owners.
                <br/><br/>
                This is an unofficial fan-made tool created for the community.
            </p>
        </div>
        <ul class="pages">
            <li>
                <NuxtLink to="/heroes">HEROES</NuxtLink>
                <NuxtLink to="/achievements">ACHIEVEMENTS</NuxtLink>
                <NuxtLink to="/costumes">COSTUMES</NuxtLink>
                <NuxtLink to="/profile/customize/nameplate">NAMEPLATES</NuxtLink>
                <NuxtLink to="/profile/customize/frame">FRAMES</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/profile">PROFILE</NuxtLink>
                <NuxtLink to="/download">DOWNLOAD MY DATA</NuxtLink>
                <NuxtLink to="/import">IMPORT DATA</NuxtLink>
                <div v-if="canInstallPwa" @click="installPwa">ADD TO HOME SCREEN</div>
                <NuxtLink to="/changelog">CHANGELOG</NuxtLink>
                <a :href="`mailto:${appConfig.email}`" target="_blank">CONTACT</a>
            </li>
        </ul>
        <div class="links">
            <a class="icon" :href="`https://github.com/${appConfig.githubUser}`" target="_blank" rel="noopener noreferrer">
                <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32">
                    <path fill="currentColor" d="M10.303 16.652c-2.837-.344-4.835-2.385-4.835-5.028 0-1.074.387-2.235 1.031-3.008-.279-.709-.236-2.214.086-2.837.86-.107 2.02.344 2.708.967.816-.258 1.676-.386 2.728-.386 1.053 0 1.913.128 2.686.365.666-.602 1.848-1.053 2.708-.946.3.581.344 2.085.064 2.815.688.817 1.053 1.913 1.053 3.03 0 2.643-1.998 4.641-4.877 5.006.73.473 1.224 1.504 1.224 2.686v2.235c0 .644.537 1.01 1.182.752 3.889-1.483 6.94-5.372 6.94-10.185 0-6.081-4.942-11.044-11.022-11.044-6.081 0-10.98 4.963-10.98 11.044a10.84 10.84 0 0 0 7.112 10.206c.58.215 1.139-.172 1.139-.752v-1.719a2.768 2.768 0 0 1-1.032.215c-1.418 0-2.256-.773-2.857-2.213-.237-.58-.495-.924-.989-.988-.258-.022-.344-.129-.344-.258 0-.258.43-.451.86-.451.623 0 1.16.386 1.719 1.181.43.623.881.903 1.418.903.537 0 .881-.194 1.375-.688.365-.365.645-.687.903-.902Z"></path>
                </svg>
            </a>
            <a class="icon" :href="`https://www.reddit.com/user/${appConfig.redditUser}/`" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                    <defs>
                        <mask id="reddit-mask">
                            <circle cx="400" cy="400" r="400" fill="white"/>
                            <path d="M666.8 400c.08 5.48-.6 10.95-2.04 16.24s-3.62 10.36-6.48 15.04c-2.85 4.68-6.35 8.94-10.39 12.65s-8.58 6.83-13.49 9.27c.11 1.46.2 2.93.25 4.4a107.268 107.268 0 0 1 0 8.8c-.05 1.47-.14 2.94-.25 4.4 0 89.6-104.4 162.4-233.2 162.4S168 560.4 168 470.8c-.11-1.46-.2-2.93-.25-4.4a107.268 107.268 0 0 1 0-8.8c.05-1.47.14-2.94.25-4.4a58.438 58.438 0 0 1-31.85-37.28 58.41 58.41 0 0 1 7.8-48.42 58.354 58.354 0 0 1 41.93-25.4 58.4 58.4 0 0 1 46.52 15.5 286.795 286.795 0 0 1 35.89-20.71c12.45-6.02 25.32-11.14 38.51-15.3s26.67-7.35 40.32-9.56 27.45-3.42 41.28-3.63L418 169.6c.33-1.61.98-3.13 1.91-4.49.92-1.35 2.11-2.51 3.48-3.4 1.38-.89 2.92-1.5 4.54-1.8 1.61-.29 3.27-.26 4.87.09l98 19.6c9.89-16.99 30.65-24.27 48.98-17.19s28.81 26.43 24.71 45.65c-4.09 19.22-21.55 32.62-41.17 31.61-19.63-1.01-35.62-16.13-37.72-35.67L440 186l-26 124.8c13.66.29 27.29 1.57 40.77 3.82a284.358 284.358 0 0 1 77.8 24.86A284.412 284.412 0 0 1 568 360a58.345 58.345 0 0 1 29.4-15.21 58.361 58.361 0 0 1 32.95 3.21 58.384 58.384 0 0 1 25.91 20.61A58.384 58.384 0 0 1 666.8 400zm-396.96 55.31c2.02 4.85 4.96 9.26 8.68 12.97 3.71 3.72 8.12 6.66 12.97 8.68A40.049 40.049 0 0 0 306.8 480c16.18 0 30.76-9.75 36.96-24.69 6.19-14.95 2.76-32.15-8.68-43.59s-28.64-14.87-43.59-8.68c-14.94 6.2-24.69 20.78-24.69 36.96 0 5.25 1.03 10.45 3.04 15.31zm229.1 96.02c2.05-2 3.22-4.73 3.26-7.59.04-2.87-1.07-5.63-3.07-7.68s-4.73-3.22-7.59-3.26c-2.87-.04-5.63 1.07-7.94 2.8a131.06 131.06 0 0 1-19.04 11.35 131.53 131.53 0 0 1-20.68 7.99c-7.1 2.07-14.37 3.54-21.72 4.39-7.36.85-14.77 1.07-22.16.67-7.38.33-14.78.03-22.11-.89a129.01 129.01 0 0 1-21.64-4.6c-7.08-2.14-13.95-4.88-20.56-8.18s-12.93-7.16-18.89-11.53c-2.07-1.7-4.7-2.57-7.38-2.44s-5.21 1.26-7.11 3.15c-1.89 1.9-3.02 4.43-3.15 7.11s.74 5.31 2.44 7.38c7.03 5.3 14.5 9.98 22.33 14s16 7.35 24.4 9.97 17.01 4.51 25.74 5.66c8.73 1.14 17.54 1.53 26.33 1.17 8.79.36 17.6-.03 26.33-1.17A153.961 153.961 0 0 0 476.87 564c7.83-4.02 15.3-8.7 22.33-14zm-7.34-68.13c5.42.06 10.8-.99 15.81-3.07 5.01-2.09 9.54-5.17 13.32-9.06s6.72-8.51 8.66-13.58A39.882 39.882 0 0 0 532 441.6c0-16.18-9.75-30.76-24.69-36.96-14.95-6.19-32.15-2.76-43.59 8.68s-14.87 28.64-8.68 43.59c6.2 14.94 20.78 24.69 36.96 24.69z" fill="black"/>
                        </mask>
                    </defs>
                    <circle cx="400" cy="400" r="400" fill="currentColor" mask="url(#reddit-mask)"/>
                </svg>
            </a>
            <a class="icon" :href="`https://x.com/${appConfig.twitterUser}/`" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="32" height="32">
                    <defs>
                        <mask id="x-logo-mask">
                        <circle cx="500" cy="500" r="500" fill="#ffffff" />
                        <g fill="#000000">
                            <polygon points="756.6,220 223.4,780 286.1,780 819.3,220" />
                            <polygon points="223.4,220 378.4,220 776.6,742.7 776.6,780 621.6,780 223.4,257.3" />
                            <polygon points="288.7,257.3 361.6,257.3 711.3,742.7 638.4,742.7" fill="#ffffff" />
                        </g>
                        </mask>
                    </defs>

                    <g fill="currentColor">
                        <circle cx="500" cy="500" r="500" mask="url(#x-logo-mask)" />
                    </g>
                </svg>
            </a>

            <a class="icon" :href="appConfig.discordServer">
                <svg width="32" height="32" viewBox="0 0 600 600" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
                <defs>
                        <mask id="discord-mask">
                            <circle cx="300" cy="300" r="300" fill="white" />
                            <path
                                transform="translate(50, 50)"
                                d="M111,120a342.174,342.174,0,0,1,83-25l10,22a260.005,260.005,0,0,1,46-3c15.132,0.357,30.158,1.026,45,4l12-23a252.979,252.979,0,0,1,83,27,339.445,339.445,0,0,1,58,231,273.845,273.845,0,0,1-48,31c-16.626,8.425-35.011,17.111-53,22-7.333-11.333-13.667-24.667-21-36a167.877,167.877,0,0,0,25-12c2.733-1.6,5.361-3.245,8-5l-7-7c-30.386,14.444-68.409,22.293-102,23-36.96.778-68.559-7.118-102-23l-7,6a114.689,114.689,0,0,0,33,18l-21,35A335,335,0,0,1,51,353c-3.3-35.525-.306-76.163,7-111C67.526,196.576,84.874,158.558,111,120ZM316,222c20.435,0,37,19.476,37,43.5S336.435,309,316,309s-37-19.476-37-43.5S295.565,222,316,222Zm-133,0c20.435,0,37,19.476,37,43.5S203.435,309,183,309s-37-19.476-37-43.5S162.565,222,183,222Z"
                                fill="black"
                                fill-rule="evenodd"
                            />
                        </mask>
                    </defs>
                    <g fill="currentColor">
                        <circle cx="300" cy="300" r="300" mask="url(#discord-mask)" />
                    </g>
                </svg>
            </a>
        </div>
    </footer>
</template>

<style lang="sass" scoped>
footer
    position: relative
    width: 100%
    // min-height: 400px

    padding: 80px 20px

    background: $color-accent var(--tex-promoFooterBgMobile)
    background-size: auto 100%

    display: flex
    flex-direction: column
    justify-content: space-around
    align-items: center
    gap: 50px

    color: $light

    z-index: 3

    +media-tablet
        flex-direction: row

        gap: 20px
        padding: 80px 40px

    +media-large-desktop
        background: $color-accent var(--tex-promoFooterBg) no-repeat
        background-size: 100% 100%
        animation: none

        padding: 80px 100px

    .info
        width: 100%
        display: flex
        flex-direction: column
        align-items: center
        gap: 20px

        +media-tablet
            align-items: start

        +media-large-desktop
            width: 600px

        .logo
            width: 200px

            img
                width: 100%

        p
            text-align: center

            +media-tablet
                text-align: left

            span
                color: #f13245

            a
                text-decoration: underline

                +hover
                    color: $color

    .pages
        list-style: none
        display: flex
        gap: 10px

        +media-phone
            flex-direction: column

        +media-tablet
            gap: 20px

        +media-large-desktop
            gap: 50px

        li
            display: flex
            flex-direction: column
            align-items: center
            gap: 10px

            min-width: 100px

            +media-tablet
                align-items: start

            +media-desktop
                min-width: 150px

            +media-large-desktop

            > *
                cursor: pointer

                +hover
                    color: $color

    .links
        display: flex
        gap: 10px

        +media-tablet
            display: grid
            grid-template-columns: 1fr 1fr
            grid-template-rows: 1fr 1fr

        +media-desktop
            display: flex

        .icon
            width: 50px
            height: 50px

            display: flex
            justify-content: center
            align-items: center

            cursor: pointer

            +hover
                color: $color
</style>

<script setup lang="ts">
import appConfig from '~/composables/config';

const { install: installPwa, canInstall: canInstallPwa } = usePwaInstall(); 
</script>