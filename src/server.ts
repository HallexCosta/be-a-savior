import moduleAlias from 'module-alias'

const envrionment = process.env.NODE_ENV || 'production'
if (envrionment === 'production') {
  moduleAlias({ base: process.cwd() })
}

import { app } from '@app'

import { configs } from '@common/configs'

const port = configs.express.LISTEN_APP_PORT || 5000

app.listen(port, () =>
  console.log(`Listening on port ${port}`)
)
