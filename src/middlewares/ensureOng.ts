import { Request, Response, NextFunction } from 'express'

import { UsersRepository } from '@repositories/UsersRepository'
import ConnectionAdapter from '@database/ConnectionAdapter'

export async function ensureOng(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  const { ong_id } = request

  const processId = process.pid.toString()
  const connectionAdapter = new ConnectionAdapter(processId)
  const connection = connectionAdapter.connect()
  const repository = connection.getCustomRepository(UsersRepository)

  const ong = await repository.findOwnerById(ong_id, 'ong')

  if (ong) {
    return next()
  }

  return response.status(401).json({
    error: 'Unauthorized: Ong not found'
  })
}
