/**
 * 弃用，改用自动引入
 */

import { create, NButton, NCollapse, NCollapseItem } from 'naive-ui'

export function useNaive(app) {
  const naive = create({
    components: [NButton, NCollapse, NCollapseItem],
  })
  app.use(naive)
}
