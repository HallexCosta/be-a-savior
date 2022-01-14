import { Router } from 'express'

import { donors } from '@routes/donors.routes'
import { ongs } from '@routes/ongs.routes'
import { incidents } from '@routes/incidents.routes'
import { donations } from '@routes/donations.routes'

const routes = Router()

routes.get('/', (_, response) => response.end("I'm alive!"))
routes.use('/donors', donors)
routes.use('/ongs', ongs)
routes.use('/incidents', incidents)
routes.use('/donations', donations)

export { routes }
