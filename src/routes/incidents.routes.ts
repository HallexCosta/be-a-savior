import { Router } from 'express'

import logger from '@common/logger'

import { CreateIncidentController } from '@controllers/incidents/CreateIncidentController'
import { ListIncidentsController } from '@controllers/incidents/ListIncidentsController'
import { ListIncidentController } from '@controllers/incidents/ListIncidentController'
import { UpdateIncidentController } from '@controllers/incidents/UpdateIncidentController'
import DeleteIncidentController from '@controllers/incidents/DeleteIncidentController'

const incidentRouter = Router()

new CreateIncidentController(
  logger,
  incidentRouter
)
new ListIncidentsController(
  logger,
  incidentRouter
)
new ListIncidentController(
  logger,
  incidentRouter
)
new UpdateIncidentController(
  logger,
  incidentRouter
)
new DeleteIncidentController(
  logger,
  incidentRouter
)

export default {
  group: '/incidents',
  routes: incidentRouter
}
