import { PartialEntity, User } from '@entities'

export class Donor extends User<Donor> {
  public constructor(props: PartialEntity<Donor>) {
    super(props)
  }
}
