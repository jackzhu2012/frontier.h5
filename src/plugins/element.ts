import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/src/index.scss'
import { useStore } from '@/store'
export default function loadComponent(app: any) {
  const size = useStore().state.app.size || 'medium'
  app.use(ElementPlus, { size })
  // app.config.globalProperties.$message = ElMessage
}
