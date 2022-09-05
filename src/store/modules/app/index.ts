import { Store as VuexStore, Module, CommitOptions, DispatchOptions } from 'vuex'
import { RootState } from '@/store'
import { state } from './state'
import { mutations, Mutations } from './mutations'
import { actions, Actions } from './actions'
import type { AppState } from './state'

type AppStore<S = AppState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'>
  & {
    commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
      key: K,
      payload: P,
      options?: CommitOptions
    ): ReturnType<Mutations[K]>
  } & {
    dispatch<K extends keyof Actions>(
      key: K,
      payload: Parameters<Actions[K]>[1],
      options?: DispatchOptions
    ): ReturnType<Actions[K]>
  };

const store: Module<AppState, RootState> = {
  state,
  mutations,
  actions
}

export {
  AppStore,
  AppState,
  store,
  mutations,
  actions
}