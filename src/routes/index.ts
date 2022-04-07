import { Router } from 'express'

import logger from '@common/logger'
import donors from '@routes/donors.routes'
import ongs from '@routes/ongs.routes'
import incidents from '@routes/incidents.routes'
import donations from '@routes/donations.routes'

const routes = Router()

routes.get('/', (_, response) => {
  logger.info('> Accessing Endpoint GET "/"')
  return response.end("I'm alive!")
})
routes.use(donors.group, donors.routes)
routes.use(ongs.group, ongs.routes)
routes.use(incidents.group, incidents.routes)
routes.use(donations.group, donations.routes)

export { routes }
