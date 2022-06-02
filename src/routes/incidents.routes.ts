import { Router } from 'express'

import logger from '@common/logger'

import { CreateIncidentController } from '@controllers/incidents/CreateIncidentController'
import { ListIncidentsController } from '@controllers/incidents/ListIncidentsController'
import { ListIncidentController } from '@controllers/incidents/ListIncidentController'
import { UpdateIncidentController } from '@controllers/incidents/UpdateIncidentController'
import DeleteIncidentController from '@controllers/incidents/DeleteIncidentController'
import ConnectionAdapter from '../database/ConnectionAdapter'

const incidentRouter = Router()
const connectionName = process.pid.toString()
const connectionAdapter = new ConnectionAdapter(connectionName)

new CreateIncidentController(
  logger,
  incidentRouter,
  connectionAdapter
)
new ListIncidentsController(
  logger,
  incidentRouter,
  connectionAdapter
)
new ListIncidentController(
  logger,
  incidentRouter,
  connectionAdapter
)
new UpdateIncidentController(
  logger,
  incidentRouter,
  connectionAdapter
)
new DeleteIncidentController(
  logger,
  incidentRouter,
  connectionAdapter
)

export default {
  group: '/incidents',
  routes: incidentRouter
}
