import dirty from 'dirty-chai'
import request from 'supertest'
import { expect, use } from 'chai'

import { app } from '@app'

import { Ong } from '@entities'

import { createFakeOng, createTestingConnection } from './fakes/stubs'

use(dirty)

describe('Incidents Routes', () => {
  let incident_id: string
  let ong: Ong

  before(async () => {
    await createTestingConnection()
    ong = await createFakeOng(request(app))
  })

  it('Should be able to create new Incident POST (/incidents)', async () => {
    const body = {
      name: 'Some a name',
      coast: 100.5,
      description: 'This is a description',
      ong_id: ong.id
    }

    const response = await request(app).post('/incidents').send(body)
    const expected = response.body

    incident_id = expected.id

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

  it('Should be able list incidents by ong id GET (/incidents?ong_id=)', async () => {
    const response = await request(app).get(`/incidents?ong_id=${ong.id}`)
    const expected = response.body

    expect(expected[0]).to.have.property('id')
    expect(expected[0]).to.have.property('created_at')
    expect(expected[0]).to.have.property('updated_at')
  })

  it('Should be able list one Incident by Id GET (/incidents/:id)', async () => {
    const response = await request(app).get(`/incidents/${incident_id}`)
    const expected = response.body

    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })

  it('Should be able update one Incident by Id PATCH (/incidents/:id)', async () => {
    const body = {
      name: 'Some a name updated',
      coast: 100,
      description: 'This is a description updated'
    }

    const response = await request(app)
      .patch(`/incidents/${incident_id}`)
      .send(body)

    const expected = response.body

    expect(expected.name).to.be.equal('Some a name updated')
    expect(expected.coast).to.be.equal(100)
    expect(expected.description).to.be.equal('This is a description updated')
  })

  it('Should be able delete one Incident by Id DELETE (/incidents/:id)', async () => {
    const response = await request(app).delete(`/incidents/${incident_id}`)
    const expected = response.body

    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })
})
