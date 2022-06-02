import moduleAlias from 'module-alias'

const envrionment = process.env.NODE_ENV || 'production'
if (envrionment === 'production') {
  moduleAlias({ base: process.cwd() })
}

import { app } from '@app'

import { configs } from '@common/configs'

const processId = process.pid
const port = configs.express.LISTEN_APP_PORT || 3333

const server = app.listen(port, () =>
  console.log(`Listening on port ${port} and start in process ${processId}`)
)

// info case: when app is unexpectedly exited
process.on('SIGTERM', () => {
  console.log('server ending', new Date().toISOString())
  server.close(() => process.exit(1))
})
