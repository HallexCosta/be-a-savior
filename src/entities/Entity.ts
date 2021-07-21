import { PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

export abstract class Entity {
  @PrimaryColumn()
  public readonly id: string

  @CreateDateColumn()
  public readonly created_at: Date

  @UpdateDateColumn()
  public readonly updated_at: Date

  public constructor() {
    if (!this.id) {
      this.id = uuid()
    }

    const date = new Date()

    if (!this.created_at) {
      this.created_at = date
    }

    if (!this.updated_at) {
      this.updated_at = date
    }
  }
}
