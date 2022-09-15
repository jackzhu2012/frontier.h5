import { MutationTree } from 'vuex'
import { AppState, DeviceType } from './state'
import { AppMutationTypes } from './mutation-types'
import { setSidebarStatus, setLanguage, setSize } from '@/utils/cookies'

export type Mutations<S = AppState> = {
  [AppMutationTypes.TOGGLE_DOCKED_NAV](state: S): void
  [AppMutationTypes.SET_DOCKED_NAV_STATE](state: S, dockedNavState: 'NORMAL' | 'MINI'): void
  [AppMutationTypes.TOGGLE_SIDEBAR](state: S, withoutAnimation: boolean): void
  [AppMutationTypes.CLOSE_SIDEBAR](state: S, withoutAnimation: boolean): void
  [AppMutationTypes.TOGGLE_DEVICE](state: S, device: DeviceType): void
  [AppMutationTypes.SET_LANGUAGE](state: S, language: string): void
  [AppMutationTypes.SET_SIZE](state: S, size: string): void
}

export const mutations: MutationTree<AppState> & Mutations = {
  [AppMutationTypes.TOGGLE_DOCKED_NAV](state: AppState) {
    state.dockedNav.state = state.dockedNav.state === 'NORMAL' ? 'MINI' : 'NORMAL'
  },

  [AppMutationTypes.SET_DOCKED_NAV_STATE](state: AppState, dockedNavState: 'NORMAL' | 'MINI') {
    state.dockedNav.state = dockedNavState
  },

  [AppMutationTypes.TOGGLE_SIDEBAR](state: AppState, withoutAnimation: boolean) {
    state.sideBar.isOpen = !state.sideBar.isOpen
    state.sideBar.withoutAnimation = withoutAnimation
    if (state.sideBar.isOpen) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  },

  [AppMutationTypes.CLOSE_SIDEBAR](state: AppState, withoutAnimation: boolean) {
    state.sideBar.isOpen = false
    state.sideBar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  },

  [AppMutationTypes.TOGGLE_DEVICE](state: AppState, device: DeviceType) {
    state.device = device
  },

  [AppMutationTypes.SET_LANGUAGE](state: AppState, language: string) {
    state.language = language
    setLanguage(state.language)
  },

  [AppMutationTypes.SET_SIZE](state: AppState, size: string) {
    state.size = size
    setSize(state.size)
  }

}
