import { Router } from 'express'

import { CreateDonorController, ListDonorsController } from '@controllers'

const createDonorController = new CreateDonorController()
const listDonorsController = new ListDonorsController()

const routes = Router()

routes.post('/', createDonorController.handle)
routes.get('/', listDonorsController.handle)

export { routes }
