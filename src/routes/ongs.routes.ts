import { Router } from 'express'

import {
  CreateOngController,
  ListOngsController,
  ListOngController,
  AuthenticateOngController
} from '@controllers'

const authenticateOngController = new AuthenticateOngController()
const createOngController = new CreateOngController()
const listOngsController = new ListOngsController()
const listOngController = new ListOngController()

const routes = Router()

routes.post('/login', authenticateOngController.handle)
routes.post('/', createOngController.handle)
routes.get('/', listOngsController.handle)
routes.get('/:id', listOngController.handle)

export { routes }
