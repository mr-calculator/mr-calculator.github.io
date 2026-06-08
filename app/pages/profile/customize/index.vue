<template>
    <div />
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'profile-layout'
});

const router = useRouter();

router.replace({
    path: '/profile/customize/nameplate'
});
</script>