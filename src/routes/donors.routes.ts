import { Router } from 'express'

import {
  CreateDonorController,
  ListDonorsController,
  ListDonorController,
  AuthenticateDonorController
} from '@controllers'

const authenticateDonorController = new AuthenticateDonorController()
const createDonorController = new CreateDonorController()
const listDonorsController = new ListDonorsController()
const listDonorController = new ListDonorController()

const routes = Router()

routes.post('/login', authenticateDonorController.handle)
routes.post('/', createDonorController.handle)
routes.get('/', listDonorsController.handle)
routes.get('/:id', listDonorController.handle)

export { routes }
