import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'

import { UsersRepository } from '@repositories/UsersRepository'

export async function ensureOng(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  const { ong_id } = request

  const repository = getCustomRepository(UsersRepository)

  const ong = await repository.findOwnerById(ong_id, 'ong')

  if (ong) {
    return next()
  }

  return response.status(401).json({
    error: 'Unauthorized: Ong not found'
  })
}
