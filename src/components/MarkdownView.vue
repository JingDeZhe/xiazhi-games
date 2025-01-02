<script setup>
import { md } from '@/libs/markdown'
import { computed } from 'vue'

const props = defineProps({
  content: { type: String, default: '...' },
})

const htmlText = computed(() => {
  return md.render(props.content)
})
</script>

<template>
  <div class="markdown-view">
    <div v-html="htmlText"></div>
  </div>
</template>

<style lang="scss"></style>
