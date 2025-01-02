import * as matter from 'gray-matter'
// 使用import.meta.glob导入这个文件夹下面的md文件并导入一个列表，导入纯文本
const modules = import.meta.glob('./**/*.md', { query: '?raw' })

export function getLetterList() {
  const letterList = []

  for (const path in modules) {
    if (modules.hasOwnProperty(path)) {
      const loader = getMarkdownLoader(modules[path])
      letterList.push(loader)
    }
  }

  return letterList
}

async function getMarkdownLoader(rawLoader) {
  return async () => {
    const text = (await rawLoader()).default
    return matter(text)
  }
}

export const letterList = getLetterList()
