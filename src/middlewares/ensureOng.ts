import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'

import { OngsRepository } from '@repositories/OngsRepository'

export async function ensureOng(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  const { ong_id } = request

  const repository = getCustomRepository(OngsRepository)

  const ong = await repository.findById(ong_id)

  if (ong) {
    return next()
  }

  return response.status(401).json({
    error: 'Unauthorized: Ong not found'
  })
}
