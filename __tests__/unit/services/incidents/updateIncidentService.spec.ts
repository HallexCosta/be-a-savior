import dirtyChai from 'dirty-chai'
import { expect, use } from 'chai'

import { UpdateIncidentService } from '@services/incidents/UpdateIncidentService'
import { ServiceDependencies } from '@services/BaseService'

import { IncidentsRepository } from '@repositories/IncidentsRepository'

import { Incident } from '@entities/Incident'

use(dirtyChai)

describe('@UpdateIncidentService', () => {
  describe('#preventUpdateIncidentCost', () => {
    it('should prevent ONG of edit the incident cost if the cost of incident is lower than the donations total', () => {
      const incidentsRepository = {
        findById: () => {}
      } as unknown as IncidentsRepository

      const updateIncidentServiceDependenciesMock = {
        repositories: {
          incidents: incidentsRepository
        }
      } as ServiceDependencies

      const updateIncidentService = new UpdateIncidentService(
        updateIncidentServiceDependenciesMock
      )

      const toThrow = () => {
        const incident = {
          cost: 1000,
          donations: [
            {
              amount: 5000
            },
            {
              amount: 5000
            }
          ]
        } as Incident

        const incidentCostUpdated = 5000
        updateIncidentService.preventUpdateIncidentCost(
          incidentCostUpdated,
          incident.donations
        )
      }

      expect(toThrow).to.be.throw(
        'Opss... can\'t possible update incident cost because the incident cost "5000" is less than total donations "10000"'
      )
    })
  })
})
