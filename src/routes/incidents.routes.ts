import { Router } from 'express'

import { CreateIncidentController } from '@controllers/incidents/CreateIncidentController'
import { ListIncidentsController } from '@controllers/incidents/ListIncidentsController'
import { ListIncidentController } from '@controllers/incidents/ListIncidentController'
import { UpdateIncidentController } from '@controllers/incidents/UpdateIncidentController'
import { DeleteIncidentController } from '@controllers/incidents/DeleteIncidentController'

import { ensureAuthenticateOng } from '@middlewares/ensureAuthenticateOng'
import { ensureOng } from '@middlewares/ensureOng'

const createIncidentController = new CreateIncidentController()
const listIncidentsController = new ListIncidentsController()
const listIncidentController = new ListIncidentController()
const updateIncidentController = new UpdateIncidentController()
const deleteIncidentController = new DeleteIncidentController()

const routes = Router()

routes.post('/', ensureAuthenticateOng, ensureOng, createIncidentController.handle.bind(createIncidentController))
routes.get('/', listIncidentsController.handle.bind(listIncidentsController))
routes.get('/:id', ensureAuthenticateOng, ensureOng, listIncidentController.handle.bind(listIncidentController))
routes.patch(
  '/:id',
  ensureAuthenticateOng,
  ensureOng,
  updateIncidentController.handle.bind(updateIncidentController)
)
routes.delete(
  '/:id',
  ensureAuthenticateOng,
  ensureOng,
  deleteIncidentController.handle.bind(deleteIncidentController)
)

export { routes as incidents }
