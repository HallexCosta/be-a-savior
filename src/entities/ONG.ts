import { PartialEntity, User } from '@entities'

export class ONG extends User<ONG> {
  public constructor(props: PartialEntity<ONG>) {
    super(props)
  }
}
