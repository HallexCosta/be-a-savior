import 'reflect-metadata'
import express from 'express'
import 'express-async-errors'

import './database'

import { handleErrors } from '@middlewares'

import { donorsRoutes, ongsRoutes } from '@routes'

const app = express()

app.use(express.json())
app.use('/donors', donorsRoutes)
app.use('/ongs', ongsRoutes)
app.use(handleErrors)

export { app }
