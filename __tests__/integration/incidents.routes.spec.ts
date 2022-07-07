import dirty from 'dirty-chai'
import { expect, use } from 'chai'
import { SuperTest, Test } from 'supertest'

import { app } from '@app'

import { Ong } from '@entities/Ong'
import { Donation } from '@entities/Donation'

import {
  BeASaviorMocks,
  createMocks,
  createAgent,
  createFakeDonation,
  createFakeDonor,
  createTestingConnection,
  createFakeOng,
  loginWithFakeDonor,
  loginWithFakeOng,
  createFakeIncident
} from '@tests/fakes/mocks'

use(dirty)

describe('Incidents Routes', () => {
  let mocks: BeASaviorMocks
  let incidentId: string
  let ong: Ong
  let ongToken: string
  let agent: SuperTest<Test>

  before(async () => {
    mocks = createMocks()
    await createTestingConnection()
    agent = createAgent(app)
    ong = await createFakeOng(agent, mocks.ong)
    ongToken = await loginWithFakeOng(agent, mocks.ong)
  })

  it('Should be able to throw an error if ong_id is fake POST (/incidents)', async () => {
    await agent.post('/incidents').send(mocks.incident).expect(401)
  })

  it('Should be able to create new Incident POST (/incidents)', async () => {
    const response = await agent
      .post('/incidents')
      .send(mocks.incident)
      .set('Authorization', `bearer ${ongToken}`)

    const expected = response.body

    incidentId = expected.id

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })

  it('Should be able list incidents GET (/incidents)', async () => {
    await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken
    })

    const response = await agent
      .get('/incidents')

    const incidents = response.body

    expect(response.headers).to.have.property('x-total')
    expect(incidents[0]).to.have.property('id')
    expect(incidents[0]).to.have.property('name')
    expect(incidents[0]).to.have.property('description')
    expect(incidents[0]).to.have.property('cost')
    expect(incidents[0]).to.have.property('created_at')
    expect(incidents[0]).to.have.property('updated_at')
  })

  it('Should be able list incidents by ong id GET (/incidents?ong_id=)', async () => {
    const response = await agent
      .get(`/incidents?ong_id=${ong.id}`)
      .set('Authorization', `bearer ${ongToken}`)

    const incidents = response.body

    expect(incidents[0]).to.have.property('id')
    expect(incidents[0]).to.have.property('name')
    expect(incidents[0]).to.have.property('description')
    expect(incidents[0]).to.have.property('cost')
    expect(incidents[0]).to.have.property('created_at')
    expect(incidents[0]).to.have.property('updated_at')
    expect(incidents[0]).to.have.property('donations')
  })

  it('Should be able list one Incident by Id GET (/incidents/:id)', async () => {
    const response = await agent
      .get(`/incidents/${incidentId}`)
      .set('Authorization', `bearer ${ongToken}`)

    const incident = response.body

    expect(incident).to.have.property('id')
    expect(incident).to.have.property('name')
    expect(incident).to.have.property('description')
    expect(incident).to.have.property('cost')
    expect(incident).to.have.property('created_at')
    expect(incident).to.have.property('updated_at')
  })

  it('Should be able update one Incident by Id PATCH (/incidents/:id)', async () => {
    const body = {
      name: 'Some a name updated',
      cost: 100,
      description: 'This is a description updated'
    }

    await agent
      .patch(`/incidents/${incidentId}`)
      .send(body)
      .set('Authorization', `bearer ${ongToken}`)

    const { body: incident } = await agent.get(`/incidents/${incidentId}`)
      .set('Authorization', `bearer ${ongToken}`)

    expect(incident.name).to.be.equal('Some a name updated')
    expect(incident.cost).to.be.equal(100)
    expect(incident.description).to.be.equal('This is a description updated')
  })

  it('Should be able delete one Incident by Id DELETE (/incidents/:id)', async () => {
    const response = await agent
      .delete(`/incidents/${incidentId}`)
      .set('Authorization', `bearer ${ongToken}`)

    const incident = response.body

    expect(incident).to.have.property('id')
    expect(incident).to.have.property('created_at')
    expect(incident).to.have.property('updated_at')
  })

  it('Should be able list donor together donation in the list incidents GET (/incidents?ong_id=)', async () => {
    await createFakeDonor(agent, mocks.donor)

    const fakeIncident = await createFakeIncident(agent, {
      ongToken: await loginWithFakeOng(agent, mocks.ong),
      incidentMock: mocks.incident
    })

    await createFakeDonation(agent, {
      donorToken: await loginWithFakeDonor(agent, mocks.donor),
      donationMock: {
        ...mocks.donation,
        incident_id: fakeIncident.id
      }
    })

    const response = await agent
      .get(`/incidents?ong_id=${ong.id}`)
      .set('Authorization', `bearer ${ongToken}`)

    const incidents = response.body

    console.log(incidents)
    expect(incidents[0]).to.have.property('id')
    expect(incidents[0]).to.have.property('name')
    expect(incidents[0]).to.have.property('description')
    expect(incidents[0]).to.have.property('cost')
    expect(incidents[0]).to.have.property('created_at')
    expect(incidents[0]).to.have.property('updated_at')
    expect(incidents[0]).to.have.property('donations')
    expect(incidents[0].donations[0]).to.have.property('donor')
  })

  it('Should be able list non-donated incidents GET (/incidents?donated=false)', async () => {
    await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken
    })

    const response = await agent
      .get('/incidents?donated=false')
      .set('Authorization', `bearer ${ongToken}`)

    const incidents = response.body

    const donations: Donation[] = []

    for (const incident of incidents) {
      for (const donation of incident.donations) {
        donations.push(donation)
      }
    }

    const haveDonations = donations.length >= 1
    expect(haveDonations).to.be.false()
  })

  it('Should be able list donated incidents GET (/incidents?donated=true)', async () => {
    const incident = await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken
    })

    await createFakeDonor(agent, mocks.donor)
    const donationMock = {
      ...mocks.donation,
      incidentId: incident.id,
    }
    await createFakeDonation(agent, {
      donationMock,
      donorToken: await loginWithFakeDonor(agent, mocks.donor)
    })

    const response = await agent
      .get('/incidents?donated=true')
      .set('Authorization', `bearer ${ongToken}`)

    const incidents = response.body

    const donations: Donation[] = []

    for (const incident of incidents) {
      for (const donation of incident.donations) {
        donations.push(donation)
      }
    }

    const haveDonations = donations.length >= 1
    expect(haveDonations).to.be.true()
  })
})
