import { Router } from 'express'

import { CreateDonationController } from '@controllers/donations/CreateDonationController'
import { ListDonationsController } from '@controllers/donations/ListDonationsController'

import { ensureDonor } from '@middlewares/ensureDonor'
import { ensureAuthenticateDonor } from '@middlewares/ensureAuthenticateDonor'

const createDonationController = new CreateDonationController()
const listDonationsController = new ListDonationsController()

const routes = Router()

routes.get('/', listDonationsController.handle.bind(listDonationsController))
routes.post(
  '/',
  ensureAuthenticateDonor,
  ensureDonor,
  createDonationController.handle.bind(createDonationController)
)

export { routes as donations }
