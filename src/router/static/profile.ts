import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const ProfileRouter: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/Index.vue'),
        name: 'Profile',
        meta: {
          title: '个人资料',
          icon: 'user',
          noCache: true
        }
      }
    ]
  }
]

export default ProfileRouter
