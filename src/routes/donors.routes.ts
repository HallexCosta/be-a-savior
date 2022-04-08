import { Router } from 'express'

import logger from '@common/logger'

import { CreateDonorController } from '@controllers/donors/CreateDonorController'
import { ListDonorsController } from '@controllers/donors/ListDonorsController'
import { ListDonorController } from '@controllers/donors/ListDonorController'
import { AuthenticateDonorController } from '@controllers/donors/AuthenticateDonorController'

const donorRouter = Router()

new AuthenticateDonorController(
  logger,
  donorRouter
)
new CreateDonorController(
  logger,
  donorRouter
)
new ListDonorsController(
  logger,
  donorRouter
)
new ListDonorController(
  logger,
  donorRouter
)

export default {
  routes: donorRouter,
  group: '/donors'
}
