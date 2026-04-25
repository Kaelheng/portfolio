import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

function resolveGithubPagesBase() {
  if (process.env.GITHUB_ACTIONS !== 'true') return '/'

  const repository = process.env.GITHUB_REPOSITORY ?? ''
  const repoName = repository.split('/')[1] ?? ''
  if (!repoName || repoName.endsWith('.github.io')) return '/'
  return `/${repoName}/`
}

export default defineConfig({
  base: resolveGithubPagesBase(),
  plugins: [vue(), tailwindcss()],
})

