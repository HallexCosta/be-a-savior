import { expect } from 'chai'
import sinon from 'sinon'
import { randomUUID } from 'crypto'

import { createMocks } from '@tests/fakes/mocks'

import { Incident } from '@entities/Incident'

import { ListIncidentsService, ListIncidentsDependencies } from '@services/incidents/ListIncidentsService'

describe('@ListIncidentsService', () => {
  let sandbox: sinon.SinonSandbox
  const defaultFunction = () => { }
  const listIncidentsDependenciesMock = {
    repositories: {
      users: {
        findIncidentsByFilter: defaultFunction
      },
      providers: {}
    }
  }

  describe('#constructor', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

  })

  describe('#totalIncidentsAndDonations', () => {
    it('should be return total of incidents, incidents donated and incidents non-donated', async () => {
      const incidentsDonated = Array.from({ length: 7 }, _ => ({
        ...createMocks().incident,
        donations: Array.from({ length: 5 }, _ => createMocks().donation)
      }))

      const incidentsNonDonated = Array.from({ length: 13 }, _ => createMocks().incident)

      const incidents = [...incidentsDonated, ...incidentsNonDonated]

      const listIncidentsService = new ListIncidentsService({} as unknown as ListIncidentsDependencies)

      const actual = listIncidentsService.totalIncidentsAndDonations(incidents as unknown as Incident[])

      const expected = '{"totalIncidents":20,"totalDonations":35,"totalIncidentsDonated":7,"totalIncidentsNonDonated":13}'

      expect(actual).to.deep.equal(expected)
    })
  })
})
