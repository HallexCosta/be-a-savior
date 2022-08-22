import { expect } from 'chai'
import sinon from 'sinon'

import { createMocks } from '@tests/fakes/mocks'

import { Incident } from '@entities/Incident'

import { ListIncidentsService, ListIncidentsDependencies } from '@services/incidents/ListIncidentsService'
import { Donation } from '@entities/Donation'

describe('@ListIncidentsService', () => {
  let sandbox: sinon.SinonSandbox
  const defaultFunction = () => { }
  const listIncidentsDependenciesMock = {
    repositories: {
      incidents: {
        findIncidentsByFilter: defaultFunction
      },
      providers: {}
    } 
  } as unknown as ListIncidentsDependencies

  describe('#constructor', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())
  })

  describe('#execute', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('Should be list all incidents with filters passed', async () => {
      const listIncidentInstance = new ListIncidentsService(
        listIncidentsDependenciesMock
      )

      const params = {
        ongId: '',
        donorId: '',
        donated: true
      }
      const donationsMock = (Array.from(Array(4).keys())).map(() => {
        const donation = {
          ...createMocks().donation,
          amount: 1000
        } as Donation
        return donation
      })
      const incidentsMocks = (Array.from(Array(4).keys())).map(() => {
        const incident = {
          ...createMocks().incident,
          donations: donationsMock
        } as Incident
        return  incident 
      })

      const findIncidentsByFilterStubbed = sandbox.stub(
        listIncidentsDependenciesMock.repositories.incidents,
        'findIncidentsByFilter'
      ).resolves(incidentsMocks)

      const totalIncidentMock = 4
      const totalIncidentsAndDonationsReturnsMock = {
        totalIncidents: totalIncidentMock,
        totalDonations: totalIncidentMock * 4,
        totalIncidentsDonated: 4,
        totalIncidentsNonDonated: 0
      }
      const totalIncidentsAndDonationsStubbed = sandbox.stub(
        listIncidentInstance,
        'totalIncidentsAndDonations'
      ).returns(totalIncidentsAndDonationsReturnsMock)

      const listIncidentsData = await listIncidentInstance.execute(params)

      expect(findIncidentsByFilterStubbed.calledWith(params)).to.be.true("doesn't called with params correct")
      expect(totalIncidentsAndDonationsStubbed.calledOnce).to.be.true("doesn't possible to calculate total of incidents and donations")
      expect(listIncidentsData.incidents).to.be.lengthOf(4, "The return don't receive length expected")
      expect(listIncidentsData.totalIncidentsAndDonations)
        .to.deep.include(totalIncidentsAndDonationsStubbed, 'Failed to match return of the object from totalIncidentsAndDonations')
    })
  })

  describe('#totalIncidentsAndDonations', () => {
    it('should be return total of incidents, incidents donated and incidents non-donated', () => {
      const incidentsDonated = Array.from({ length: 7 }, _ => ({
        ...createMocks().incident,
        donations: Array.from({ length: 5 }, _ => createMocks().donation)
      }))

      const incidentsNonDonated = Array.from({ length: 13 }, _ => createMocks().incident)

      const incidents = [...incidentsDonated, ...incidentsNonDonated]

      const listIncidentsService = new ListIncidentsService({} as unknown as ListIncidentsDependencies)

      const actual = listIncidentsService.totalIncidentsAndDonations(incidents as unknown as Incident[])

      const expected = {
        totalIncidents: 20,
        totalDonations: 35,
        totalIncidentsDonated: 7,
        totalIncidentsNonDonated: 13
      }

      expect(actual).to.deep.equal(expected)
    })
  })
})
