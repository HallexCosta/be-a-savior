import express from 'express'
import { routes } from './routes'

import { handleErrors } from '@middlewares'

import 'express-async-errors'

const app = express()

app.use(express.json())
app.use(routes)
app.use(handleErrors)

export { app }
