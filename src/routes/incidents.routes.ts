import { Router } from 'express'

import {
  CreateIncidentController,
  ListIncidentsController,
  ListIncidentController
} from '@controllers'

const createIncidentController = new CreateIncidentController()
const listIncidentsController = new ListIncidentsController()
const listIncidentController = new ListIncidentController()

const routes = Router()

routes.post('/', createIncidentController.handle)
routes.get('/', listIncidentsController.handle)
routes.get('/:id', listIncidentController.handle)

export { routes }
