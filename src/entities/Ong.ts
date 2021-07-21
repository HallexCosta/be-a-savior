import { Entity } from 'typeorm'

import { User } from '@entities'

@Entity('ongs')
export class Ong extends User {}
