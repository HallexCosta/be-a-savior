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

  it('Should be able list incidents GET (/incidents)', async () => {
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
    for await (const _ of loadDonations()) {
    }

    const response = await agent
      .get(`/incidents?donorId=${mocks.donor.id}`)
      .set('Authorization', `bearer ${donorToken}`)

    const incidents: Incident[] = response.body

    function checkForIncidentsWereDonatedByDonor(
      donorId: string,
      incident: Incident
    ) {
      return incident.donations.every(
        (donation) => donation.user_id === donorId
      )
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

  it('Should prevent of update incident cost if the new cost is less than total donations PATCH (/incidents/:id)', async () => {
    const mocks = createMocks()

    await createFakeOng(agent, mocks.ong)

    const ongToken = await loginWithFakeOng(agent, mocks.ong)
    mocks.incident.cost = 100
    mocks.incident.user_id = mocks.ong.id
    await createFakeIncident(agent, {
      ongToken,
      incidentMock: mocks.incident
    })

    await createFakeDonor(agent, mocks.donor)
    mocks.donation.amount = 100
    mocks.donation.incident_id = mocks.incident.id
    await createFakeDonation(agent, {
      donorToken: await loginWithFakeDonor(agent, mocks.donor),
      donationMock: mocks.donation
    })

    mocks.incident.cost = 99
    const { status, body: incident } = await agent
      .patch(`/incidents/${mocks.incident.id}`)
      .send(mocks.incident)
      .set('Authorization', `bearer ${ongToken}`)

    expect(status).to.be.equal(409)
    expect(incident.message).to.be.equal(
      'Opss... can\'t possible update incident cost because the incident cost "99" is less than total donations "100"'
    )
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

  it('Should be able list incidents with at least one donation GET (/incidents?donated=incomplete)', async () => {
    const mocks1 = createMocks()
    const mocks2 = createMocks()
    const mocks3 = createMocks()

    async function createFakeIncidenWithDonations(
      agent,
      mocks,
      donationValue: number,
      donationCount: number = 1
    ) {
      await createFakeOng(agent, mocks.ong)
      await createFakeIncident(agent, {
        incidentMock: mocks.incident,
        ongToken: await loginWithFakeOng(agent, mocks.ong)
      })
      await createFakeDonor(agent, mocks.donor)
      for (let count = 1; count <= donationCount; count++) {
        mocks.donation.incident_id = mocks.incident.id
        mocks.donation.amount = donationValue
        await createFakeDonation(agent, {
          donationMock: mocks.donation,
          donorToken: await loginWithFakeDonor(agent, mocks.donor)
        })
      }
    }

    // create fake incident with donations complete
    mocks1.incident.cost = 100
    await createFakeIncidenWithDonations(agent, mocks1, 100, 1)

    // create fake incident with donation incomplete
    mocks2.incident.cost = 100
    await createFakeIncidenWithDonations(agent, mocks2, 10, 3)

    // create fake incident without donations
    mocks3.incident.cost = 100
    await createFakeIncidenWithDonations(agent, mocks3, 0, 0)

    const response = await agent.get('/incidents?donated=incomplete')

    const incidents = response.body

    expect(
      incidents.every((incident) => incident.donations.length >= 1)
    ).to.be.true()
    // if find incident to convert true, if is undefined convert to false
    expect(
      !!incidents.find((incident) => incident.id === mocks1.incident.id)
    ).to.be.true()
    expect(
      !!incidents.find((incident) => incident.id === mocks2.incident.id)
    ).to.be.true()
  })
  it('Should be able list incidents with anything donations GET (/incidents?donated=none)', async () => {
    const mocks = createMocks()

    await createFakeOng(agent, mocks.ong)
    await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken: await loginWithFakeOng(agent, mocks.ong)
    })

    function getAllDonations(incidents: Donation[]) {
      const donations = []

      for (const incident of incidents)
        for (const donation of incident.donations) donations.push(donation)

      return donations
    }

    const response = await agent.get('/incidents?donated=none')

    const incidents = response.body

    expect(incidents).to.be.lengthOf.at.least(
      1,
      'Must be have at least 1 incident'
    )
    expect(getAllDonations(incidents)).to.be.lengthOf(
      0,
      'Expected anything donations'
    )
  })

  it('Should be able list incidents with at least one donations GET (/incidents?donated=complete)', async () => {
    const mocks = createMocks()

    await createFakeOng(agent, mocks.ong)
    // create incident with cost 100
    mocks.incident.cost = 100
    await createFakeIncident(agent, {
      incidentMock: mocks.incident,
      ongToken: await loginWithFakeOng(agent, mocks.ong)
    })

    await createFakeDonor(agent, mocks.donor)
    // create donation with amount 100
    mocks.donation.incident_id = mocks.incident.id
    mocks.donation.amount = 100
    await createFakeDonation(agent, {
      donationMock: mocks.donation,
      donorToken: await loginWithFakeDonor(agent, mocks.donor)
    })

    function getAllDonations(incidents: Donation[]) {
      const donations = []

      for (const incident of incidents)
        for (const donation of incident.donations) donations.push(donation)

      return donations
    }

    const response = await agent.get('/incidents?donated=complete')

    const incidents = response.body

    expect(incidents).to.be.lengthOf.at.least(
      1,
      'Should be expected at least 1 incident'
    )

    const findIncidentById = (incident: Incident) =>
      incident.id === mocks.incident.id

    const incident = incidents.find(findIncidentById)

    function checkDonationsIsComplete(incident: Incident) {
      const totalDonationsAmount = incident.donations.reduce(
        (prev, curr) => prev + curr.amount,
        0
      )
      return incident.cost === totalDonationsAmount
    }
    expect(checkDonationsIsComplete(incident)).to.be.true(
      'Incident cost should be equal a the value of total donations amount'
    )
    expect(getAllDonations(incidents)).to.be.lengthOf.at.least(
      1,
      'Should be expected at least 1 donation'
    )
  })
})
