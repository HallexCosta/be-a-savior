import dirty from 'dirty-chai'
import { SuperTest, Test } from 'supertest'
import { expect, use } from 'chai'
import { Donor } from '@entities/Donor'
import faker from 'faker'

import { app } from '@app'

import { BeASaviorMocks, createMocks, createTestingConnection, createAgent } from './fakes/mocks'
import { Util } from './util'

faker.locale = 'pt_BR'

use(dirty)

describe('Donors Routes', () => {
  let id: string
  let agent: SuperTest<Test>
  let mocks: BeASaviorMocks


  before(async () => {
    await createTestingConnection()
    agent = createAgent(app)
    mocks = createMocks()
  })

  it('Should be create new Donor POST (/donors)', async () => {
    console.log(mocks.ong)
    console.log(mocks.donor)
    const response = await agent.post('/donors').send(mocks.donor)
    const expected = response.body

    id = expected.id

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })

  it('Should be able authenticate donor POST (/donors/login)', async () => {
    const { email, password } = mocks.donor
    const response = await agent.post('/donors/login').send({ email, password })
    const { token } = response.body
    console.log(token)

    const tokenDecrypted = Util.decryptJWTToken(token)
    const tokenParsed = JSON.parse(tokenDecrypted)

    expect(tokenParsed.email).to.be.equal(email)
    expect(tokenParsed).to.have.property('exp')
  })

  it('Should be able list Donors GET (/donors)', async () => {
    const response = await agent.get('/donors')
    const donors = response.body

    expect(donors).to.be.not.undefined()

    const haveOng = donors.find((donor: Donor) => donor.owner === 'ong')
    expect(haveOng).to.be.undefined()
  })

  it('Should be able list one Donor by Id GET (/donors/:id)', async () => {
    const response = await agent.get(`/donors/${id}`)
    const ong = response.body

    expect(ong).to.have.property('id')
    expect(ong.id).to.be.equal(id)
    expect(ong).to.have.property('created_at')
    expect(ong).to.have.property('updated_at')
  })
})
