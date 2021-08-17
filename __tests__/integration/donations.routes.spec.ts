import dirty from 'dirty-chai'
import { SuperTest, Test } from 'supertest'
import { expect, use } from 'chai'

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
      amount: 1010,
      incident_id: incident.id,
      donor_id: donor.id
    }

    const response = await agent
      .post('/donations')
      .send(body)
      .set('Authorization', `bearer ${token}`)

    const expected = response.body

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
  })
})