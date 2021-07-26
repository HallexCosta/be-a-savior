import dirty from 'dirty-chai'
import request from 'supertest'
import { expect, use } from 'chai'

import { app } from '@app'

import { createFakeOng, createTestingConnection } from './fakes/stubs'

use(dirty)

describe('Incidents Routes', () => {
  let id: string

  before(async () => await createTestingConnection())

  it('Should be able to create new Incident POST (/incidents)', async () => {
    const ong = await createFakeOng(request(app))

    const body = {
      name: 'Some a name',
      coast: 100.5,
      description: 'This is a description',
      ong_id: ong.id
    }

    const response = await request(app).post('/incidents').send(body)
    const expected = response.body

    id = expected.id

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })

  it('Should be able to throw an error if ong_id is fake POST (/incidents)', async () => {
    const body = {
      name: 'Some a name',
      coast: 100.5,
      description: 'This is a description',
      ong_id: 'this is fake ong id'
    }

    const response = await request(app).post('/incidents').send(body)
    const expected = response.body

    expect(expected).to.have.property('error')
  })

  it('Should be able list incidents GET (/incidents)', async () => {
    const response = await request(app).get('/incidents')
    const expected = response.body

    expect(expected[0]).to.have.property('id')
    expect(expected[0]).to.have.property('created_at')
    expect(expected[0]).to.have.property('updated_at')
  })
})
