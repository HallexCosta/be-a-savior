import { User, UserData } from '@entities/User'

export class Ong extends User {
  public readonly owner: string = 'ong'

  constructor(ong: UserData) {
    super()
    Object.assign(this, ong)
  }
}
