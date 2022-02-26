import request, { SuperTest, Test } from 'supertest'
import { stubObject } from 'ts-sinon'
import faker from 'faker'
import { v4 as uuid } from 'uuid'
import { randomUUID } from 'crypto'

import { Application } from 'express'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

import { BaseEntity } from '@entities/BaseEntity'
import { User } from '@entities/User'
import { Donor } from '@entities/Donor'
import { Ong } from '@entities/Ong'
import { Incident } from '@entities/Incident'
import { Donation } from '@entities/Donation'

import { Util } from '@tests/util'

import ormconfig from '@root/ormconfig'

faker.locale = 'pt_BR'

export type Mock<T> = {
  [P in keyof T]: T[P] extends Function ? T[P] : Mock<T[P]>
}

export type BaseMock = Mock<BaseEntity>

export type UserMock = BaseMock & Mock<User>

export type OngMock = UserMock & Mock<Ong>

export type DonorMock = UserMock & Mock<Donor>

export type IncidentMock = Mock<Incident>

export type DonationMock = Mock<Donation>

export type CreateFakeIncidentParams = {
  incidentMock: IncidentMock
  ongToken: string
}

export type CreateFakeDonationParams = {
  donationMock: DonationMock
  donorToken: string
}

export type BeASaviorMocks = {
  user: UserMock
  ong: OngMock
  donor: DonorMock
  incident: IncidentMock
  donation: DonationMock
}

type PureMock = {
  user?: boolean
  ong?: boolean
  donor?: boolean
  incident?: boolean
  donation?: boolean
}
type CreateMocksParams = {
  pureMock: PureMock
}

const defaultPureMockParams = {
  pureMock: {
    user: false,
    ong: false,
    donor: false,
    incident: false,
    donation: false
  }
}

export function createMocks({
  pureMock
}: CreateMocksParams = defaultPureMockParams): BeASaviorMocks {
  let user = {
    id: randomUUID(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: randomUUID(),
    phone: faker.phone.phoneFormats(),
    owner: 'mock',
    created_at: new Date(),
    updated_at: new Date()
  }
  let ong = {
    id: randomUUID(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: randomUUID(),
    phone: faker.phone.phoneFormats(),
    owner: 'ong',
    created_at: new Date(),
    updated_at: new Date()
  }
  let donor = {
    id: randomUUID(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: randomUUID(),
    phone: faker.phone.phoneFormats(),
    owner: 'donor',
    created_at: new Date(),
    updated_at: new Date()
  }
  let incident = {
    id: randomUUID(),
    name: faker.fake('{{animal.dog}}'),
    cost: Number(faker.commerce.price()),
    description: `This animal is type ${faker.fake('{{animal.type}}')}`,
    user_id: randomUUID(),
    created_at: new Date(),
    updated_at: new Date(),
    ong,
    donations: []
  }
  let donation = {
    id: randomUUID(),
    incident_id: randomUUID(),
    user_id: randomUUID(),
    amount: Number(faker.commerce.price()),
    created_at: new Date(),
    updated_at: new Date(),
    incident,
    donor
  }

  if (!pureMock.user) {
    user = stubObject<UserMock>(user)
  }
  if (!pureMock.ong) {
    ong = stubObject<OngMock>(ong)
  }
  if (!pureMock.donor) {
    donor = stubObject<DonorMock>(donor)
  }
  if (!pureMock.incident) {
    incident = stubObject<IncidentMock>(incident)
  }
  if (!pureMock.donation) {
    donation = stubObject<DonationMock>(donation)
  }

  return {
    user,
    ong,
    donor,
    incident,
    donation
  }
}

export function createAgent(app: Application): SuperTest<Test> {
  return request(app)
}

export async function createTestingConnection(name: string = uuid()): Promise<Connection> {
  return await createConnection({
    ...ormconfig,
    name,
  } as ConnectionOptions)
}

export async function createFakeOng(agent: SuperTest<Test>, ongMock: OngMock): Promise<Ong> {
  const response = await agent.post('/ongs').send(ongMock)

  Util.customersEmail.push(ongMock.email)

  return response.body
}

export async function createFakeDonor(agent: SuperTest<Test>, donorMock: DonorMock): Promise<Donor> {
  const response = await agent.post('/donors')
    .send(donorMock)

  return response.body
}

export async function createFakeIncident(
  agent: SuperTest<Test>,
  { incidentMock, ongToken }: CreateFakeIncidentParams
): Promise<Incident> {
  const response = await agent
    .post('/incidents')
    .send(incidentMock)
    .set('Authorization', `bearer ${ongToken}`)

  return response.body
}

export async function createFakeDonation(
  agent: SuperTest<Test>,
  { donationMock, donorToken }: CreateFakeDonationParams
): Promise<Incident> {
  const response = await agent
    .post('/donations')
    .send({
      ...donationMock,
    })
    .set('Authorization', `bearer ${donorToken}`)

  return response.body
}

export async function loginWithFakeOng(
  agent: SuperTest<Test>,
  ongMock: OngMock
): Promise<string> {
  const { email, password } = ongMock

  const response = await agent.post('/ongs/login').send({
    email,
    password
  })

  return response.body.token
}

export async function loginWithFakeDonor(
  agent: SuperTest<Test>,
  donorMock: DonorMock
): Promise<string> {
  const { email, password } = donorMock

  const response = await agent.post('/donors/login').send({
    email,
    password
  })

  return response.body.token
}

