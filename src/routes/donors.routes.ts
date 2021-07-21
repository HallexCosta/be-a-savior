import { Router } from 'express'

import { CreateDonorController } from '@controllers'

const createDonorController = new CreateDonorController()

const routes = Router()

routes.post('/', createDonorController.handle)

export { routes }
