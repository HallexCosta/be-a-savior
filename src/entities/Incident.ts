import { Column, Entity, JoinColumn, OneToMany, ManyToOne } from 'typeorm'

import { BaseEntity } from '@entities/BaseEntity'
import { User } from '@entities/User'
import { Donation } from '@entities/Donation'

@Entity('incidents')
export class Incident extends BaseEntity {
  @Column()
  public readonly name: string

  @Column()
  public readonly description: string

  @Column()
  public readonly cost: number

  @Column()
  public readonly user_id: string

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  public readonly ong: User

  @OneToMany(() => Donation, donation => donation.incident)
  public readonly donations: Donation[]
}
