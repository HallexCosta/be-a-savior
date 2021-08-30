import { Router } from 'express'

import { CreateIncidentController } from '@controllers/incidents/CreateIncidentController'
import { ListIncidentsController } from '@controllers/incidents/ListIncidentsController'
import { ListIncidentController } from '@controllers/incidents/ListIncidentController'
import { UpdateIncidentController } from '@controllers/incidents/UpdateIncidentController'
import { DeleteIncidentController } from '@controllers/incidents/DeleteIncidentController'

const createIncidentController = new CreateIncidentController()
const listIncidentsController = new ListIncidentsController()
const listIncidentController = new ListIncidentController()
const updateIncidentController = new UpdateIncidentController()
const deleteIncidentController = new DeleteIncidentController()

const routes = Router()

routes.post('/', createIncidentController.handle.bind(createIncidentController))
routes.get('/', listIncidentsController.handle)
routes.get('/:id', listIncidentController.handle)
routes.patch('/:id', updateIncidentController.handle)
routes.delete('/:id', deleteIncidentController.handle)

export { routes as incidentsRoutes }
