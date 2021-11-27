import { User, UserData } from '@entities/User'

export class Ong extends User {
  constructor(ong: UserData) {
    super()
    Object.assign(this, ong)
    this.setOwner('ong')
  }
}
