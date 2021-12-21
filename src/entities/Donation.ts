import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm'

import { BaseEntity } from '@entities/BaseEntity'
import { Incident } from '@entities/Incident'
import { Donor } from '@entities/Donor'
import { Ong } from '@entities/Ong'

@Entity('donations')
export class Donation extends BaseEntity {
  @Column()
  public readonly incident_id: string

  @JoinColumn({ name: 'incident_id' })
  @ManyToOne(() => Incident, incident => incident.donations)
  public readonly incident: Incident

  @Column()
  public readonly donor_id: string

  @JoinColumn({ name: 'donor_id' })
  @OneToOne(() => Donor)
  public readonly donor: Donor

  @Column()
  public readonly ong_id: string

  @JoinColumn({ name: 'ong_id' })
  @OneToOne(() => Ong)
  public readonly ong: Ong
}
