<script setup>
import { ref } from 'vue'
import { letterList } from './data'
import MarkdownView from '@/components/MarkdownView.vue'

const activeLetter = ref('')
const viewLetter = async (letter) => {
  const data = await fetch(letter.contentPath).then((d) => d.text())
  activeLetter.value = data
}
</script>

<template>
  <div class="silent">
    <div class="letter-list">
      <div class="letter" v-for="(letter, index) in letterList" :key="index">
        <span @click="viewLetter(letter)">{{ letter.frontmatter.title }}</span>
      </div>
    </div>
    <MarkdownView :content="activeLetter"></MarkdownView>
  </div>
</template>

<style lang="scss"></style>
