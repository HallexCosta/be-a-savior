import { User } from '@entities'
import { Entity } from 'typeorm'

@Entity('donors')
export class Donor extends User {}
