<script setup>
import MarkdownView from '@/components/MarkdownView.vue'
import { letterList } from './data/letters'
import { ref } from 'vue'

const activeLetter = ref('')
const viewLetter = async (letterLoader) => {
  const data = await letterLoader()
  console.log(data)
  activeLetter.value = data.content
}
</script>

<template>
  <div class="letter-list">
    <div class="letter-item" v-for="(item, index) in letterList" :key="index">
      <NButton @click="viewLetter(item)">{{ index }}</NButton>
    </div>
  </div>

  <MarkdownView :content="activeLetter" />
</template>

<style lang="scss"></style>
