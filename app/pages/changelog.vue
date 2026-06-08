<template>
    <div class="common-page">
        <h1>CHANGELOG</h1>

        <PanelChangelog />

        <br/>
        <p class="disclaimer">
            This is a filtered changelog that covers significant changes, for all modifications head over to our
            <a
                :href="`https://github.com/${config.githubUser}/${config.githubRepo}/commits/main/`"
                target="_blank"
                rel="noopener noreferrer"
            >
                GitHub Commits</a>.
        </p>
        <br/>
    </div>
</template>

<style lang="sass" scoped>
.disclaimer
    text-align: center

    a
        text-decoration: underline
</style>

<script setup lang="ts">
useSeoMeta({
    title: 'Changelog | MR Proficiency Calculator',
    description: 'See all changes  made and features added to the tool in chronological order, linked with their GitHub commits.',
    
    ogTitle: 'Changelog | MR Proficiency Calculator',
    ogUrl: useCanonicalUrl('changelog'),
    ogImage: useAbsoluteUrl('/img/seo/og-image-changelog.webp'),
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'Changelog | Marvel Rivals Proficiency Calculator - See all changes  made and features added to the tool in chronological order, linked with their GitHub commits.',
    
    twitterTitle: 'Changelog | MR Proficiency Calculator',
    twitterDescription: 'See all changes  made and features added to the tool in chronological order, linked with their GitHub commits.',
    twitterImage: useAbsoluteUrl('/img/seo/og-image-changelog.webp'),
    twitterImageAlt: 'Changelog | Marvel Rivals Proficiency Calculator - See all changes  made and features added to the tool in chronological order, linked with their GitHub commits.',
})

useHead({
    link: [
        {
            rel: "canonical",
            href: useCanonicalUrl('changelog')
        }
    ]
})

onMounted(() => {
    if (!window.location.hash)
        return;

    const targetElement = document.querySelector(window.location.hash);
    if (!targetElement)
        return;

    setTimeout(() => {
        const headerHeight = 65 + 40;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }, 100);
})

</script>