import { ActionTree, ActionContext } from 'vuex'
import { RootState, useStore } from '@/store'
import { state, UserState } from './state'
import { Mutations } from './mutations'
import { UserActionTypes, UserMutationTypes } from './types'
import { loginRequest, userInfoRequest } from '@/apis/system/user'
import { removeToken, setToken } from '@/utils/cookies'
import { PermissionActionType } from '../permission/types'
import router, { resetRouter } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
const OK = 0
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<UserState, RootState>, 'commit'>

export interface Actions {
  [UserActionTypes.ACTION_LOGIN](
    { commit }: AugmentedActionContext,
    userInfo: { username: string, password: string }
  ): void
  [UserActionTypes.ACTION_RESET_TOKEN](
    { commit }: AugmentedActionContext
  ): void
  [UserActionTypes.ACTION_GET_USER_INFO](
    { commit }: AugmentedActionContext
  ): void
  [UserActionTypes.ACTION_CHANGE_ROLES](
    { commit }: AugmentedActionContext, role: string
  ): void
  [UserActionTypes.ACTION_LOGIN_OUT](
    { commit }: AugmentedActionContext,
  ): void
}

export const actions: ActionTree<UserState, RootState> & Actions = {

  async [UserActionTypes.ACTION_LOGIN](
    { commit }: AugmentedActionContext,
    userInfo: { username: string, password: string }
  ) {
    try {
      let { username, password } = userInfo
      username = username.trim()

      await loginRequest({ username, password }).then(async (res) => {
        if (res?.code === OK && res.data.accessToken) {
          setToken(res.data.accessToken)
          commit(UserMutationTypes.SET_TOKEN, res.data.accessToken)
        } else {
          ElMessage.error(res?.msg)
          // params.callback()
        }
      })
    } catch (error) {
      ElMessage.error(error as string)
    }
  },

  [UserActionTypes.ACTION_RESET_TOKEN](
    { commit }: AugmentedActionContext) {
    removeToken()
    commit(UserMutationTypes.SET_TOKEN, '')
    commit(UserMutationTypes.SET_ROLES, [])
  },

  async [UserActionTypes.ACTION_GET_USER_INFO](
    { commit }: AugmentedActionContext
  ) {
    if (state.token === '') {
      throw Error('token is undefined!')
    }
    await userInfoRequest().then((res) => {
      if (res?.code === OK) {
        commit(UserMutationTypes.SET_ROLES, res.data.roles)
        commit(UserMutationTypes.SET_NAME, res.data.name)
        commit(UserMutationTypes.SET_AVATAR, res.data.avatar)
        commit(UserMutationTypes.SET_EMAIL, res.data.email)
        commit(UserMutationTypes.SET_INTRODUCTION, res.data.introduction)
        return res
      } else {
        throw Error('Verification failed, please Login again.')
      }
    })
  },

  async [UserActionTypes.ACTION_CHANGE_ROLES](
    { commit }: AugmentedActionContext,
    role: string
  ) {
    const token = role + '-token'
    const store = useStore()
    commit(UserMutationTypes.SET_TOKEN, token)
    setToken(token)
    await store.dispatch(UserActionTypes.ACTION_GET_USER_INFO, undefined)
    store.dispatch(PermissionActionType.ACTION_SET_ROUTES, undefined)
    store.state.permission.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
  },

  [UserActionTypes.ACTION_LOGIN_OUT](
    { commit }: AugmentedActionContext
  ) {
    console.log(commit)
    removeToken()
    commit(UserMutationTypes.SET_TOKEN, '')
    commit(UserMutationTypes.SET_ROLES, [])
    resetRouter()
  }
}
