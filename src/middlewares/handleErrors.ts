import { Request, Response, NextFunction } from 'express'

export function handleErrors(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response {
  if (error instanceof Error) {
    console.error(error)
    return response.status(409).json({
      message: error.message
    })
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
}
