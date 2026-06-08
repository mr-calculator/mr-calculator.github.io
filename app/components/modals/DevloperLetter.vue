<template>
    <div v-if="show" class="developer-letter-wrapper">
        <div class="developer-letter">
            <div class="logo">
                <img
                    src="/img/icons/logo-large-light.webp"
                    alt="Marvel Rivals Proficiency Calculator Logo"
                    draggable="false"
                />
            </div>
            <div class="separator" />

            <div class="image-left">
                <img
                    class="mobile"
                    src="/img/changelog/letter/luna-mobile.webp"
                    alt="Luna Snow inside a Sports Car"
                    draggable="false"
                />
                <img
                    class="desktop"
                    src="/img/changelog/letter/luna.webp"
                    alt="Luna Snow in a Sports Car"
                    draggable="false"
                />
            </div>
            <div class="content">
                <div class="decoration left" />
                <div class="decoration right" />

                <h2>{{ letterData.title }}</h2>
                <div class="scroll-container">
                    <div class="body" v-html="letterData.message" />
                    <div class="read-more">
                        <FormButton
                            :to="`/changelog/#v${letterData.version.replaceAll('.', '_')}`"
                            color-scheme="read-more"
                            size="small"

                            @click="closeModal"
                        >
                            Read more
                        </FormButton>
                    </div>
                </div>
            </div>

            <div class="button">
                <div @click="closeModal" class="desktop">
                    <div class="key">
                        <span>SPACE</span>
                    </div>
                    <span>CONTINUE</span>
                </div>
                <FormButton
                    class="mobile"
                    size="tiny"
                    color-scheme="white"

                    @click="closeModal"
                >
                    CONTINUE
                </FormButton>
            </div>
        </div>
    </div>
</template>

<style src="@/assets/style/components/developer-letter.sass" scoped></style>

<script setup lang="ts">
import { DEVELOPER_LETTER } from '~/assets/data/changelog';
import { DEFAULT_PREFERENCES_STORE, PreferencesStoreSchema } from '~/assets/data/common';

const letterData = DEVELOPER_LETTER();
const preferences = useLocalStorage('preferences', DEFAULT_PREFERENCES_STORE(), PreferencesStoreSchema);

const { options } = useDeveloperLetterOptions();

const show = ref(false);

function setShow(opts: typeof options.value) {
    if (typeof opts.overrideDisplay === 'undefined')
        show.value = 
            Date.now() < letterData.validUntil.getTime()
        && preferences.value.sawDeveloperLetter !== letterData.version;
    else
        show.value = opts.overrideDisplay;
}

watch(options, (options) => setShow(options));

onMounted(() => {
    setShow(options.value);

    // since we are not going to have multiple developer letters (old letters get deleted)
    // we won't do a number comparison of the version
    preferences.value.sawDeveloperLetter = letterData.version;
});

function closeModal() {
    show.value = false;
}

useEvent('keydown', (e: KeyboardEvent) => {
    if (!show.value)
        return;
    
    if (e.key == 'Escape' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        closeModal();
    }
    if (e.code == 'Space' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        closeModal();
    }
})
</script>