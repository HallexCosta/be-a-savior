class Development {
  config() {
    return {
      type: 'sqlite',
      database: 'src/database/database.sqlite',
      migrations: ['src/database/migrations/*.ts'],
      entities: ['src/entities/*.ts'],
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/entities'
      }
    }
  }
}

class Production {
  config() {
    return {
      type: 'sqlite',
      database: 'dist/database/database.sqlite',
      migrations: ['dist/database/migrations/*.js'],
      entities: ['dist/entities/*.js'],
      cli: {
        migrationsDir: 'dist/database/migrations',
        entitiesDir: 'dist/entities'
      }
    }
  }
}

class Test {
  config() {
    return {
      type: 'sqlite',
      database: 'src/database/database.sqlite-test',
      migrations: ['src/database/migrations/*.ts'],
      entities: ['src/entities/*.ts'],
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/entities'
      }
    }
  }
}

class Orm {
  check(environment) {
    const test = new Test()
    const production = new Production()
    const development = new Development()

    if (environment === 'test') {
      return test
    }

    console.log(environment)
    if (environment === 'production') {
      return production
    }

    if (environment === 'development') {
      return development
    }
  }

  add(envrionment) {
    this.envrionment = envrionment
  }

  config() {
    return this.envrionment.config()
  }
}

const orm = new Orm()

const environment = orm.check(process.env.NODE_ENV)

orm.add(environment)

module.exports = orm.config()
