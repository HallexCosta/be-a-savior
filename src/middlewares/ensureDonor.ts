import { Request, Response, NextFunction } from 'express'

import { UsersRepository } from '@repositories/UsersRepository'
import ConnectionAdapter from '@database/ConnectionAdapter'

export async function ensureDonor(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  const { donor_id } = request

  const processId = process.pid.toString()
  const connectionAdapter = new ConnectionAdapter(processId)
  const connection = connectionAdapter.connect()
  const repository = connection.getCustomRepository(UsersRepository)

  const donor = await repository.findOwnerById(donor_id, 'donor')

  if (donor) {
    return next()
  }

  return response.status(401).json({
    error: 'Unauthorized: Donor not found'
  })
}
