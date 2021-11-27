import { Entity, Column } from 'typeorm'

import { Exclude } from 'class-transformer'

import { BaseEntity } from '@entities/BaseEntity'

export type UserData = Omit<
  User,
  'id' | 'created_at' | 'updated_at' | 'owner' | 'setOwner'
>


@Entity('users')
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

  @Column()
  public owner: string

  setOwner(owner: string) {
    this.owner = owner
  }
}
