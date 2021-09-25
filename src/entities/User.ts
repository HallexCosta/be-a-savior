import { Column } from 'typeorm'

import { Exclude } from 'class-transformer'

import { BaseEntity } from '@entities/BaseEntity'

export abstract class User extends BaseEntity {
  @Column()
  public readonly name: string

  @Column()
  public readonly email: string

  @Exclude()
  @Column()
  public readonly password: string

  @Column()
  public readonly phone: string
}
