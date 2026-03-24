<template>
    <pre><code ref="codeEl" class="language-json"></code></pre>
</template>

<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/tokyo-night-dark.min.css' // or any theme

hljs.registerLanguage('json', json)

const props = defineProps<{ code: unknown }>()
const codeEl = ref<HTMLElement>()

watchEffect(() => {
    if (!codeEl.value) return
    codeEl.value.textContent = JSON.stringify(props.code, null, 2)
    codeEl.value.removeAttribute('data-highlighted');
    hljs.highlightElement(codeEl.value)
})
</script>