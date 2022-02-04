import request, { SuperTest, Test } from 'supertest'
import faker from 'faker'
import { v4 as uuid } from 'uuid'
import { randomUUID } from 'crypto'

import { Application } from 'express'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

import { Donation } from '@entities/Donation'
import { Incident } from '@entities/Incident'
import { User } from '@entities/User'
import { Donor } from '@entities/Donor'
import { Ong } from '@entities/Ong'

import { Util } from '@tests/util'

import ormconfig from '@root/ormconfig'

faker.locale = 'pt_BR'

type BaseMock = {
  id: string
  created_at: Date
  updated_at: Date
}

type UserMock = BaseMock & {
  name: string
  email: string
  password: string
  phone: string
  owner: string
}

type OngMock = UserMock

type DonorMock = UserMock

type IncidentMock = BaseMock & {
  name: string
  cost: number
  description: string
}
type DonationMock = BaseMock & {
  id: string
  incident_id: string
  amount: number
}

type CreateFakeIncidentParams = {
  incidentMock: IncidentMock
  ongToken: string
}

type CreateFakeDonationParams = {
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

export const createMocks: () => BeASaviorMocks = () => {
  const user: User = {
    id: randomUUID(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: randomUUID(),
    phone: faker.phone.phoneFormats(),
    owner: 'mock',
    created_at: new Date(),
    updated_at: new Date()
  }
  const ong: Ong = {
    id: randomUUID(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: randomUUID(),
    phone: faker.phone.phoneFormats(),
    owner: 'ong',
    created_at: new Date(),
    updated_at: new Date()
  }
  const donor: Donor = {
    id: randomUUID(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: randomUUID(),
    phone: faker.phone.phoneFormats(),
    owner: 'donor',
    created_at: new Date(),
    updated_at: new Date()
  }
  const incident: Incident = {
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
  const donation: Donation = {
    id: randomUUID(),
    incident_id: randomUUID(),
    user_id: randomUUID(),
    amount: Number(faker.commerce.price()),
    created_at: new Date(),
    updated_at: new Date(),
    incident,
    donor
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

