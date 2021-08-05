import { app } from './app'

import { configs } from '@common'

app.listen(configs.express.LISTEN_APP_PORT, () =>
  console.log(`Listening on port ${configs.express.LISTEN_APP_PORT}`)
)
