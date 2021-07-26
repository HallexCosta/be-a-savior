import { Router } from 'express'

import { CreateIncidentController, ListIncidentsController } from '@controllers'

const createIncidentController = new CreateIncidentController()
const listIncidentsController = new ListIncidentsController()

const routes = Router()

routes.post('/', createIncidentController.handle)
routes.get('/', listIncidentsController.handle)

export { routes }
