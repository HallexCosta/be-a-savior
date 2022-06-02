import { Router } from 'express'

import logger from '@common/logger'
import ConnectionAdapter from '@database/ConnectionAdapter'

import { CreateDonorController } from '@controllers/donors/CreateDonorController'
import { ListDonorsController } from '@controllers/donors/ListDonorsController'
import { ListDonorController } from '@controllers/donors/ListDonorController'
import { AuthenticateDonorController } from '@controllers/donors/AuthenticateDonorController'

const processId = process.pid.toString()
const donorRouter = Router()
const connectionAdapter = new ConnectionAdapter(processId)

new AuthenticateDonorController(
  logger,
  donorRouter,
  connectionAdapter
)
new CreateDonorController(
  logger,
  donorRouter,
  connectionAdapter
)
new ListDonorsController(
  logger,
  donorRouter,
  connectionAdapter
)
new ListDonorController(
  logger,
  donorRouter,
  connectionAdapter
)

export default {
  routes: donorRouter,
  group: '/donors'
}
