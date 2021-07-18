import { Entity, PartialEntity } from '@entities'

export class Incident extends Entity<Incident> {
  public readonly name: string
  public readonly description: string
  public readonly coast: number

  public constructor(props: PartialEntity<Incident>) {
    super(props)
  }
}
