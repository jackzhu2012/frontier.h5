import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import { loadModuleRouters } from "./utils"
import Layout from '@/layout/index.vue'

const staticModules = loadModuleRouters('static')
const dynamicModules = loadModuleRouters('dynamic')

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/Index.vue')
      }
    ]
  },
  ...staticModules
]

export const dynamicRoutes: RouteRecordRaw[] = [
  ...dynamicModules
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes
})

export function resetRouter() {
  const newRouter = router;
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router