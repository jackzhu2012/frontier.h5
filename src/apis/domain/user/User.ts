import type { UserId, UserProperties } from '@/apis/domain/user/types'

export class User {
  private constructor(private readonly id: UserId, private readonly name: string) {
    this.id = id
    this.name = name
  }

  static fromProperties(properties: UserProperties): User {
    return new User(properties.id, properties.name)
  }
}