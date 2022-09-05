import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const ProfileRouter: Array<RouteRecordRaw> = [
  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/clipboard/Index.vue'),
        name: 'Clipboard',
        meta: {
          title: '剪贴板'
        }
      }
    ]
  }
]

export default ProfileRouter
