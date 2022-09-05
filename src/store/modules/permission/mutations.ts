import { MutationTree } from 'vuex'
import { PermissionState } from './state'
import { PermissionMutationType } from './types'
import { RouteRecordRaw } from 'vue-router'
import { staticRoutes } from '@/router'

export type Mutations<S = PermissionState> = {
  [PermissionMutationType.SET_ROUTES](state: S, routes: RouteRecordRaw[]): void
}

export const mutations: MutationTree<PermissionState> & Mutations = {
  [PermissionMutationType.SET_ROUTES](state: PermissionState, routes: RouteRecordRaw[]) {
    state.routes = staticRoutes.concat(routes as unknown as RouteRecordRaw[])
    state.dynamicRoutes = routes as unknown as RouteRecordRaw[]
  }
}
