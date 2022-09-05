/*
 * @Description:
 * @Author: ZY
 * @Date: 2021-01-08 19:21:46
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-21 21:26:26
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const chartsRouter: Array<RouteRecordRaw> = [
  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'Charts',
    meta: {
      title: 'charts',
      icon: '#iconchart1'
    },
    children: [
      {
        path: 'bar-chart',
        component: () =>
          import(
            /* webpackChunkName: "BarChart" */ '@/views/charts/BarChartDemo.vue'
          ),
        name: 'BarChartDemo',
        meta: {
          title: '柱状图',
          noCache: true
        }
      },
      {
        path: 'line-chart',
        component: () =>
          import(
            /* webpackChunkName: "LineChart" */ '@/views/charts/LineChartDemo.vue'
          ),
        name: 'LineChartDemo',
        meta: {
          title: '折线图',
          noCache: true
        }
      }
    ]
  }
]

export default chartsRouter
