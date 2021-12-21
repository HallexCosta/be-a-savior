import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm'

import { BaseEntity } from '@entities/BaseEntity'
import { Incident } from '@entities/Incident'
import { User } from '@entities/User'

@Entity('donations')
export class Donation extends BaseEntity {
  @Column()
  public readonly amount: number

  @Column()
  public readonly incident_id: string

  @JoinColumn({ name: 'incident_id' })
  @ManyToOne(() => Incident, incident => incident.donations)
  public readonly incident: Incident

  @Column()
  public readonly user_id: string

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  public readonly donor: User
}
