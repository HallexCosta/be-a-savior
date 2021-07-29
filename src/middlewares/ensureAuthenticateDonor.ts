import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

export function ensureAuthenticateDonor(
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

    const donorId = typeof sub === 'string' ? sub : sub()

    request.donor_id = donorId

    return next()
  } catch (e) {
    return response.status(401).end()
  }
}
