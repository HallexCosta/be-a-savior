import { Router } from 'express'

import {
  CreateOngController,
  ListOngsController,
  ListOngController
} from '@controllers'

const createOngController = new CreateOngController()
const listOngsController = new ListOngsController()
const listOngController = new ListOngController()

const routes = Router()

routes.post('/', createOngController.handle)
routes.get('/', listOngsController.handle)
routes.get('/:id', listOngController.handle)

export { routes }
