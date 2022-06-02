import { Router } from 'express'

import logger from '@common/logger'
import { CreateDonationController } from '@controllers/donations/CreateDonationController'
import { ListDonationsController } from '@controllers/donations/ListDonationsController'
import ConnectionAdapter from '@database/ConnectionAdapter'

const processId = process.pid.toString()
const donationRouter = Router()
const connectionAdapter = new ConnectionAdapter(processId)

new CreateDonationController(
  logger,
  donationRouter,
  connectionAdapter
)
new ListDonationsController(
  logger,
  donationRouter,
  connectionAdapter
)

export default {
  group: '/donations',
  routes: donationRouter
}

