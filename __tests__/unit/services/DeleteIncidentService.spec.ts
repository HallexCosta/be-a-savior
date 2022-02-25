import sinon from 'sinon'
import { expect } from 'chai'

import { stubInterface, stubObject, StubbedInstance } from 'ts-sinon'
import { mock, when } from 'ts-mockito'

import {
  createMocks,
  BeASaviorMocks
} from '@tests/fakes/mocks'

import {
  DeleteIncidentService,
  DeleteIncidentDependencies,
} from '@services/incidents/DeleteIncidentService'

import { IncidentsRepository } from '@repositories/IncidentsRepository'

describe('@DeleteIncidentService', () => {
  let mocks: BeASaviorMocks
  let sandbox: sinon.SinonSandbox
  let dependenciesMock: StubbedInstance<DeleteIncidentDependencies>

  beforeEach(() => {
    mocks = createMocks()
    sandbox = sinon.createSandbox()
    dependenciesMock = stubObject<DeleteIncidentDependencies>({
      repositories: {
        incidents: mock<IncidentsRepository>()
      }
    })
  })

  afterEach(() => sandbox.restore())

  describe('#checkIncidentsHaveDonations', () => {
    it('should be return true if have one or more donations vinculated in a incidents', () => {
      when(dependenciesMock.repositories.incidents.findById('')).thenResolve(mocks.incident)

      mocks
        .incident
        .donations.push(mocks.donation)

      sandbox.stub(
        dependenciesMock.repositories.incidents,
        'findById'
      ).resolves(mocks.incident)

      const deleteIncidentService = new DeleteIncidentService(
        stubInterface<DeleteIncidentDependencies>()
      )
      const actual = deleteIncidentService
        .checkIncidentsHaveDonations(mocks.incident)

      expect(actual).to.be.true()
    })

    it("should be return false if haven't nothing donations to the incident", () => {
      when(dependenciesMock.repositories.incidents.findById('')).thenResolve(mocks.incident)

      sandbox.stub(
        dependenciesMock.repositories.incidents,
        'findById'
      ).resolves(mocks.incident)

      const deleteIncidentService = new DeleteIncidentService(dependenciesMock)
      const actual = deleteIncidentService.checkIncidentsHaveDonations(mocks.incident)

      expect(actual).to.be.false()
    })
  })
})
