enum DeviceType {
  Mobile,
  Desktop,
}

interface AppState {
  device: DeviceType
  sideBar: {
    isOpen: boolean
    withoutAnimation: boolean
  }
  dockedNav: {
    state: 'MINI' | 'NORMAL'
  },
  language: string
  size: string
}

const state: AppState = {
  device: DeviceType.Desktop,
  sideBar: {
    isOpen: false,
    withoutAnimation: false
  },
  dockedNav: {
    state: 'MINI'
  },
  language: 'zh-cn',
  size: 'medium'
}

export {
  DeviceType,
  state,
  AppState
}