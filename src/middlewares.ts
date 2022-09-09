import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from "zod"
import jwt from 'jsonwebtoken'

import ErrorResponse from './interfaces/ErrorResponse'
import allowedOrigins from './config/allowedOrigins';

export const validateAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('xd1')
    const accessToken = req.headers.authorization?.split(' ')[1]
    console.log(accessToken)
    console.log('xd2')
    if (!accessToken) {
      return res.sendStatus(401)
    }
    console.log('xd3')
    if (accessToken.toLowerCase().startsWith('bearer')) {
      accessToken.slice('bearer'.length).trim()
    }
    console.log('xd4')
    
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as { username: string }
      console.log('xd5')
    req.body = {
      username: decodedAccessToken.username
    }
    console.log(decodedAccessToken)
    next()
  } catch (err) {
    return res.sendStatus(500)
  }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  })
}

interface IRequestValidators {
  params?: AnyZodObject
  body?: AnyZodObject
  query?: AnyZodObject
}
export const validateRequest = (validators: IRequestValidators) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params) 
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body) 
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query) 
      }
      next()
    } catch (err) {
        if (err instanceof ZodError) {
          res.status(422)
        }  
        next(err)
    }
  }
}
