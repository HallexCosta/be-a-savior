import { Entity, PartialEntity } from '@entities'

export abstract class User<UserType> extends Entity<User<UserType>> {
  public readonly name: string
  public readonly email: string
  public readonly password: string
  public readonly phone: string

  public constructor(props: PartialEntity<User<UserType>>) {
    super(props)
  }
}
