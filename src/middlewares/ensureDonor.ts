import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'

import { UsersRepository } from '@repositories/UsersRepository'

export async function ensureDonor(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  const { donor_id } = request

  const repository = getCustomRepository(UsersRepository)

  const donor = await repository.findOwnerById(donor_id, 'donor')

  if (donor) {
    return next()
  }

  return response.status(401).json({
    error: 'Unauthorized: Donor not found'
  })
}
