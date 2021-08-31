import { Router } from 'express'

import { CreateOngController } from '@controllers/ongs/CreateOngController'
import { ListOngsController } from '@controllers/ongs/ListOngsController'
import { ListOngController } from '@controllers/ongs/ListOngController'
import { AuthenticateOngController } from '@controllers/ongs/AuthenticateOngController'

const authenticateOngController = new AuthenticateOngController()
const createOngController = new CreateOngController()
const listOngsController = new ListOngsController()
const listOngController = new ListOngController()

const routes = Router()

routes.post(
  '/login',
  authenticateOngController.handle.bind(authenticateOngController)
)
routes.post('/', createOngController.handle.bind(createOngController))
routes.get('/', listOngsController.handle.bind(listOngsController))
routes.get('/:id', listOngController.handle.bind(listOngController))

export { routes as ongsRoutes }
