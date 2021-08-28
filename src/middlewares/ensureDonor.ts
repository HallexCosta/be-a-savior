import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'

import { DonorsRepository } from '@repositories/DonorsRepository'

export async function ensureDonor(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  const { donor_id } = request

  const repository = getCustomRepository(DonorsRepository)

  const donor = await repository.findById(donor_id)

  if (donor) {
    return next()
  }

  return response.status(401).json({
    error: 'Unauthorized: Donor not found'
  })
}
