const database = {
  production: 'src/database/database.sqlite',
  test: 'src/database/database-test.sqlite'
}

const databasePath = database[process.env.DATABASE] ?? database.production

module.exports = {
  type: 'sqlite',
  database: databasePath,
  migrations: ['src/database/migrations/*.ts'],
  entities: ['src/entities/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/entities'
  }
}
