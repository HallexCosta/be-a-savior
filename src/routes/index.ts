import { Router } from 'express'

import { ensureAuthenticateOng } from '@middlewares/ensureAuthenticateOng'
import { ensureOng } from '@middlewares/ensureOng'
import { ensureAuthenticateDonor } from '@middlewares/ensureAuthenticateDonor'
import { ensureDonor } from '@middlewares/ensureDonor'

import { donors } from './donors.routes'
import { ongs } from '@routes/ongs.routes'
import { incidents } from '@routes/incidents.routes'
import { donations } from '@routes/donations.routes'

const routes = Router()

routes.use('/donors', donors)
routes.use('/ongs', ongs)
routes.use('/incidents', ensureAuthenticateOng, ensureOng, incidents)
routes.use('/donations', donations)

export { routes }
