import { createApp } from 'vue'

export function loadAllPlugins(app: ReturnType<typeof createApp>) {
  const files = import.meta.globEager('./**/*.ts')
  Object.keys(files).forEach(key => {
    if (typeof files[key].default === 'function') {
      if (key !== './index.ts') files[key].default(app)
    }
  })
}
