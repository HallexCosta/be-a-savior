import dirty from 'dirty-chai'
import { expect, use } from 'chai'
import { SuperTest, Test } from 'supertest'

import { app } from '@app'

import { Ong } from '@entities/Ong'
import { Incident } from '@entities/Incident'
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
import { Util } from '@tests/util'

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

  it('Should be able to throw an error if ongId is fake POST (/incidents)', async () => {
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

  it.only('Should be able list incidents GET (/incidents)', async () => {
    await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken
    })

    const response = await agent.get('/incidents')

    const incidents = response.body

    expect(response.headers).to.have.property('x-total')
    expect(incidents[0]).to.have.property('id')
    expect(incidents[0]).to.have.property('name')
    expect(incidents[0]).to.have.property('description')
    expect(incidents[0]).to.have.property('cost')
    expect(incidents[0]).to.have.property('created_at')
    expect(incidents[0]).to.have.property('updated_at')
    expect(incidents[0]).to.have.property('donations')
  })

  it('Must be able to list incidents that were donated by donor GET (/incidents?donorId=)', async () => {
    const mocks = createMocks()
    const mocks2 = createMocks()

    await createFakeDonor(agent, mocks.donor)
    await createFakeDonor(agent, mocks2.donor)

    await createFakeOng(agent, mocks.ong)
    await createFakeOng(agent, mocks2.ong)

    const incidentMock = await createFakeIncident(agent, {
      ongToken: await loginWithFakeOng(agent, mocks.ong),
      incidentMock: {
        ...mocks.incident,
        cost: 10000
      }
    })
    const incidentMock2 = await createFakeIncident(agent, {
      ongToken: await loginWithFakeOng(agent, mocks2.ong),
      incidentMock: {
        ...mocks2.incident,
        cost: 10000
      }
    })

    // create 2
    const donorToken = await loginWithFakeDonor(agent, mocks.donor)
    const donorToken2 = await loginWithFakeDonor(agent, mocks2.donor)

    async function* loadDonations() {
      for (const _ of Array(3).keys()) {
        yield await createFakeDonation(agent, {
          donorToken: donorToken,
          donationMock: {
            ...mocks.donation,
            incident_id: incidentMock.id,
            amount: 100
          }
        })
        yield await createFakeDonation(agent, {
          donorToken: donorToken2,
          donationMock: {
            ...mocks.donation,
            incident_id: incidentMock.id,
            amount: 100
          }
        })
        yield await createFakeDonation(agent, {
          donorToken: donorToken,
          donationMock: {
            ...mocks.donation,
            incident_id: incidentMock2.id,
            amount: 100
          }
        })
        yield await createFakeDonation(agent, {
          donorToken: donorToken2,
          donationMock: {
            ...mocks.donation,
            incident_id: incidentMock2.id,
            amount: 100
          }
        })
      }
    }
    for await (const _ of loadDonations()) {}

    const response = await agent
      .get(`/incidents?donorId=${mocks.donor.id}`)
      .set('Authorization', `bearer ${donorToken}`)

    const incidents: Incident[] = response.body

    function checkForIncidentsWereDonatedByDonor(
      donorId: string,
      incident: Incident
    ) {
      return incident.donations
        .every(donation => donation.user_id === donorId)
    }
    // check filter is working
    expect(incidents[0].donations).to.be.lengthOf(3)
    expect(incidents[1].donations).to.be.lengthOf(3)

    // check if all incidents was donated a one donor
    expect(
      incidents.every(
        checkForIncidentsWereDonatedByDonor.bind(null, mocks.donor.id)
      )
    ).to.be.true()
  })

  it('Should be able list incidents by ong id GET (/incidents?ongId=)', async () => {
    const response = await agent
      .get(`/incidents?ongId=${ong.id}`)
      .set('Authorization', `bearer ${ongToken}`)

    const incidents: Incident[] = response.body

    expect(incidents[0]).to.have.property('id')
    expect(incidents[0]).to.have.property('name')
    expect(incidents[0]).to.have.property('description')
    expect(incidents[0]).to.have.property('cost')
    expect(incidents[0]).to.have.property('created_at')
    expect(incidents[0]).to.have.property('updated_at')
    expect(incidents[0]).to.have.property('donations')

    // check if not have incident of other ong
    expect(
      incidents.every((incident) => incident.user_id === ong.id)
    ).to.be.true()
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

    const { body: incident } = await agent
      .get(`/incidents/${incidentId}`)
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

  it('Should be able list donor together donation in the list incidents GET (/incidents?ongId=)', async () => {
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
      .get(`/incidents?ongId=${ong.id}`)
      .set('Authorization', `bearer ${ongToken}`)

    const incidents = response.body

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
      incidentId: incident.id
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

  it('Should prevent of update incident cost if the new cost is lower than donations total PATCH (/incidents/:id)', async () => {
    await createFakeDonor(agent, mocks.donor)

    const ongToken = await loginWithFakeOng(agent, mocks.ong)
    const fakeIncident = await createFakeIncident(agent, {
      ongToken,
      incidentMock: {
        ...mocks.incident,
        cost: 1000
      }
    })

    await createFakeDonation(agent, {
      donorToken: await loginWithFakeDonor(agent, mocks.donor),
      donationMock: {
        ...mocks.donation,
        incident_id: fakeIncident.id,
        amount: 1000
      }
    })

    const incidentUpdated = {
      name: 'Some a name updated',
      cost: 10,
      description: 'This is a description updated'
    }

    const response = await agent
      .patch(`/incidents/${fakeIncident.id}`)
      .send(incidentUpdated)
      .set('Authorization', `bearer ${ongToken}`)

    expect(response.body.message).to.be.equal(
      "Opss... can't possible update incident cost that reached max limit of donations"
    )
    expect(response.status).to.be.equal(409)
  })
})
