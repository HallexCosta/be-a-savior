import dirty from 'dirty-chai'
import { expect, use } from 'chai'
import { SuperTest, Test } from 'supertest'

import { app } from '@app'

import { Ong } from '@entities/Ong'

import {
  createAgent,
  createFakeOng,
  createTestingConnection,
  loginWithFakeOng
} from './fakes/stubs'

use(dirty)

export const incidents = () => {
  describe('Incidents Routes', () => {
    let incident_id: string
    let ong: Ong
    let token: string
    let agent: SuperTest<Test>

    before(async () => {
      await createTestingConnection()
      agent = createAgent(app)
      ong = await createFakeOng(agent)
      token = await loginWithFakeOng(agent)
    })

    it('Should be able to throw an error if ong_id is fake POST (/incidents)', async () => {
      const body = {
        name: 'Some a name',
        cost: 100.5,
        description: 'This is a description'
      }

      await agent.post('/incidents').send(body).expect(401)
    })

    it('Should be able to create new Incident POST (/incidents)', async () => {
      const body = {
        name: 'Some a name',
        cost: 100.5,
        description: 'This is a description',
        ong_id: ong.id
      }

      const response = await agent
        .post('/incidents')
        .send(body)
        .set('Authorization', `bearer ${token}`)

      const expected = response.body

      incident_id = expected.id

      expect(expected).to.not.be.undefined()
      expect(expected).to.have.property('id')
      expect(expected).to.have.property('created_at')
      expect(expected).to.have.property('updated_at')
    })

    it('Should be able list incidents GET (/incidents)', async () => {
      const response = await agent
        .get('/incidents')
        .set('Authorization', `bearer ${token}`)

      const expected = response.body

      expect(expected[0]).to.have.property('id')
      expect(expected[0]).to.have.property('created_at')
      expect(expected[0]).to.have.property('updated_at')
    })

    it('Should be able list incidents by ong id GET (/incidents?ong_id=)', async () => {
      const response = await agent
        .get(`/incidents?ong_id=${ong.id}`)
        .set('Authorization', `bearer ${token}`)

      const expected = response.body

      expect(expected[0]).to.have.property('id')
      expect(expected[0]).to.have.property('created_at')
      expect(expected[0]).to.have.property('updated_at')
    })

    it('Should be able list one Incident by Id GET (/incidents/:id)', async () => {
      const response = await agent
        .get(`/incidents/${incident_id}`)
        .set('Authorization', `bearer ${token}`)

      const expected = response.body

      expect(expected).to.have.property('id')
      expect(expected).to.have.property('created_at')
      expect(expected).to.have.property('updated_at')
    })

    it('Should be able update one Incident by Id PATCH (/incidents/:id)', async () => {
      const body = {
        name: 'Some a name updated',
        cost: 100,
        description: 'This is a description updated'
      }

      const response = await agent
        .patch(`/incidents/${incident_id}`)
        .send(body)
        .set('Authorization', `bearer ${token}`)

      const expected = response.body

      expect(expected.name).to.be.equal('Some a name updated')
      expect(expected.cost).to.be.equal(100)
      expect(expected.description).to.be.equal('This is a description updated')
    })

    it('Should be able delete one Incident by Id DELETE (/incidents/:id)', async () => {
      const response = await agent
        .delete(`/incidents/${incident_id}`)
        .set('Authorization', `bearer ${token}`)

      const expected = response.body

      expect(expected).to.have.property('id')
      expect(expected).to.have.property('created_at')
      expect(expected).to.have.property('updated_at')
    })
  })
}
