import dirty from 'dirty-chai'
import request from 'supertest'
import { expect, use } from 'chai'
import { unlink } from 'fs'
import { createConnection } from 'typeorm'

import { app } from '@app'

use(dirty)

describe('Donor Routes', () => {
  let id: string

  before(async () => {
    const connection = await createConnection({
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
    await connection.close()
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

    id = expected.id

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })

  it('Should be able list Donors GET (/donors)', async () => {
    const response = await request(app).get('/donors')
    const expected = response.body

    expect(expected[0]).to.have.property('id')
    expect(expected[0]).to.have.property('created_at')
    expect(expected[0]).to.have.property('updated_at')
  })

  it('Should be able list one Donor by Id GET (/donors/:id)', async () => {
    const response = await request(app).get(`/donors/${id}`)
    const expected = response.body

    expect(expected).to.have.property('id')
    expect(expected.email).to.be.equal('some@hotmail.com')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })
})
