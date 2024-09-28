import { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapRequestHandler = <P>(func: RequestHandler<P, any, any, any>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next) // execute logic controller
    } catch (error) {
      next(error) // redirect error to middleware defaultErrorHandler
    }
  }
}
