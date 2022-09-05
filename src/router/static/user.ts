import { RouteRecordRaw } from "vue-router"

const UserRouter: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "user" */'@/views/user/login/index.vue')
  }
]

export default UserRouter