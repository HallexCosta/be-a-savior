import { Column } from 'typeorm'

import { BaseEntity } from '@entities'

export abstract class User extends BaseEntity {
  @Column()
  public readonly name: string

  @Column()
  public readonly email: string

  @Column()
  public readonly password: string

  @Column()
  public readonly phone: string
}
