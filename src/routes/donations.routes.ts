import { Router } from 'express'

import logger from '@common/logger'
import { CreateDonationController } from '@controllers/donations/CreateDonationController'
import { ListDonationsController } from '@controllers/donations/ListDonationsController'

const donationRouter = Router()

new CreateDonationController(
  logger,
  donationRouter
)
new ListDonationsController(
  logger,
  donationRouter
)

export default {
  group: '/donations',
  routes: donationRouter
}

