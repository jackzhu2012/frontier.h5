import { useStore } from "../../../src/store";
import { AppMutationTypes } from "../../../src/store/modules/app/mutation-types";


export class DockedNavApi {
  private _items
  private _store = useStore()

  private constructor() {
    this._items = [];
  }

  static getInstance() {
    return new DockedNavApi()
  }

  get state(): 'NORMAL' | 'MINI' {
    return this._store.state.app.dockedNav.state
  }

  toggleState() {
    this._store.commit(AppMutationTypes.TOGGLE_DOCKED_NAV)
  }

  setState(state: 'NORMAL' | 'MINI') {
    this._store.commit(AppMutationTypes.SET_DOCKED_NAV_STATE, state)
  }
}
