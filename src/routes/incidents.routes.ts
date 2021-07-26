import { Router } from 'express'

import { CreateIncidentController } from '@controllers'

const createIncidentController = new CreateIncidentController()

const routes = Router()

routes.post('/', createIncidentController.handle)

export { routes }
