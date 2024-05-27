import { h } from 'vue'
import { NButton } from 'naive-ui'
import ImageCropper from '@/components/ImageCropper.vue'

export function useImageCropper(cfg, modal) {
  const { src, onConfirm, onClose } = cfg

  const ins = h(ImageCropper, { src })
  const m = modal.create({
    title: '图片裁剪',
    preset: 'card',
    style: {
      width: '800px',
    },
    content: () => ins,
    footer: () =>
      h('div', { class: 'action-right' }, [
        h(
          NButton,
          {
            onClick: () => {
              if (typeof onClose === 'function') onClose()
              m.destroy()
            },
          },
          () => '关闭'
        ),
        h(
          NButton,
          {
            type: 'primary',
            onClick: () => {
              if (typeof onConfirm === 'function') {
                const newUrl = ins.component.exposed.getCroppedUrl()
                onConfirm(newUrl)
              }
              m.destroy()
            },
          },
          () => '确认'
        ),
      ]),
  })
}
