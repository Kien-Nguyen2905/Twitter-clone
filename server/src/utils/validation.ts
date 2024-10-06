import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
// can be reused by many routes
// sequential processing, stops running validations chain if the previous one fails.
// revise type validation to use method run of schema validate 'RunnableValidationChains<ValidationChain>'
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //method run is promise so need use await
    await validation.run(req)
    // after validate check and asign error validate into variable req
    const errors = validationResult(req) // func validationResult get error from req
    // Không có lỗi thì next tiếp tục request
    if (errors.isEmpty()) {
      return next()
    }
    // mapped() is a method provided by express-validator
    const errorsObject = errors.mapped()
    // transforms array of errors into a object
    const entityError = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // Trả về lỗi không phải là lỗi do validate
      // msg get type ErrorWithStatus to use method in ErrorWithStatus
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = msg
    }
    next(entityError)
  }
}
