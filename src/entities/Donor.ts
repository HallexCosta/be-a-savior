import { User, UserData } from '@entities/User'

export class Donor extends User {
  public readonly owner: string = 'donor'

  constructor(donor: UserData) {
    super()
    Object.assign(this, donor)
  }
}
