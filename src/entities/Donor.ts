import { Entity } from 'typeorm'

import { User } from '@entities'

@Entity('donors')
export class Donor extends User {}
