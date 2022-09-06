import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const ProfileRouter: Array<RouteRecordRaw> = [
  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '操作'
    },
    children: [
      {
        path: 'clipboard',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/clipboard/Index.vue'),
        name: 'clipboard',
        meta: {
          title: '剪贴板',
          nocache: true
        }
      },
      {
        path: 'clipboard1',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/clipboard/Index.vue'),
        name: 'clipboard1',
        meta: {
          title: '剪贴板1',
          nocache: true,
          hidden: true
        }
      },
    ]
  }
]

export default ProfileRouter
