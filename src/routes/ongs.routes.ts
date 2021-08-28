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

routes.post('/login', authenticateOngController.handle)
routes.post('/', createOngController.handle)
routes.get('/', listOngsController.handle)
routes.get('/:id', listOngController.handle)

export { routes as ongsRoutes }
