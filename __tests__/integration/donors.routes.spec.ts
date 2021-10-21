import dirty from 'dirty-chai'
import { SuperTest, Test } from 'supertest'
import { expect, use } from 'chai'
import faker from 'faker'

import { app } from '@app'

import { mock, createTestingConnection, createAgent } from './fakes/mocks'

faker.locale = 'pt_BR'

use(dirty)

describe('Donors Routes', () => {
  let id: string
  let agent: SuperTest<Test>

  before(async () => {
    await createTestingConnection()
    agent = createAgent(app)
  })

  it('Should be create new Donor POST (/donors)', async () => {
    const response = await agent.post('/donors').send(mock.donor)
    const expected = response.body

    id = expected.id

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })

  it('Should be able authenticate ong POST (/donors/login)', async () => {
    const { email, password } = mock.donor
    const response = await agent.post('/donors/login').send({ email, password })
    const expected = response.body

    expect(expected).to.have.property('token')
    expect(expected).to.not.be.undefined()
  })

  it('Should be able list Donors GET (/donors)', async () => {
    const response = await agent.get('/donors')
    const expected = response.body

    expect(expected[0]).to.have.property('id')
    expect(expected[0]).to.have.property('created_at')
    expect(expected[0]).to.have.property('updated_at')
  })

  it('Should be able list one Donor by Id GET (/donors/:id)', async () => {
    const response = await agent.get(`/donors/${id}`)
    const expected = response.body

    expect(expected).to.have.property('id')
    expect(expected.id).to.be.equal(id)
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })
})
