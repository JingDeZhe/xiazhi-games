import fs from 'fs'
import matter from 'gray-matter'

export function parseMarkdown(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data: frontmatter, content } = matter(fileContent)
  return { frontmatter, content }
}
