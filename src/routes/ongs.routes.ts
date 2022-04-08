import { Router } from 'express'

import logger from '@common/logger'

import { CreateOngController } from '@controllers/ongs/CreateOngController'
import { ListOngsController } from '@controllers/ongs/ListOngsController'
import { ListOngController } from '@controllers/ongs/ListOngController'
import { AuthenticateOngController } from '@controllers/ongs/AuthenticateOngController'

const ongRouter = Router()

new AuthenticateOngController(
  logger,
  ongRouter
)
new CreateOngController(
  logger, 
  ongRouter
)
new ListOngsController(
  logger,
  ongRouter
)
new ListOngController(
  logger,
  ongRouter
)

export default {
  group: '/ongs',
  routes: ongRouter
}
