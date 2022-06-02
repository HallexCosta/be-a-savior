import { Connection, getConnectionManager } from 'typeorm'

export interface ConnectionPlugin {
  connect(): Connection
}

export default class ConnectionAdapter {
  public constructor(
    private readonly name: string
  ) {}

  public connect(): Connection {
    const connectionManager = getConnectionManager()
    if (!connectionManager.has(this.name)) throw Error(`Connection "${this.name}" not found`)
    
    const connection = connectionManager.get(this.name)
    return connection
  }
}
