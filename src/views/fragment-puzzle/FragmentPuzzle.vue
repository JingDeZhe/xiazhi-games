<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { _picture } from './preData'
import { uid, kySet, kyGet } from '@/utils'
import { useImageCropper } from '@/utils/composable'
import { darkTheme, useModal } from 'naive-ui'
import { computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'

const picture = ref(_picture)

const tmpFragmentPoints = ref([])
const activeFragment = ref(null)
const px1v = ref(1)
const info = ref({
  title: '',
  readonly: false,
  referImg: '',
  croppedReferImg: '',
})

const referImgSrc = computed(() => info.value.croppedReferImg || info.value.referImg)

const getPoints = (fragment) => {
  return fragment.points.map((v) => v.join(',')).join(' ')
}

const canvas = ref()

const map100 = (x1, x2, len) => ((x1 - x2) / len) * 100

const handleCanvasClick = (e) => {
  if (info.value.readonly) return
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
  if (info.value.readonly) return
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

const handleDeleteFragment = () => {
  const index = picture.value.fragments.findIndex((d) => d === activeFragment.value)
  picture.value.fragments.splice(index, 1)
  activeFragment.value = null
}

onMounted(() => {
  nextTick(() => {
    const { width } = canvas.value.getBoundingClientRect()
    px1v.value = 100 / width
    canvas.value.style.setProperty('--px1v', px1v.value)
  })
})

const handleSelectReferImg = ({ file }) => {
  readFileAs(file.file, 'url').then((url) => {
    info.value.referImg = url
    info.value.croppedReferImg = ''
  })
}

const modal = useModal()
const handleEditReferImg = () => {
  useImageCropper(
    {
      src: info.value.referImg,
      onConfirm: (newSrc) => {
        info.value.croppedReferImg = newSrc
      },
    },
    modal
  )
}

const TEMP_DATA_KEY = 'fp-temp-canvas-data'
const handleSaveTempCanvas = () => {
  const d = getCanvasData()

  kySet(TEMP_DATA_KEY, d).then(() => {
    $message.success('临时数据保存成功')
  })
}

const handleLoadTempCanvas = () => {
  kyGet(TEMP_DATA_KEY).then((d) => {
    loadCanvasData(d)
    $message.success('临时数据加载成功')
  })
}

const handleSaveCanvas = () => {
  const d = getCanvasData()
  const filename = `${info.value.title}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.json`
  const blob = new Blob([JSON.stringify(d)], { type: 'application/json;charset=utf-8' })
  saveAs(blob, filename)
}

const refLoadCanvas = ref()
const handleLoadCanvas = ({ file }) => {
  readFileAs(file.file, 'text').then((text) => {
    try {
      const d = JSON.parse(text)
      loadCanvasData(d)
    } catch (err) {
      console.error(err)
      $message.error('加载数据失败')
    }
    refLoadCanvas.value.clear()
  })
}

const getCanvasData = () => {
  return cloneDeep({
    info: info.value,
    picture: picture.value,
  })
}

const loadCanvasData = (d) => {
  if (!d) return
  info.value = d.info
  picture.value = d.picture
}

const readFileAs = (file, type = 'text') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    if (type === 'text') {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  })
}
</script>

<template>
  <div class="fragment-puzzle full-ctn">
    <n-config-provider :theme="darkTheme" abstract>
      <div class="tools col-ctn">
        <n-form ref="formRef" :label-width="80" label-placement="left" :model="info" size="medium">
          <n-form-item path="title" label="名称">
            <n-input v-model:value="info.title" placeholder="名称"></n-input>
          </n-form-item>
          <n-form-item label="参考图片">
            <n-space>
              <n-upload accept="image/*" :max="1" @change="handleSelectReferImg" :show-file-list="false">
                <n-button>上传</n-button>
              </n-upload>
              <n-button v-if="info.referImg" @click="handleEditReferImg">编辑</n-button>
            </n-space>
          </n-form-item>
          <n-form-item path="readonly" label="只读">
            <n-switch v-model:value="info.readonly"></n-switch>
          </n-form-item>
          <template v-if="activeFragment">
            <n-form-item label="颜色">
              <n-color-picker v-model:value="activeFragment.fill"></n-color-picker>
            </n-form-item>
            <n-form-item>
              <n-space>
                <n-button @click="handleDeleteFragment">删除碎片</n-button>
              </n-space>
            </n-form-item>
          </template>
        </n-form>
        <div class="mt-auto">
          <n-space justify="start">
            <n-button @click="handleSaveTempCanvas">暂存</n-button>
            <n-button @click="handleLoadTempCanvas">暂取</n-button>
            <n-button @click="handleSaveCanvas">保存</n-button>
            <n-upload
              accept="application/json"
              :max="1"
              @change="handleLoadCanvas"
              :show-file-list="false"
              ref="refLoadCanvas"
            >
              <n-button>读取</n-button>
            </n-upload>
          </n-space>
        </div>
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
    outline: 1px solid #ccc;
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
