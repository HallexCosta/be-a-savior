import { app } from './app'

app.listen(process.env.LISTEN_APP_PORT, () =>
  console.log(`Listening on port ${process.env.LISTEN_APP_PORT}`)
)
