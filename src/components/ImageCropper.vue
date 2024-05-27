<script setup>
import 'cropperjs/dist/cropper.min.css'
import Cropper from 'cropperjs'
import { ref } from 'vue'
import { onMounted } from 'vue'

const refImg = ref()
const props = defineProps({
  src: { type: String, required: true },
  aspectRatio: { type: Number, default: 1 },
})

let cropper
onMounted(() => {
  cropper = new Cropper(refImg.value, {
    aspectRatio: props.aspectRatio,
  })
})

defineExpose({
  getCroppedUrl() {
    return cropper.getCroppedCanvas().toDataURL('image/jpeg')
  },
})
</script>

<template>
  <div class="overflow-hidden">
    <img :src="src" ref="refImg" style="height: 600px" />
  </div>
</template>

<style lang="scss"></style>
