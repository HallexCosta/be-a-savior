import { v4 as uuid } from 'uuid'

import { Override } from '@common'

export type PartialEntity<T> = Override<T, Partial<Entity<T>>>

export abstract class Entity<EntityType> {
  public readonly id: string
  public readonly created_at: Date
  public readonly updated_at: Date

  public constructor(props: PartialEntity<EntityType>) {
    Object.assign(this, props)

    if (!props.id) {
      this.id = uuid()
    }

    if (!props.created_at) {
      this.created_at = new Date()
    }

    if (!props.updated_at) {
      this.updated_at = new Date()
    }

    Object.freeze(this)
  }
}
