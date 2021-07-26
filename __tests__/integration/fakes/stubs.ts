import { v4 as uuid } from 'uuid'
import { Connection, createConnection } from 'typeorm'

export async function createTestingConnection(): Promise<Connection> {
  return await createConnection({
    name: uuid(),
    type: 'sqlite',
    database: 'src/database/database-test.sqlite',
    migrations: ['src/database/migrations/*.ts'],
    entities: ['src/entities/*.ts'],
    migrationsRun: true,
    dropSchema: true,
    cli: {
      migrationsDir: 'src/database/migrations',
      entitiesDir: 'src/entities'
    }
  })
}
