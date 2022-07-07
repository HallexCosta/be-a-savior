import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '@entities/BaseEntity'
import { Incident } from '@entities/Incident'
import { User } from '@entities/User'

@Entity('donations')
export class Donation extends BaseEntity {
  @Column()
  public readonly amount: number

  @Column()
  public readonly incident_id: string

  @ManyToOne(() => Incident, incident => incident.donations)
  @JoinColumn({ name: 'incident_id' })
  public readonly incident: Incident

  @Column()
  public readonly user_id: string

  @ManyToOne(() => User, user => user.donations)
  @JoinColumn({ name: 'user_id' })
  public readonly donor: User
}
