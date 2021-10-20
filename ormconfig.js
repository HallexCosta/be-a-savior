class DB {
  constructor(environment) {
    environment = environment.toUpperCase()

    this.config = {
      type: process.env[`DB_TYPE_${environment}`],
      host: process.env[`DB_HOST_${environment}`],
      port: process.env[`DB_PORT_${environment}`],
      username: process.env[`DB_USERNAME_${environment}`],
      password: process.env[`DB_PASSWORD_${environment}`],
      database: process.env[`DB_NAME_${environment}`],
    }
  }
}

class Development {
  postgres(db) {
    return {
     ...db.config,
     migrations: ['src/database/migrations/*.ts'],
     entities: ['src/entities/*.ts'],
     cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/entities'
      }
    }
  }

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

  config(orm) {
    if (orm.environment !== 'development') return
    orm.configs = this.postgres(orm.db)
  }
}

class Production {
  postgres(db) {
    return {
      ...db.config,
      migrations: ['dist/database/migrations/*.js'],
      entities: ['dist/entities/*.js'],
      cli: {
        migrationsDir: 'dist/database/migrations',
        entitiesDir: 'dist/entities'
      }
    }
  }

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

  config(orm) {
    if (orm.environment !== 'production') return
    orm.configs = this.postgres(orm.db)
  }
}

class Test {
  postgres(db) {
    return {
      ...db.config,
      migrations: ['src/database/migrations/*.ts'],
      entities: ['src/entities/*.ts'],
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/entities'
      }
    }
  }

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

  config(orm) {
    if (orm.environment !== 'test') return
    orm.configs = this.postgres(orm.db)
  }
}

class Orm {
  constructor(db, environment) {
    this.db = db
    this.configs = {}
    this.environments = []
    this.environment = environment
  }

  subscribe(environment) {
    this.environments.push(environment)
  }

  notify() {
    for (const environment of this.environments) {
      environment.config(this)
    }
  }

  config() {
    return this.configs
  }
}

const environment = process.env.NODE_ENV

const db = new DB(environment)
const orm = new Orm(db, environment)

orm.subscribe(new Test)
orm.subscribe(new Development)
orm.subscribe(new Production)

orm.notify()

module.exports = orm.config()
