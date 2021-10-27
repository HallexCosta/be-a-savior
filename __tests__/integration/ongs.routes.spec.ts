import dirty from 'dirty-chai'
import { SuperTest, Test } from 'supertest'
import { expect, use } from 'chai'
import faker from 'faker'

import { app } from '@app'

import { mock, createTestingConnection, createAgent } from './fakes/mocks'

faker.locale = 'pt_BR'

use(dirty)

describe('Ongs Routes', () => {
  let id: string
  let agent: SuperTest<Test>

  before(async () => {
    try {
      await createTestingConnection()
      agent = createAgent(app)
    } catch (e) {
      console.log(e)
      throw e
    }
  })

  it('Should be able to create new Ong POST (/ongs)', async () => {
    const response = await agent.post('/ongs').send(mock.ong)

    const expected = response.body

    id = expected.id

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })

  it('Should be able authenticate ong POST (/ongs/login)', async () => {
    const { email, password } = mock.ong
    const response = await agent.post('/ongs/login').send({ email, password })
    const expected = response.body

    expect(expected).to.have.property('token')
    expect(expected).to.not.be.undefined()
  })

  it('Should be able list Ongs GET (/ongs)', async () => {
    const response = await agent.get('/ongs')

    const expected = response.body

    expect(expected[0]).to.have.property('id')
    expect(expected[0]).to.have.property('created_at')
    expect(expected[0]).to.have.property('updated_at')
  })

  it('Should be able list one Ong by Id GET (/ongs/:id)', async () => {
    const response = await agent.get(`/ongs/${id}`)

    const expected = response.body

    expect(expected).to.have.property('id')
    expect(expected.id).to.be.equal(id)
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')
  })
})
