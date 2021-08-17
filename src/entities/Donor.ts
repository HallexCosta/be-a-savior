import { Entity } from 'typeorm'

import { User } from '@entities/User'

@Entity('donors')
export class Donor extends User {}
