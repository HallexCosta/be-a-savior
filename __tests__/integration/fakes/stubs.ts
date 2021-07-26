import { v4 as uuid } from 'uuid'
import { Connection, createConnection } from 'typeorm'
import { SuperTest, Test } from 'supertest'
import { Ong } from '@entities'

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

export async function createFakeOng(app: SuperTest<Test>): Promise<Ong> {
  const body = {
    name: 'Some a name',
    email: 'asome@hotmail.com',
    password: 'some123',
    phone: '(99) 99999-9999'
  }

  const response = await app.post('/ongs').send(body)

  return response.body
}
