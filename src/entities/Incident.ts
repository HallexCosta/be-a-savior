import { BaseEntity } from '@entities'

export class Incident extends BaseEntity {
  public readonly name: string
  public readonly description: string
  public readonly coast: number
}
