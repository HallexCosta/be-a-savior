import dirty from 'dirty-chai'
import { expect, use } from 'chai'
import { SuperTest, Test } from 'supertest'

import { app } from '@app'

import { Donor } from '@entities/Donor'
import { Incident } from '@entities/Incident'
import { Ong } from '@entities/Ong'

import {
  createTestingConnection,
  createFakeIncident,
  createAgent,
  createFakeOng,
  loginWithFakeDonor,
  createFakeDonor,
  loginWithFakeOng
} from './fakes/stubs'

use(dirty)

export function donations(): void {
  describe('Donation Routes', () => {
    let agent: SuperTest<Test>
    let ong: Ong
    let donor: Donor
    let incident: Incident
    let token: string

    before(async () => {
      await createTestingConnection()
      agent = createAgent(app)
      ong = await createFakeOng(agent)
      donor = await createFakeDonor(agent)
      incident = await createFakeIncident(agent, {
        ong_id: ong.id,
        token: await loginWithFakeOng(agent)
      })
      token = await loginWithFakeDonor(agent)
    })

    it('Should be create new Donation POST (/donations)', async () => {
      const body = {
        amount: 1788,
        incident_id: incident.id,
        ong_id: ong.id
      }

      const response = await agent
        .post('/donations')
        .send(body)
        .set('Authorization', `bearer ${token}`)

      const expected = response.body

      expect(expected).to.not.be.undefined()
      expect(expected).to.have.property('id')
    })

    it('Should be thrown error if try donate in same incident POST (/donations)', async () => {
      const body = {
        amount: 1788,
        incident_id: incident.id,
        donor_id: donor.id
      }

      const response = await agent
        .post('/donations')
        .send(body)
        .set('Authorization', `bearer ${token}`)

      const expected = response.body

      expect(expected).to.have.property('message')
    })

    it('Should be to list all donations GET (/donations)', async () => {
      const response = await agent.get('/donations').send()

      const expected = response.body

      expect(expected).to.not.be.undefined()
      expect(expected[0]).to.have.property('id')
      expect(expected[0]).to.have.property('incident_id')
      expect(expected[0]).to.have.property('donor_id')
    })

    it('Should be to return empty list donations with fake ong_id GET (/donations?ong_id=)', async () => {
      const response = await agent.get('/donations?ong_id=FAKE ONG ID').send()

      const expected = response.body

      expect(expected).to.not.be.undefined()
      expect(expected).to.have.lengthOf(0)
    })

    it('Should be to list donations by ong_id GET (/donations?ong_id=)', async () => {
      const response = await agent.get(`/donations?ong_id=${ong.id}`).send()

      const expected = response.body

      expect(expected).to.not.be.undefined()
      expect(expected[0]).to.have.property('id')
      expect(expected[0]).to.have.property('incident_id')
      expect(expected[0]).to.have.property('donor_id')
      expect(expected[0]).to.have.property('ong_id')
    })
  })
}
