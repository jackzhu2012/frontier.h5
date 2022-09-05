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
    language: string
    size: string
}

const state: AppState = {
    device: DeviceType.Desktop,
    sideBar: {
        isOpen: false,
        withoutAnimation: false
    },
    language: 'zh-cn',
    size: 'medium'
}

export {
    DeviceType,
    state,
    AppState
}