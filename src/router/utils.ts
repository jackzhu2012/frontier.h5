import { RouteRecordRaw } from "vue-router"

export const loadModuleRouters = (path: 'static' | 'dynamic'): RouteRecordRaw[] => {

  //直接读取文件夹下的所有的模块路由文件
  const routerFiles = path === "static"
    ? import.meta.globEager('./static/**/*.ts')
    : import.meta.globEager('./dynamic/**/*.ts')

  const modules: RouteRecordRaw[] = []
  //形成模块路由数组
  Object.keys(routerFiles).forEach(file => {
    if (file === './index.ts') return
    modules.push(routerFiles[file].default[0])
  })
  console.log(modules,'@@@@@@@')
  return modules
}