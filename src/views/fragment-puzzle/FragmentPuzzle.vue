<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { _picture } from './preData'
import { uid } from '@/utils'
import { useImageCropper } from '@/utils/composable'
import { darkTheme, useModal } from 'naive-ui'
import { computed } from 'vue'

const picture = ref(_picture)

const tmpFragmentPoints = ref([])
const activeFragment = ref(null)
const px1v = ref(1)
const baseInfo = ref({
  readonly: false,
  referImg: '',
  croppedReferImg: '',
})

const referImgSrc = computed(() => baseInfo.value.croppedReferImg || baseInfo.value.referImg)

const getPoints = (fragment) => {
  return fragment.points.map((v) => v.join(',')).join(' ')
}

const canvas = ref()

const map100 = (x1, x2, len) => ((x1 - x2) / len) * 100

const handleCanvasClick = (e) => {
  if (baseInfo.value.readonly) return
  activeFragment.value = null
  const { x, y, width: sl } = canvas.value.getBoundingClientRect()
  const { x: mx, y: my } = e

  if (tmpFragmentPoints.value.length < 3) {
    tmpFragmentPoints.value.push([map100(mx, x, sl), map100(my, y, sl)])
    if (tmpFragmentPoints.value.length === 3) {
      const newFragment = {
        id: uid(),
        fill: '#292C34',
        points: [...tmpFragmentPoints.value.splice(0)],
      }
      picture.value.fragments.push(newFragment)
      activeFragment.value = newFragment
    }
  }
}

const handleSelectFragment = (e) => {
  if (baseInfo.value.readonly) return
  if (tmpFragmentPoints.value.length !== 0) {
  } else {
    const { id } = e.target.dataset
    const index = picture.value.fragments.findIndex((v) => v.id === id)
    if (index !== -1) {
      const t = picture.value.fragments.splice(index, 1)[0]
      picture.value.fragments.push(t)
      activeFragment.value = t
    }
    e.stopPropagation()
  }
}

onMounted(() => {
  nextTick(() => {
    const { width } = canvas.value.getBoundingClientRect()
    px1v.value = 100 / width
    canvas.value.style.setProperty('--px1v', px1v.value)
  })
})

const handleSelectReferImg = ({ file }) => {
  const reader = new FileReader()
  reader.onloadend = () => {
    baseInfo.value.referImg = reader.result
    baseInfo.value.croppedReferImg = ''
  }
  reader.readAsDataURL(file.file)
}

const modal = useModal()
const handleEditReferImg = () => {
  useImageCropper(
    {
      src: baseInfo.value.referImg,
      onConfirm: (newSrc) => {
        baseInfo.value.croppedReferImg = newSrc
      },
    },
    modal
  )
}
</script>

<template>
  <div class="fragment-puzzle full-ctn">
    <n-config-provider :theme="darkTheme" abstract>
      <div class="tools">
        <n-form ref="formRef" :label-width="80" label-placement="left" :model="baseInfo" size="medium">
          <n-form-item label="参考">
            <div class="flex gap-1">
              <n-upload accept="image/*" :max="1" @change="handleSelectReferImg" :show-file-list="false">
                <n-button>上传</n-button>
              </n-upload>
              <n-button v-if="baseInfo.referImg" @click="handleEditReferImg">编辑</n-button>
            </div>
          </n-form-item>
          <n-form-item path="readonly" label="只读">
            <n-switch v-model:value="baseInfo.readonly"></n-switch>
          </n-form-item>
          <template v-if="activeFragment">
            <n-form-item label="颜色">
              <n-color-picker v-model:value="activeFragment.fill"></n-color-picker>
            </n-form-item>
          </template>
        </n-form>
      </div>
    </n-config-provider>
    <div class="canvas-ctn">
      <img class="refer-img" :src="referImgSrc" v-if="referImgSrc" />
      <svg class="canvas" viewBox="0 0 100 100" @click="handleCanvasClick" ref="canvas">
        <polygon
          v-for="p in picture.fragments"
          :points="getPoints(p)"
          :fill="p.fill"
          @click="handleSelectFragment"
          :data-id="p.id"
          :class="{ active: activeFragment === p }"
        ></polygon>
        <circle v-for="c in tmpFragmentPoints" :cx="c[0]" :cy="c[1]" r="1" fill="#292C3430"></circle>
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
.fragment-puzzle {
  --at-apply: grid grid-cols-[300px_1fr] gap-1;

  .tools {
    --at-apply: bg-dark-500 text-white p-2;
  }
  .canvas-ctn {
    --px1v: 1px;
    --at-apply: relative m-2 overflow-hidden;
    width: 600px;
    height: 600px;
    .refer-img {
      --at-apply: absolute opacity-30 overflow-hidden object-contain;
      z-index: -1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-position: 50% 50%;
    }
    svg {
      --at-apply: w-full h-full;
      outline: 1px solid #ccc;

      polygon {
        &.active {
          stroke-width: calc(2 * var(--px1v));
          stroke: #303030;
        }
      }
    }
  }
}
</style>
