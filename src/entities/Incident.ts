import { Entity } from '@entities'

export class Incident extends Entity {
  public readonly name: string
  public readonly description: string
  public readonly coast: number
}
