import { Router } from 'express'

import {
  CreateDonorController,
  ListDonorsController,
  ListDonorController,
  AuthenticateDonorController
} from '@controllers'

import { ensureAuthenticateDonor, ensureDonor } from '@middlewares'

const authenticateDonorController = new AuthenticateDonorController()
const createDonorController = new CreateDonorController()
const listDonorsController = new ListDonorsController()
const listDonorController = new ListDonorController()

const routes = Router()

routes.get('/login', authenticateDonorController.handle)
routes.post(
  '/',
  ensureAuthenticateDonor,
  ensureDonor,
  createDonorController.handle
)
routes.get(
  '/',
  ensureAuthenticateDonor,
  ensureDonor,
  listDonorsController.handle
)
routes.get(
  '/:id',
  ensureAuthenticateDonor,
  ensureDonor,
  listDonorController.handle
)

export { routes }
