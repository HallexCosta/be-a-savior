function checkEnvironmentFromDatabase(path) {
  const paths = path.split('/')
  const file = paths.pop()
  const filename = file.split('-')
  const envrionment = filename.pop()

  return envrionment === process.env.NODE_ENV
}

const configs = [
  {
    type: 'sqlite',
    database: 'src/database/database.sqlite',
    migrations: ['src/database/migrations/*.ts'],
    entities: ['src/entities/*.ts'],
    cli: {
      migrationsDir: 'src/database/migrations',
      entitiesDir: 'src/entities'
    }
  },
  {
    type: 'sqlite',
    database: 'src/database/database.sqlite-test',
    migrations: ['src/database/migrations/*.ts'],
    entities: ['src/entities/*.ts'],
    cli: {
      migrationsDir: 'src/database/migrations',
      entitiesDir: 'src/entities'
    }
  }
]

const config = configs.find(({ database: path }) =>
  checkEnvironmentFromDatabase(path)
)

module.exports = config
