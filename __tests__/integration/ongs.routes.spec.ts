import dirty from 'dirty-chai'
import { SuperTest, Test } from 'supertest'
import { expect, use } from 'chai'
import faker from 'faker'

import { app } from '@app'

import { BeASaviorMocks, createMocks, createTestingConnection, createAgent } from '@tests/fakes/mocks'
import { Util } from '@tests/util'

faker.locale = 'pt_BR'

use(dirty)

describe('Ongs Routes', () => {
  let id: string
  let mocks: BeASaviorMocks
  let agent: SuperTest<Test>

  before(async () => {
    mocks = createMocks()
    await createTestingConnection()
    agent = createAgent(app)
  })

  it('Should be able to create new Ong POST (/ongs)', async () => {
    const response = await agent.post('/ongs').send(mocks.ong)

    const expected = response.body

    id = expected.id

    expect(expected).to.not.be.undefined()
    expect(expected).to.have.property('id')
    expect(expected).to.have.property('created_at')
    expect(expected).to.have.property('updated_at')

    Util.customersEmail.push(mocks.ong.email)
  })

  it('Should be able authenticate ong POST (/ongs/login)', async () => {
    const { email, password } = mocks.ong
    const response = await agent.post('/ongs/login').send({ email, password })
    const { token } = response.body

    const tokenDecrypted = Util.decryptJWTToken(token)
    const tokenParsed = JSON.parse(tokenDecrypted)

    expect(tokenParsed.email).to.be.equal(email)
    expect(tokenParsed).to.have.property('sub')
    expect(tokenParsed).to.have.property('iat')
  })

  it('Should be able list Ongs GET (/ongs)', async () => {
    const response = await agent.get('/ongs')

    const ongs = response.body

    expect(ongs[0]).to.have.property('id')
    expect(ongs[0]).to.have.property('created_at')
    expect(ongs[0]).to.have.property('updated_at')
  })

  it('Should be able list one Ong by Id GET (/ongs/:id)', async () => {
    const response = await agent.get(`/ongs/${id}`)

    const ong = response.body

    expect(ong).to.have.property('id')
    expect(ong.id).to.be.equal(id)
    expect(ong).to.have.property('created_at')
    expect(ong).to.have.property('updated_at')
  })
})
