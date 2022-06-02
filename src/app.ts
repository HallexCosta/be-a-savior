import 'reflect-metadata'
import express from 'express'
import 'express-async-errors'
import logger from '@common/logger'

import { handleErrors } from '@middlewares/handleErrors'

import { routes } from '@routes'

const app = express()
const appName = process.env.APPNAME

logger.info(`Starting Application: ${appName}`)

app.use(express.json())
app.use(routes)
app.use(handleErrors)

export { app }
