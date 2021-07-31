import 'reflect-metadata'
import express from 'express'
import 'express-async-errors'

import './database'

import { handleErrors, ensureAuthenticateOng, ensureOng } from '@middlewares'

import { donorsRoutes, ongsRoutes, incidentsRoutes } from '@routes'

const app = express()

app.use(express.json())
app.use('/donors', donorsRoutes)
app.use('/ongs', ongsRoutes)
app.use('/incidents', ensureAuthenticateOng, ensureOng, incidentsRoutes)
app.use(handleErrors)

export { app }
