import { Router } from 'express'

import { CreateDonationController } from '@controllers/donations/CreateDonationController'

const createDonationController = new CreateDonationController()

const routes = Router()

routes.post('/', createDonationController.handle.bind(createDonationController))

export { routes as donationsRoutes }
