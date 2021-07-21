import { Entity } from '@entities'
import { Column } from 'typeorm'

export abstract class User extends Entity {
  @Column()
  public readonly name: string

  @Column()
  public readonly email: string

  @Column()
  public readonly password: string

  @Column()
  public readonly phone: string
}
