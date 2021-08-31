import 'reflect-metadata'
import express from 'express'
import 'express-async-errors'

import './database'

import { handleErrors } from '@middlewares/handleErrors'

import { routes } from '@routes'

const app = express()

app.use(express.json())
app.use(routes)
app.use(handleErrors)

export { app }
