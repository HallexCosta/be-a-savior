import { User, UserData } from '@entities/User'

export class Donor extends User {
  constructor(donor: UserData) {
    super()
    Object.assign(this, donor)
    this.setOwner('donor')
  }
}
