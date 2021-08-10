import { Router } from 'express'

import { CreateDonationController } from '@controllers'

const createDonationController = new CreateDonationController()

const routes = Router()

routes.post('/', createDonationController.handle)

export { routes }
