import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

import { BaseEntity } from '@entities/BaseEntity'
import { Ong } from '@entities/Ong'
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
  public readonly ong_id: string

  @JoinColumn({ name: 'ong_id' })
  @ManyToOne(() => Ong)
  public readonly ong: Ong

  @Column({ nullable: true })
  public readonly donation_id: string

  @JoinColumn({ name: 'donation_id' })
  @OneToOne(() => Donation)
  public readonly donation: Donation
}
