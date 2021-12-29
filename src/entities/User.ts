import { Entity, Column, JoinColumn, OneToMany } from 'typeorm'

import { Exclude } from 'class-transformer'

import { BaseEntity } from '@entities/BaseEntity'
import { Donation } from '@entities/Donation'

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

  @JoinColumn({ name: 'donation_id' })
  @OneToMany(() => Donation, donation => donation.donor)
  public donations?: Donation[]
}
