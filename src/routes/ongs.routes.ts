import { Router } from 'express'

import { CreateOngController } from '@controllers'

const createOngController = new CreateOngController()

const routes = Router()

routes.post('/', createOngController.handle)

export { routes }
