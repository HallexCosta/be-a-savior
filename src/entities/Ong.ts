import { Entity } from 'typeorm'

import { User } from '@entities/User'

@Entity('ongs')
export class Ong extends User {}
