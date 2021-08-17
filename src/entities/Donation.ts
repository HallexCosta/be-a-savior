import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { BaseEntity } from '@entities/BaseEntity'
import { Incident } from '@entities/Incident'
import { Donor } from '@entities/Donor'

@Entity('donations')
export class Donation extends BaseEntity {
  @Column()
  public readonly incident_id: string

  @JoinColumn({ name: 'incident_id' })
  @OneToOne(() => Incident)
  public readonly incident: Incident

  @Column()
  public readonly donor_id: string

  @JoinColumn({ name: 'donor_id' })
  @OneToOne(() => Donor)
  public readonly donor: Donor
}
