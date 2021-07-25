import dirty from 'dirty-chai'
import request from 'supertest'
import { expect, use } from 'chai'

import { app } from '@app'

import { createTestingConnection } from './fakes/stubs'

use(dirty)

describe('Ongs Routes', () => {
  let id: string

  before(async () => await createTestingConnection())

  it('Should be able to create new Ong POST (/ongs)', async () => {
    const body = {
      name: 'Some a name',
      email: 'asome@hotmail.com',
      password: 'some123',
      phone: '(99) 99999-9999'
    }

    const response = await request(app).post('/ongs').send(body)
    const expected = response.body

    id = expected.id

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })

  it('Should be able list Ongs GET (/ongs)', async () => {
    const response = await request(app).get('/ongs')
    const expected = response.body

    expect(expected[0]).to.have.property('id')
    expect(expected[0]).to.have.property('created_at')
    expect(expected[0]).to.have.property('updated_at')
  })
})
