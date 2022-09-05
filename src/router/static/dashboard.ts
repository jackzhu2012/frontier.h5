import { RouteRecordRaw } from "vue-router"
import Layout from '@/layout/index.vue'

const DashboardRouter: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Index.vue'),
        name: 'Dashboard',
        meta: {
          title: '仪表盘'
        }
      }
    ]
  }
]

export default DashboardRouter