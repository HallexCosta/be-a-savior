import request from 'supertest'
import { expect } from 'chai'
import { unlink } from 'fs'
import { Connection, createConnection } from 'typeorm'

import { app } from '@app'

describe('Donor Routes', () => {
  let connection: Connection

  before(async () => {
    connection = await createConnection({
      name: 'App Test',
      type: 'sqlite',
      database: 'src/database/database-test.sqlite',
      migrations: ['src/database/migrations/*.ts'],
      entities: ['src/entities/*.ts'],
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/entities'
      }
    })

    await connection.runMigrations()
  })

  after(() => {
    unlink(`${__dirname}/../../src/database/database-test.sqlite`, err => {
      if (err) console.log('Not possible delete database-test.sqlite')
    })
  })

  it('Should be create new Donor POST (/donors)', async () => {
    const body = {
      name: 'Some a name',
      email: 'some@hotmail.com',
      password: 'some123',
      phone: '(99) 99999-9999'
    }

    const response = await request(app).post('/donors').send(body)
    const expected = response.body

    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })
})
