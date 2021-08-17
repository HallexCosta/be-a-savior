import 'reflect-metadata'
import express from 'express'
import 'express-async-errors'

import './database'

import { handleErrors } from '@middlewares/handleErrors'
import { ensureAuthenticateOng } from '@middlewares/ensureAuthenticateOng'
import { ensureOng } from '@middlewares/ensureOng'
import { ensureAuthenticateDonor } from '@middlewares/ensureAuthenticateDonor'
import { ensureDonor } from '@middlewares/ensureDonor'

import { donorsRoutes } from '@routes/donors.routes'
import { ongsRoutes } from '@routes/ongs.routes'
import { incidentsRoutes } from '@routes/incidents.routes'
import { donationsRoutes } from '@routes/donations.routes'

const app = express()

app.use(express.json())
app.use('/donors', donorsRoutes)
app.use('/ongs', ongsRoutes)
app.use('/incidents', ensureAuthenticateOng, ensureOng, incidentsRoutes)
app.use('/donations', ensureAuthenticateDonor, ensureDonor, donationsRoutes)
app.use(handleErrors)

export { app }
