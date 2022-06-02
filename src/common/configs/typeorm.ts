abstract class Envrionment {
  abstract configure(envrionmentManager: EnvrionmentManager): void
}

type DBConfig = {
  name: string
  type: string
  host: string
  port: number
  username: string
  password: string
  database: string
}

class DB {
  public readonly config: DBConfig

  constructor() {
    this.config = {
      name: process.pid.toString(),
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }
  }
}

class Development extends Envrionment {
  postgres(db: DB) {
    return {
     ...db.config,
     migrations: ['src/database/migrations/*.ts'],
     entities: ['src/entities/*.ts'],
     cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/entities'
      },
      logging: 'all',
      synchronize: true
    }
  }
  configure(orm: EnvrionmentManager) {
    if (orm.environment !== 'development') return
    orm.configs = this.postgres(orm.db)
  }
}

class Production extends Envrionment {
  postgres(db: DB) {
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
  configure(orm: EnvrionmentManager) {
    if (orm.environment !== 'production') return
    orm.configs = this.postgres(orm.db)
  }
}
class Test {
  postgres(db: DB) {
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
  configure(orm: EnvrionmentManager) {
    if (orm.environment !== 'test') return
    orm.configs = this.postgres(orm.db)
  }
}

class EnvrionmentManager {
  public db: DB
  public configs: {}
  public environments: Envrionment[]
  public environment: string

  constructor(db: DB, environment: string) {
    this.db = db
    this.configs = {}
    this.environments = []
    this.environment = environment
  }

  subscribe(environment: Envrionment) {
    this.environments.push(environment)
  }

  notify() {
    for (const environment of this.environments) {
      environment.configure(this)
    }
  }

  config() {
    return this.configs
  }
}

const manager = new EnvrionmentManager(
  new DB(),
  process.env.NODE_ENV || 'production'
)

manager.subscribe(new Test)
manager.subscribe(new Development)
manager.subscribe(new Production)

manager.notify()

export default manager.config()
