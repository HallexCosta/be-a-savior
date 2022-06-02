import { Router } from 'express'

import logger from '@common/logger'

import { CreateOngController } from '@controllers/ongs/CreateOngController'
import { ListOngsController } from '@controllers/ongs/ListOngsController'
import { ListOngController } from '@controllers/ongs/ListOngController'
import { AuthenticateOngController } from '@controllers/ongs/AuthenticateOngController'
import ConnectionAdapter from '@database/ConnectionAdapter'

const processId = process.pid.toString()
const ongRouter = Router()
const connectionAdapter = new ConnectionAdapter(processId)

new AuthenticateOngController(
  logger,
  ongRouter,
  connectionAdapter
)
new CreateOngController(
  logger, 
  ongRouter,
  connectionAdapter
)
new ListOngsController(
  logger,
  ongRouter,
  connectionAdapter
)
new ListOngController(
  logger,
  ongRouter,
  connectionAdapter
)

export default {
  group: '/ongs',
  routes: ongRouter
}
