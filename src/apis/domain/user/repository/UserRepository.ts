import type { User } from '@/apis/domain/user/User'

export interface UserRepository {
  getCurrentUser(): User
}