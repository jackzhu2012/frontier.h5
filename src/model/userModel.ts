export interface UserInfoModel {
  id: number
  username: string
  password: string
  name: string
  avatar: string
  introduction: string
  email: string
  phone: string
  roles: string[]
}

export interface UserDesc {
  admin: boolean
  avatar: string
  createBy: string
  dept: any
  deptId: number
  email: string
  nickName: string
  phonenumber: string
  postIds: any
  remark: string
  userName: string
}

export interface Users {
  items: any
}
