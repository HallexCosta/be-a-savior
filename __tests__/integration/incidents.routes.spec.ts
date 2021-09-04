import dirty from 'dirty-chai'
import { expect, use } from 'chai'
import { SuperTest, Test } from 'supertest'

import { app } from '@app'

import { Ong } from '@entities/Ong'

import {
  createAgent,
  createFakeDonation,
  createFakeDonor,
  createTestingConnection,
  createFakeOng,
  loginWithFakeDonor,
  loginWithFakeOng,
  createFakeIncident
} from './fakes/stubs'

use(dirty)

export function incidents(): void {
  describe('Incidents Routes', () => {
    let incident_id: string
    let ong: Ong
    let ongToken: string
    let agent: SuperTest<Test>

    before(async () => {
      await createTestingConnection()
      agent = createAgent(app)
      ong = await createFakeOng(agent)
      ongToken = await loginWithFakeOng(agent)
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
        description: 'This is a description'
      }

      const response = await agent
        .post('/incidents')
        .send(body)
        .set('Authorization', `bearer ${ongToken}`)

      const expected = response.body

      incident_id = expected.id

      expect(expected).to.not.be.undefined()
      expect(expected).to.have.property('id')
      expect(expected).to.have.property('created_at')
      expect(expected).to.have.property('updated_at')
    })

    it('Should be able list incidents GET (/incidents)', async () => {
      const { id: ong_id } = await createFakeOng(agent)

      const ongToken = await loginWithFakeOng(agent)

      await createFakeIncident(agent, {
        ongToken,
        ong_id
      })

      const response = await agent
        .get('/incidents')
        .set('Authorization', `bearer ${ongToken}`)

      const expected = response.body

      expect(expected[0]).to.have.property('id')
      expect(expected[0]).to.have.property('created_at')
      expect(expected[0]).to.have.property('updated_at')
    })

    it('Should be able list incidents by ong id GET (/incidents?ong_id=)', async () => {
      const response = await agent
        .get(`/incidents?ong_id=${ong.id}`)
        .set('Authorization', `bearer ${ongToken}`)

      const expected = response.body

      expect(expected[0]).to.have.property('id')
      expect(expected[0]).to.have.property('created_at')
      expect(expected[0]).to.have.property('updated_at')
    })

    it('Should be able list one Incident by Id GET (/incidents/:id)', async () => {
      const response = await agent
        .get(`/incidents/${incident_id}`)
        .set('Authorization', `bearer ${ongToken}`)

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
        .set('Authorization', `bearer ${ongToken}`)

      const expected = response.body

      expect(expected.name).to.be.equal('Some a name updated')
      expect(expected.cost).to.be.equal(100)
      expect(expected.description).to.be.equal('This is a description updated')
    })

    it('Should be able delete one Incident by Id DELETE (/incidents/:id)', async () => {
      const response = await agent
        .delete(`/incidents/${incident_id}`)
        .set('Authorization', `bearer ${ongToken}`)

      const expected = response.body

      expect(expected).to.have.property('id')
      expect(expected).to.have.property('created_at')
      expect(expected).to.have.property('updated_at')
    })

    it('Should be able list non-donated incidents GET (/incidents?donated=false)', async () => {
      const ongToken = await loginWithFakeOng(agent)

      await createFakeIncident(agent, {
        ong_id: ong.id,
        ongToken
      })

      const response = await agent
        .get('/incidents?donated=false')
        .set('Authorization', `bearer ${ongToken}`)

      const incidents = response.body

      const nullableDonationsIds = []

      for (const incident of incidents) {
        nullableDonationsIds.push(incident.donation_id)
      }

      const isNonDonatedIncidents = nullableDonationsIds.includes(null)

      expect(isNonDonatedIncidents).to.be.true()
    })

    it('Should be able list donated incidents GET (/incidents?donated=true)', async () => {
      await createFakeDonor(agent)

      const ongToken = await loginWithFakeOng(agent)
      const { id: incident_id } = await createFakeIncident(agent, {
        ong_id: ong.id,
        ongToken
      })

      await createFakeDonation(agent, {
        incident_id,
        donorToken: await loginWithFakeDonor(agent)
      })

      const response = await agent
        .get('/incidents?donated=true')
        .set('Authorization', `bearer ${ongToken}`)

      const incidents = response.body

      const nullableDonationsIds = []

      for (const incident of incidents) {
        nullableDonationsIds.push(incident.donation_id)
      }

      const isNonDonatedIncidents = nullableDonationsIds.includes(null)

      expect(isNonDonatedIncidents).to.be.false()
    })
  })
}
