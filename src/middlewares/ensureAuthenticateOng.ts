import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

export function ensureAuthenticateOng(
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  const authToken = request.headers.authorization

  if (!authToken) {
    return response.status(401).end()
  }

  const [, token] = authToken.split(' ')

  try {
    const { sub } = verify(token, '47285efa5d652f00fe0371c2e6bdcd0b')

    const ongId = typeof sub === 'string' ? sub : sub()

    request.ong_id = ongId

    return next()
  } catch (e) {
    return response.status(401).end()
  }
}
