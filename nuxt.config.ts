import type { SitemapUrlInput } from '@nuxtjs/sitemap';
import { HERO_LIST } from './app/assets/data/heroes';
import config from './app/composables/config'
import { ACHIEVEMENT_CATEGORIES } from './app/assets/data/achievements/achievements';

const HERO_PAGE_SUBPAGES = [
    'customize', 'estimates', 'planner', 'achievements', 'costumes'
];

const prerenderableHeroPages = Object.fromEntries(
    HERO_LIST.map(h =>[
            [
                `/heroes/${h.id}`,
                { ssr: true }
            ],
            ...HERO_PAGE_SUBPAGES.map(subpage => [
                `/heroes/${h.id}/${subpage}`,
                { ssr: true }
            ])
        ]
    ).flatMap(r => r)
);


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-03-03',
    devtools: { enabled: false },

    routeRules: {
        '/heroes': { ssr: true },
        '/heroes/new': { ssr: false },
        '/heroes/**': { ssr: false },
        ...prerenderableHeroPages,

        '/achievements': { ssr: true },
        ...(Object.fromEntries(
            ACHIEVEMENT_CATEGORIES.map(c => [`/achievements/${c.id}`, { ssr: true }]))
        ),

        '/costumes': { ssr: true },
        '/profile': { ssr: true },
        '/profile/**': { ssr: true },
        '/profile/share': { ssr: false },

        '/download': { ssr: false },
        '/import': { ssr: false },
    },

    nitro: {
        prerender: {
            failOnError: false,
            crawlLinks: true,
            routes: [
                '/',
                '/heroes',
                ...HERO_LIST.map(h => [
                        `/heroes/${h.id}`,
                        ...HERO_PAGE_SUBPAGES.map(subpage => `/heroes/${h.id}/${subpage}`)
                    ]
                ).flatMap(r => r),

                ...ACHIEVEMENT_CATEGORIES.map(c => `/achievements/${c.id}`)
            ]
        },
    },

    app: {
        baseURL: '/',

        head: {
            htmlAttrs: { lang: 'en' },
            title: 'Marvel Rivals Proficiency Calculator',
            link: [
                {
                    rel: 'icon', type: 'image/png',
                    href: '/img/icons/favicon.ico',
                },

                { rel: 'manifest', href: '/manifest.webmanifest' }
            ],
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
                // { name: 'author', content: 'mrprof' },
                { name: 'robots', content: 'index, follow' },
                { property: 'og:type', content: 'website' },
                { property: 'og:site_name', content: 'Marvel Rivals Proficiency Calculator' },
                { name: 'twitter:card', content: 'summary_large_image' },
            ],
            script: [
                {
                    defer: true,
                    src: "https://cloud.umami.is/script.js",
                    'data-website-id': 'ba5a487f-a0b3-4f9c-b31b-a17a81e785ba',
                    'data-domains': config.domain
                },
                {
                    defer: true,
                    src: 'https://static.cloudflareinsights.com/beacon.min.js',
                    'data-cf-beacon': '{"token": "3d4cff31b5674c04a06e28fbaba162ed"}'
                }
            ]
        },
    },

    css: [
        '@/assets/style/main.sass',
        '@/assets/style/fonts.css'
    ],
    vite: {
        css: {
            preprocessorOptions: {
                sass: {
                    // Automatically add css vars and mixins to all sass/scss files
                    additionalData: '@use "@/assets/style/mixins.sass" as *\n@use "@/assets/style/vars.sass" as *\n',
                },
            },
        },
    },

    modules: [
        [
            '@pinia/nuxt',
            {
                autoImports: [
                    'defineStore', // import { defineStore } from 'pinia'
                    ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
                ],
            },
        ],
        '@vite-pwa/nuxt',
        '@nuxtjs/sitemap',
    ],

    pwa: {
        devOptions: {
            enabled: true,
            type: 'module'
        },

        registerType: 'autoUpdate',
        manifest: {
            name: 'Marvel Rivals Proficiency Calculator',
            short_name: 'MR Proficiency',
            description: 'Calculate how long it takes to unlock every proficiency reward',
            theme_color: '#2b2b56',
            background_color: '#2b2b56',
            display: 'standalone',
            icons: [
                {
                    src: 'img/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'img/icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
            // file handler for .mrprof extension
            file_handlers: [
                {
                    action: '/import',
                    accept: {
                        'application/octet-stream': ['.mrprof']
                    }
                }
            ]
        },
        workbox: {
            globPatterns: ['**/*.{js,css,html,png,webp,svg,ico,json,ttf}'],
            globIgnores: ['img/heroes/data/**/*', 'img/cosmetics/items/**/*', 'img/seo/**/*', 'img/changelog/**/*'],
            navigateFallback: undefined, // to show the 404 page since this is not a SPA
            navigateFallbackDenylist: [/\/sitemap\.xml/, /\/robots\.txt/, /\/__sitemap__\/.*/]
        }
    },

    site: {
        url: config.domainHttp,
        trailingSlash: true,
    },

    sitemap: {
        xsl: false,
        discoverImages: false,
        strictNuxtContentPaths: false,
        urls: [
            ...HERO_LIST.map(h => ({
                loc: `/heroes/${h.id}/`,
                changefreq: 'monthly',
                priority: 0.7
            } as SitemapUrlInput)),

            ...ACHIEVEMENT_CATEGORIES.map(c => ({
                loc: `/achievements/${c.id}`,
                changefreq: 'monthly',
                priority: 0.7
            } as SitemapUrlInput))
        ],
        
        exclude: [
            '/download',
            '/import',
            '/heroes/new',
        ]
    },

    devServer: {
        host: "192.168.0.199",
        port: 5500
    }
})
