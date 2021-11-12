import moduleAlias from 'module-alias'

if (process.env.NODE_ENV === 'production') {
  moduleAlias({ base: process.cwd() })
}

import { app } from '@app'

import { configs } from '@common/configs'

app.listen(configs.express.LISTEN_APP_PORT, () =>
  console.log(`Listening on port ${configs.express.LISTEN_APP_PORT}`)
)
