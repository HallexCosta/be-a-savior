import { Router } from 'express'

import { CreateDonorController } from '@controllers/donors/CreateDonorController'
import { ListDonorsController } from '@controllers/donors/ListDonorsController'
import { ListDonorController } from '@controllers/donors/ListDonorController'
import { AuthenticateDonorController } from '@controllers/donors/AuthenticateDonorController'

const authenticateDonorController = new AuthenticateDonorController()
const createDonorController = new CreateDonorController()
const listDonorsController = new ListDonorsController()
const listDonorController = new ListDonorController()

const routes = Router()

routes.post('/login', authenticateDonorController.handle)
routes.post('/', createDonorController.handle)
routes.get('/', listDonorsController.handle)
routes.get('/:id', listDonorController.handle)

export { routes as donorsRoutes }
