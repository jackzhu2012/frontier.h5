import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const ExampleRouter: RouteRecordRaw[] = [
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    meta: {
      title: 'example',
      icon: '#iconexample'
    },
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "example-list" */ '@/views/example/List.vue'),
        name: 'ArticleList',
        meta: {
          title: 'articleList',
          icon: 'list'
        }
      }
    ]
  }
]

export default ExampleRouter
