import { Router } from 'express'

import {
  CreateIncidentController,
  ListIncidentsController,
  ListIncidentController,
  UpdateIncidentController
} from '@controllers'

const createIncidentController = new CreateIncidentController()
const listIncidentsController = new ListIncidentsController()
const listIncidentController = new ListIncidentController()
const updateIncidentController = new UpdateIncidentController()

const routes = Router()

routes.post('/', createIncidentController.handle)
routes.get('/', listIncidentsController.handle)
routes.get('/:id', listIncidentController.handle)
routes.patch('/:id', updateIncidentController.handle)

export { routes }
