class Development {
  sqlite() {
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
  config() {
    return this.sqlite()
  }
}

class Production {
  sqlite() {
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
  config() {
    return this.sqlite()
  }
}

class Test {
  sqlite() {
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
  config() {
    return this.sqlite()
  }
}

class Orm {
  check(environment) {
    const test = new Test()
    const production = new Production()
    const development = new Development()

    const strategies = {
      test,
      production,
      development
    }

    return strategies[environment]
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
