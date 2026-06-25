export interface ChangeLogEntry {
    version: {
        number: string,
        date: string,
        time: string,
        commitSha?: string,
    },
    title: string,
    description?: string,
    listTitle?: string,
    list?: string[],
    images?: string[],
}

export interface GitHubCommit {
    sha: string,
    node_id: string,
    commit: {
        author: {
            name: string,
            email: string,
            date: string
        },
        committer: {
            name: string,
            email: string,
            date: string,
        },
        message: string,
        tree: {
            sha: string,
            url: string,
        },
        url: string,
        comment_count: number,
        verification: {
            verified: boolean,
            reason: string,
            signature: unknown,
            payload: unknown,
            verified_at: unknown
        }
    },
    url: string,
    html_url: string,
    comments_url: string,
    author: string|null,
    committer: string|null,
    parents: [
        {
            sha: string,
            url: string,
            html_url: string,
        }
    ]
}

/**
 * Version update scheme: a.b.c = a - major update, b - major feature update, c - minor feature/fix
 */
export const CHANGELOG = (): ChangeLogEntry[] => [
    {
        version: {
            number: '1.0.0',
            date: 'Mar 25, 2026',
            time: '6:19 PM',

            commitSha: '16c643cd901f391d8a849405d65c0dda0478444d'
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
            date: 'Mar 26, 2026',
            time: '6:50 PM',

            commitSha: 'fc1b8f7e6f74ddb8f8dcddb4e900cf66f2fb42bf'
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
            date: 'Apr 9, 2026',
            time: '9:27 AM',

            commitSha: 'a6cdbd381cdac5863c05e9b3836e4060a24a87ac'
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
            date: 'Apr 10, 2026',
            time: '2:35 AM',

            commitSha: 'da2dfe6ad0ccbd6e9a092421c3df3e974041d041'
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
            date: 'Apr 13, 2026',
            time: '4:39 PM',

            commitSha: 'c6064f48f65fe6bde2a241bf76b2c9623f7a2af3'
        },
        title: 'Added the Changelog',
        description: 'Added this very changelog. You can now see all the updates and additions to the calculator, including new heroes and other QoL changes!',
    },
    {
        version: {
            number: '1.2.2',
            date: 'Apr 14, 2026',
            time: '9:56 AM',

            commitSha: '3393b9ff99b71692776cfa77e45fb0cdff8a117e'
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
    },
    {
        version: {
            number: '1.2.3',
            date: 'Apr 14, 2026',
            time: '4:43 AM',

            commitSha: '223b72e3096d446bc44efdf0386451fb7861a5ec'
        },
        title: 'More QoL changes and bug fixes',
        description: `Improved hero page (again) - it's now easier than ever to change your current level data, no more menu inception.
        <br/>
        Fixed some major issues with importing/downloading data.
        `,
        list: [
            'Added ability to increase the current level by 1 just by pressing on it (now marked with a chevron) - resets proficiency points to 0',
            'Added ability to drag/slide the proficiency points meter to set your proficiency points',
            'Fixed "Download My Data" button downloading the selected hero\'s data instead of all the data when a hero was selected',
            'Fixed Import data page not honoring the user choices of what heroes to overwrite (be it custom hero info or stats)',
            'Added a visual interface to see what heroes are being imported which also allows to filter out heroes (stats or info - for custom heroes) when importing'
        ],
        images: [
            '/img/changelog/v1.2.3/hero.webp',
            '/img/changelog/v1.2.3/import.webp'
        ]
    },
    {
        version: {
            number: '1.2.4',
            date: 'Apr 15, 2026',
            time: '2:12 AM',
            commitSha: '536108952a8b06e236e5cdec6465a9d24079c0de'
        },
        title: 'Improved mobile user UI/UX and the Changelog',
        description: `Made certain modifications to the UI and UX of the app on mobile for a smoother experience across all devices
        <br/>
        Improved the changelog to contain GitHub commits and link "major" versions to commits.
        `,
        list: [
            'Centered hero name on hero page',
            'Disabled scrolling when dragging the proficiency slider on mobile',
            'The filtering tools bar now toggles when scrolling up/down in the hero list, so more heroes are visible at once',
            'Added GitHub commits between "major" versions in the changelog and assigned individual commits to a major version. Commits are fetched from GitHub or from a cache in case of rate-limiting of the user by GitHub.'
        ]
    },
    {
        version: {
            number: '1.3.0',
            date: 'Apr 17, 2026',
            time: '4:11 PM',
            commitSha: 'fc93bb604b472799f8fc0fc5713b85bf44903b8e'
        },
        title: 'Added Black Cat',
        description: `Added Black Cat to the calculator without generic stats (will add later - when averages are more accurate)<br/>
        Made slight optimisations and bug fixes.<br/>
        Refreshed White Fox generic average stats with data from S7.0.<br/>
        Added new hero promotional UI elements to help players more easily get to the new hero's page.
        `,
        list: [
            'Added Black Cat',
            'Refreshed White Fox generic average stats with data from S7.0',
            'Modified add-hero script to allow season selection for data scrape',
            'Added new hero promotional UI elements that show up on the landing and hero list pages',
            'Fixed a hydration issue with the new hero promo role',
            'Fixed hydration issues with the scrolling lord display at the bottom of the landing page',
            'Fixed reactive components when using modals, changed to markRaw',
            'Added a temporary popup to explain the new quick current level/proficiency points editing features on hero pages, which adds a new localStorage preference k/v',
            'Modified import/download pages to accomodate possible version mismatches and resolve them automatically (upgrading older exported data files to the newer version by filling in with defaults)',
            'Modified commit list caching mechanism to use an authenticated GitHub API request, since I literally just got rate limited as writing this'
        ],
        images: [
            '/img/changelog/v1.3.0/black-cat.webp',
            '/img/changelog/v1.3.0/new-hero-promo-landing.webp',
            '/img/changelog/v1.3.0/new-hero-promo-list.webp',
        ]
    },
    {
        version: {
            number: '1.4.0',
            date: 'Apr 17, 2026',
            time: '10:14 PM',
            commitSha: '9ebbc2149a12b7219bfa1e2bdeb6d8b5b3fe59c9'
        },
        title: 'Hero Page UI/UX Improvements',
        description: `Reworked the Hero page to have better UX and be less confusing, using more tabs and less hidden menus.`,
        list: [
            'Changed navigation to Overview, Customize, Estimates, Planner',
            'Changed calculator panel to have 2 different states (normal & arcade) for less confusion',
            'Customize page now features everything in the hero settings modal',
            'Added Export Hero button'
        ],
        images: [
            '/img/changelog/v1.4.0/hero-page.webp',
        ]
    },
    {
        version: {
            number: '1.4.1',
            date: 'Apr 18, 2026',
            time: '10:01 PM',
            commitSha: '7e19ed6dac0a5cc5a93db1948535a7d01173cdc1'
        },
        title: 'Added tooltips',
        description: `Added tooltips to help with UI confusion here and there. Made other small fixes.`,
    },
    {
        version: {
            number: '1.4.2',
            date: 'Apr 19, 2026',
            time: '05:10 AM',
            commitSha: '037f348d9c449f7b6e40f9cd30065c8d0423e81a'
        },
        title: 'Added Black Cat average stats',
        description: `Added Black Cat average stats, made a few adjustments to tooltips, fixed a few bugs and improved SEO for hero pages.
        <br/><br/>
        Note: Black Cat stats <b>will</b> be updated in the future as more games are played with her and the averages become more average (?).`,
        list: [
            'Added Black Cat average stats',
            'Fixed background image not being fixed on iOS',
            'Animated new hero promo UI on landing page. No more snapping and flickering.',
            'onMounted hooks were used outside components for isMobile and isTouchDevice composables, fixed.',
            'Fixed tooltip disappearing when hovering nested tooltip elements and unhovering.',
            'Changed SEO meta for hero page (was wrong description for twitter) to be more appealing and contain average completion estimates, only rendered at generate/prerender time.',
            'Modified add-hero script to ask what needs to be done first, then ask details. Now requires only hero id for modifying an existing hero.',
        ]
    },
    {
        version: {
            number: '1.5.0',
            date: 'Apr 20, 2026',
            time: '04:25 AM',
            commitSha: 'bcef10c22328cf9f1b7913b2aa54645a33c7df0c'
        },
        title: 'Added Arcade Mode precise estimates',
        description: `Added Arcade Mode duration feature which estimates the real time in days it will take to reach a goal on a hero based on personal average stats and mission limits. Customizable with a "Daily missions to complete" selector, where users can select a number of missions they are willing to complete (all 15 of the daily ones) before switching to a different mode or stopping to wait for the next day.
        <br/>
        Planner now takes arcade mission limits into consideration`,
        list: [
            'Added Arcade Mode duration feature',
            'Added Arcade Mode to Planner',
            'Changed some types to use zod infer from schema, now with defaults built in',
            'Fixed a styling issue (on hover) with the reward/level selector',
            'Fixed a bug related to the hero data list (landing page) and other places where the HorizontalScrollContainer component was used that, after excessive scrolling caused intense lag on the entire website due to usage of refs bound to style attributes. Switched to manual (vanilla JS) setting of translations',
            'Fixed tooltips leaving event listeners behind due to an oversight',
            'Fixed tooltips going outside of viewport and limited their width',
            'Changed versions of previous changelog entries that were not following the version update scheme (oops, forgot)',
            'Added Reddit social link pointing to the mr-prof-calculator account'
        ],
        images: [
            '/img/changelog/v1.5.0/estimates-arcade.webp',
            '/img/changelog/v1.5.0/planner-arcade.webp',
        ]
    },
    {
        version: {
            number: '1.6.0',
            date: 'Apr 26, 2026',
            time: '10:23 PM',
            commitSha: '05adaecab5f6af5a460b9ff6bdd4cd52f1f41594'
        },
        title: 'Added Achievements Tracking (for heroes)',
        description: `Added a new tab to the hero page where hero-specific achievements' progress can be tracked, where rewards can be previewed
        <br/>
        <br/>
        <i>This is a partial feature. Currently, our data has all of the achievements of the game and a new page will be added in the future, where all achievements can be viewed, searched, tracked and marked as completed and where all rewards can be previewed.</i>`,
        list: [
            'Achievements Tab to hero page',
            'Added all game achievements',
            'Achievements progress can be tracked in the designated tab',
            'Preview all rewards in the Achievements tab (by pressing on the gift icon)'
        ],
        images: [
            '/img/changelog/v1.6.0/hero-page.webp',
            '/img/changelog/v1.6.0/rewards.webp',
        ]
    },
    {
        version: {
            number: '1.6.1',
            date: 'May 15, 2026',
            time: '02:31 PM',
            commitSha: '4da2c05e1f64cb715ca9b1a73ef028934c1d3276'
        },
        title: 'Added Devil Dinosaur',
        description: `Added the new hero, Devil Dinosaur.
        <br>
        Fixed landing page "If you want to see arcade options" "Set your Arcade Stats" button not working.`,
        images: [
            '/img/changelog/v1.6.1/devil-dinosaur.webp',
        ]
    },
    {
        version: {
            number: '1.7.0',
            date: 'May 22, 2026',
            time: '4:36 PM',
            commitSha: 'ab54247178467336103d4cb04c97af6cc121552d'
        },
        title: 'List View Feature for heroes',
        description: `Adds a new way to view your proficiencies all at once. On the Heroes page, there's now an option to toggle between "Gallery View" and "List View". Gallery View shows the hero cards as before. List View shows all of your heroes and their proficiency data as a table.
        <br>
        <br>
        Thanks to <a href="https://github.com/oceanhillman">oceanhillman</a> for making this feature!`,
        listTitle: 'Features',
        list: [
            'Switch between Gallery View and List View on the Heroes Page',
            'Sort by: Name, Role, Rank, Level, Current/Total Points; (asc/desc)'
        ],
        images: [
            '/img/changelog/v1.7.0/hero-list.webp',
        ]
    },
    {
        version: {
            number: '1.8.0',
            date: 'May 23, 2026',
            time: '3:51 PM',
            commitSha: 'b03d371fbaf34b3f9483bc1d23e17a9f685ee938'
        },
        title: 'Costumes list and checklist',
        description: `Adds costume tracking to the individual hero pages. Clicking on individual costumes brings up some information about that costume. You can mark costumes as "owned" to track their collection. This data is saved to local storage.
        <br>
        <br>
        Thanks to <a href="https://github.com/oceanhillman">oceanhillman</a> for making this feature!`,
        listTitle: 'Features',
        list: [
            'View all costumes for every hero',
            'Filter costumes by Rarity, Category, Source and Theme',
            'Sort costumes by rarity or release date',
            'Mark costumes as owned',
            'See costume details like: name, rarity, is it customizable, category, source, theme and release date'
        ],
        images: [
            '/img/changelog/v1.8.0/costume-page.webp',
            '/img/changelog/v1.8.0/costume-modal.webp',
        ]
    },
    {
        version: {
            number: '2.0.0',
            date: 'June 8, 2026',
            time: '9:45 PM',
            commitSha: '7abca45171d40cac2cce8ca46947c14fc6e3119f'
        },
        title: 'A fresh look',
        description: `This major update comes with a complete navigation revamp, tons of new tracking features, and crucial fixes!
        <br/><br/>
        Browse, sort, search, filter, and mark as owned any and all of the in-game costumes, nameplates, and frames. 
        <br/><br/>
        Look through every achievement in the game and easily track your completion progress!
        <br/><br/>
        Check out your proficiency breakdown on your new profile page, customize your card, and share a downloadable image of your stats with your friends!
        `,
        listTitle: 'Features',
        list: [
            'All costumes in the game with advanced filtering (by hero, rarity, theme, etc.)',
            'All achievements in the game (fully trackable by category)',
            'All nameplates & frames cataloged with source tracking',
            'Profile overview featuring customizable names, equippable icons, nameplates, frames, and an image-generation sharing tool',
            'New navigation system that\'s familiar, more consistent, beautifully animated, and persistent across all pages.'
        ],
        images: [
            '/img/seo/og-image-costumes.webp',
            '/img/changelog/v2.0.0/achievements.webp',
            '/img/changelog/v2.0.0/costumes.webp',
            '/img/changelog/v2.0.0/nameplates.webp',
            '/img/changelog/v2.0.0/profile.webp',
            '/img/changelog/v2.0.0/share.webp',
        ]
    },
    {
        version: {
            number: '2.1.0',
            date: 'June 10, 2026',
            time: '4:52 AM',
            commitSha: '3ab4e3e29800323c3e2f51694ba0d9e298ae1ffe'
        },
        title: 'Costume Collections',
        description: `This new feature allows for creating collections of costumes (for purposes such as "My Whishlist" or "My Favourite Costumes") and sharing them with your friends!`,
        listTitle: 'Features',
        list: [
            'Creating, editing, deleting and sharing of collections',
            'Importing (saving) collections received from friends'
        ],
        images: [
            '/img/changelog/v2.1.0/collections.webp',
            '/img/changelog/v2.1.0/collection.webp',
            '/img/changelog/v2.1.0/make-collection.webp',
            '/img/changelog/v2.1.0/make-collection-flow.webp',
        ]
    },
    {
        version: {
            number: '2.1.1',
            date: 'June 12, 2026',
            time: '11:16 PM',
            commitSha: '4d254849f833f48a8fb008f949f84f8795a090c4'
        },
        title: 'Updated the costume collections feature',
        description: `This update fixes a few issues with cosmetics, the collections feature, and adds a few nice-to-haves, further building upon the costume collections feature.`,
        listTitle: 'Additions',
        list: [
            'Ability to see a count of costumes in a collection (and owned count)',
            'Ability to filter, search, and sort collections (tools bar will automatically be shown when collection length is greater than 20).',
            'Added a share button (that copies a shorter link — ID is not included, since it\'s a per browser property)',
            'Added a New Collection button to the Collections List.',
            'Added a confirmation step when cancelling the creation/editing of a collection (if there are any selected items)',
            'Added an official collection for the 616 Vault (2026)',
        ]
    },
    {
        version: {
            number: '2.1.2',
            date: 'June 12, 2026',
            time: '2:44 PM',
            commitSha: 'e507e39b8646cb900c0217f994095fccecda731e'
        },
        title: 'Content Update: Season 8.5',
        description: `Added the new hero, costume, nameplates, and achievements (and new achievement rewards).`,
        images: [
            '/img/changelog/v2.1.2/cyclops-page.webp',
            '/img/changelog/v2.1.2/achievements-cyclops.webp',
            '/img/changelog/v2.1.2/costumes.webp',
            '/img/changelog/v2.1.2/nameplates.webp',
            '/img/changelog/v2.1.2/achievements-global.webp',
        ]
    },
    {
        version: {
            number: '2.2.0',
            date: 'June 15, 2026',
            time: '1:43 AM',
            commitSha: '1cdee04c67eda436d37d092f67fb7c6753ae2e03'
        },
        title: 'Multi-Role Heroes Average Stats Feature & Fixes',
        description: `Added a feature that allows users to have different stats for every role of multi-role heroes (Deadpool) (both for storing and using in Estimates and Planner)`,
        list: [
            'Added generic average stats for all Deadpool roles individually, as well as combined (updated for S8.0)',
            'Added ability for full menu (open state on mobile) to be hidden away by tapping outside of it or scrolling the page',
            'Fixed menu background on mobile having wrong size (should now repeat at precise intervals to match the menu items)',
            'Fixed menu on small desktops going too much (18.5px) to the right, going past the diagonal cutoff of the top bar',
            'Fixed sticky toolbar on Cosmetics page going under the menu bar when stuck',
        ],
        images: [
            '/img/changelog/v2.2.0/role-selector.webp',
            '/img/changelog/v2.2.0/set-average-stats.webp',
            '/img/changelog/v2.2.0/generic-stats.webp',
        ]
    },
    {
        version: {
            number: '2.3.0',
            date: 'June 18, 2026',
            time: '10:31 PM',
            commitSha: '6cfd50b3e511b25afb76acd51a794456fac20506'
        },
        title: 'Added custom heroes user images',
        description: `Added ability to upload custom images for user added heroes
        <br>
        <br>
        <i>(Gamora Image taken from <a href="https://www.reddit.com/r/marvelrivals/comments/1n2iy1f/gamora_character_design/" target="_blank" rel="noopener noreferrer">Reddit</a>. Artwork by pboyshrty - <a href="https://www.instagram.com/byplayboyshorty" target="_blank" rel="noopener noreferrer">Instagram</a>, <a href="https://www.reddit.com/user/Cultural_Ad4203/" target="_blank" rel="noopener noreferrer">Reddit</a>)</i>
        `,
        list: [
            'Updated all hero stats to S8.0',
        ],
        images: [
            '/img/changelog/v2.3.0/gamora.webp',
        ]
    },
    {
        version: {
            number: '2.3.1',
            date: 'June 25, 2026',
            time: '10:06 PM',
            commitSha: 'c27a6b667230be7be1a7a347b43c87d9d9569efa'
        },
        title: 'Added custom costumes & better UX for costumes',
        description: `Added the ability to add custom costumes (to custom-added heroes only) with data and images (stored in your browser) — also exportable!
        <br/>
        <br/>
        White Fox Art made by <a href="https://x.com/RKreates_" target="_blank" rel="noopener noreferrer">Riko Kreates</a>.
        `,
        list: [
            'Added the ability to make a selection in the costumes page to either make a collection or mark as owned/unowned. Shift may be used with clicking to select multiple items at the same time.',
            'Fixed modifying custom-added heroes\' names causing loss of stored proficiency progress, owned costumes and custom images.'
        ],
        images: [
            '/img/changelog/v2.3.1/costumes-page.webp',
            '/img/changelog/v2.3.1/costume-detail.webp',
            '/img/changelog/v2.3.1/edit.webp',
            '/img/changelog/v2.3.1/costumes-selection.webp',
        ]
    },
];

export function groupCommitsByVersion(commits: GitHubCommit[]):
{
    groups: Record<string, GitHubCommit[]>,
    remaining: GitHubCommit[],
    versionCommits: Record<string, GitHubCommit>
} {
    const reverseChangelog = CHANGELOG();
    const reverseCommits = commits.toReversed();
    const groupsByVersion: Record<string, GitHubCommit[]> = {};
    const versionCommits: Record<string, GitHubCommit> = {};

    const remaining: GitHubCommit[] = [];

    let lastCommitIndex = -1;
    for (const entry of reverseChangelog) {
        const version = entry.version.number;
        groupsByVersion[version] = [];

        let indexOfCommit = reverseCommits.findIndex(c => c.sha == entry.version.commitSha);

        if (!entry.version.commitSha) {
            const entryDateAndTime = new Date(entry.version.date + ' ' + entry.version.time + ' UTC+00');            
            let smallestTimeDiff = Number.MAX_SAFE_INTEGER;
            reverseCommits.forEach((c, idx) => {
                const dateOfCommit = new Date(c.commit?.author?.date ?? c.commit?.committer?.date);
                const diff = Math.abs(dateOfCommit.getTime() - entryDateAndTime.getTime());
                if (diff < smallestTimeDiff) {
                    smallestTimeDiff = diff;
                    indexOfCommit = idx;
                }
            });
        }

        for (let i = lastCommitIndex + 1; i < indexOfCommit; i++)
            groupsByVersion[version].push(reverseCommits[i]!);

        lastCommitIndex = indexOfCommit;
        versionCommits[version] = reverseCommits[indexOfCommit]!;
    }

    if (lastCommitIndex < reverseCommits.length - 1)
        remaining.push(...reverseCommits.slice(lastCommitIndex + 1));

    remaining.reverse();

    Object.values(groupsByVersion).forEach(g => g.reverse());

    return {
        groups: groupsByVersion,
        remaining,
        versionCommits,
    }
}

export const DEVELOPER_LETTER = () => ({
    validUntil: new Date('2026-08-07'),
    title: 'A fresh look',
    message: `
        <p>
            <i>"Mr. Stark, it smells like a new car in here!"</i>
        </p>
        <p>
            Welcome back! As you can see, things look a little different around here. With this update, we are introducing a cleaner, more rounded UI that matches the game's energy and feels like home.
        </p>
        <p>
            We've also expanded features massively. You can now view and track ownership of <b>all</b> in-game costumes, nameplates, and frames. On top of that, we've cataloged every single achievement so you can easily track your journey to completion. Want to show off? Check out the new Profile page to view your overall proficiency progress, customize your showcase card, and download a beautiful stats image to share with your friends!
        </p>
        <p>
            While we know these features go a bit beyond the scope of a simple proficiency calculator, we wanted to work towards building an all-in-one companion app that you'd love using every day. We hope you enjoy the upgrade!
        </p>
        <p>
            We'd love to hear what you think — come share your feedback with us on our new
            <a href="${config.discordServer}" target="_blank" rel="noopener noreferrer">Discord server</a>!
        </p>
    `,
    version: '2.0.0'
});