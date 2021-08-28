import { app } from '@app'

import { express as expressConfigs } from '@common/configs/express'

app.listen(expressConfigs.LISTEN_APP_PORT, () =>
  console.log(`Listening on port ${expressConfigs.LISTEN_APP_PORT}`)
)
