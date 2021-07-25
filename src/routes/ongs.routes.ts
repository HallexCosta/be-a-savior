import { Router } from 'express'

import { CreateOngController, ListOngsController } from '@controllers'

const createOngController = new CreateOngController()
const listOngsController = new ListOngsController()

const routes = Router()

routes.post('/', createOngController.handle)
routes.get('/', listOngsController.handle)

export { routes }
