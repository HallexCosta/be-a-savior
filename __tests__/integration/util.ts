export class Util {
  static decryptJWTToken(token: string) {
    const [, body] = token.split('.')
    return Buffer.from(body, 'base64').toString('utf-8')
  }
}
