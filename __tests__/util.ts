import { getConnection } from "typeorm"

export class Util {
  static customersEmail = []
  static decryptJWTToken(token: string) {
    const [, body] = token.split('.')
    return Buffer.from(body, 'base64').toString('utf-8')
  }
  static getConnectionAdapter(connectionName: string) {
    return getConnection(connectionName)
  }
}
