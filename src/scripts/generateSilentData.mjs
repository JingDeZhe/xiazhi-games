/**
 * 生成寂静的数据文件
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { parseMarkdown } from '../utils/markdown.mjs'

const postsDir = path.join(__dirname, '../views/silent/data/letters')
const outputFile = path.join(__dirname, '../views/silent/data/index.js')

const files = fs.readdirSync(postsDir)

const postsData = files.map((file) => {
  const filePath = path.join(postsDir, file)
  const { frontmatter, content } = parseMarkdown(filePath)

  // 将内容部分写入单独的文件
  const contentFilePath = path.join(__dirname, `../../public/posts/${file}`)
  fs.writeFileSync(contentFilePath, content)

  return {
    slug: file.replace('.md', ''),
    frontmatter,
    contentPath: `/posts/${file}`, // 懒加载路径
  }
})

// 生成 frontmatter 数据文件
fs.writeFileSync(outputFile, `export const letterList = ${JSON.stringify(postsData, null, 2)};`)

console.log('Markdown data generated!')
