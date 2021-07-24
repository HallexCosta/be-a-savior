import { Router } from 'express'

import {
  CreateDonorController,
  ListDonorsController,
  ListDonorController
} from '@controllers'

const createDonorController = new CreateDonorController()
const listDonorsController = new ListDonorsController()
const listDonorController = new ListDonorController()

const routes = Router()

routes.post('/', createDonorController.handle)
routes.get('/', listDonorsController.handle)
routes.get('/:id', listDonorController.handle)

export { routes }
