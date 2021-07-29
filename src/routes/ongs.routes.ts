import { Router } from 'express'

import {
  CreateOngController,
  ListOngsController,
  ListOngController,
  AuthenticateOngController
} from '@controllers'

import { ensureAuthenticateOng } from '@middlewares'

const authenticateOngController = new AuthenticateOngController()
const createOngController = new CreateOngController()
const listOngsController = new ListOngsController()
const listOngController = new ListOngController()

const routes = Router()

routes.get('/login', authenticateOngController.handle)
routes.post('/', ensureAuthenticateOng, createOngController.handle)
routes.get('/', ensureAuthenticateOng, listOngsController.handle)
routes.get('/:id', ensureAuthenticateOng, listOngController.handle)

export { routes }
