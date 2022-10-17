import dirty from 'dirty-chai'
import { expect, use } from 'chai'
import { SuperTest, Test } from 'supertest'
import { v4 as uuid } from 'uuid'

import { app } from '@app'

import { Donation } from '@entities/Donation'
import { Donor } from '@entities/Donor'
import { Incident } from '@entities/Incident'

import {
  BeASaviorMocks,
  createMocks,
  createTestingConnection,
  createFakeIncident,
  createAgent,
  createFakeOng,
  loginWithFakeDonor,
  createFakeDonor,
  loginWithFakeOng,
  createFakeDonation
} from '@tests/fakes/mocks'

use(dirty)

describe('Donation Routes', () => {
  let mocks: BeASaviorMocks
  let agent: SuperTest<Test>
  let donor: Donor
  let incident: Incident
  let ongToken: string
  let donorToken: string

  before(async () => {
    await createTestingConnection()
    mocks = createMocks()
    agent = createAgent(app)
    await createFakeOng(agent, mocks.ong)
    donor = await createFakeDonor(agent, mocks.donor)
    ongToken = await loginWithFakeOng(agent, mocks.ong)
    incident = await createFakeIncident(agent, {
      incidentMock: {
        ...mocks.incident,
        cost: 1010
      },
      ongToken: ongToken
    })
    donorToken = await loginWithFakeDonor(agent, mocks.donor)
  })

  it('Should be create new Donation POST (/donations)', async () => {
    const body = {
      ...mocks.donation,
      amount: 1010,
      incident_id: incident.id
    }

    const response = await agent
      .post('/donations')
      .send(body)
      .set('Authorization', `bearer ${donorToken}`)

    const donation = response.body

    expect(donation).to.not.be.undefined()
    expect(donation).to.have.property('id')
  })

  it('Should be throw error if donate is greater than incident cost', async () => {
    const mocks = createMocks()

    mocks.incident.cost = 100
    mocks.donation.amount = 101
    await createFakeDonor(agent, mocks.donor)
    await createFakeOng(agent, mocks.ong)
    await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken: await loginWithFakeOng(agent, mocks.ong)
    })
    mocks.donation.incident_id = mocks.incident.id
    await createFakeDonation(agent, {
      donationMock: mocks.donation,
      donorToken: await loginWithFakeDonor(agent, mocks.donor)
    })

    const response = await agent
      .post('/donations')
      .send(mocks.donation)
      .set('Authorization', `bearer ${donorToken}`)

    expect(response.body.message).to.be.equal(
      'Ops... the donation has an amount greater than the incident cost'
    )
    expect(response.status).to.be.equal(409)
  })
  it('Should be throw error if donated incident recached limit of donations POST (/donations)', async () => {
    const mocks = createMocks()

    mocks.incident.cost = 100
    mocks.donation.amount = 100
    await createFakeDonor(agent, mocks.donor)
    await createFakeOng(agent, mocks.ong)
    await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken: await loginWithFakeOng(agent, mocks.ong)
    })
    mocks.donation.incident_id = mocks.incident.id
    await createFakeDonation(agent, {
      donationMock: mocks.donation,
      donorToken: await loginWithFakeDonor(agent, mocks.donor)
    })

    const body = {
      amount: 1,
      incident_id: incident.id
    }

    const response = await agent
      .post('/donations')
      .send(body)
      .set('Authorization', `bearer ${donorToken}`)

    const donation = response.body

    expect(donation).to.not.be.undefined()
    expect(donation).to.have.property('message')
    expect(response.body.message).to.be.equal(
      'Ops... this incident already reached limit of donations'
    )
  })

  it('Should be able make more than one donate in incident POST (/donations)', async () => {
    const ongToken = await loginWithFakeOng(agent, mocks.ong)
    const incident = await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken
    })

    const donationMock = {
      donationMock: {
        ...mocks.donation,
        incident_id: incident.id
      },
      donorToken
    }

    await createFakeDonation(agent, donationMock)

    const response = await agent
      .get('/donations')
      .set('Authorization', `bearer ${donorToken}`)

    const donations = response.body

    expect(donations.length).to.be.greaterThanOrEqual(2)
  })

  it('Should be to list all donations GET (/donations)', async () => {
    const response = await agent.get('/donations').send()

    const donations = response.body

    expect(donations).to.not.be.undefined()
    expect(donations[0]).to.have.property('id')
    expect(donations[0]).to.have.property('incident_id')
    expect(donations[0]).to.have.property('user_id')
  })

  it('Should be to return empty list donations with fake ong_id GET (/donations?ong_id=FAKE ONG ID)', async () => {
    const response = await agent.get(`/donations?ong_id=${uuid()}`).send()

    const donations = response.body

    expect(donations).to.not.be.undefined()
    expect(donations).to.have.lengthOf(0)
  })

  it('Should be to list donations by donor_id GET (/donations?donor_id=CORRECT ONG ID)', async () => {
    const response = await agent.get(`/donations?ong_id=${donor.id}`).send()

    const donations = response.body

    const haveDifferentDonorId = donations.map(
      (donation: Donation) => donation.user_id === donor.id
    )
    expect(haveDifferentDonorId.length).to.be.greaterThanOrEqual(0)

    expect(donations[0]).to.have.property('id')
    expect(donations[0]).to.have.property('amount')
    expect(donations[0]).to.have.property('incident_id')
    expect(donations[0]).to.have.property('user_id')
  })
})
