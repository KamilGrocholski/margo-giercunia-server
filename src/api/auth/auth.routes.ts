import { Router } from 'express'
import * as AuthControllers from './auth.controller'
import * as AuthSchema from './auth.schema'
import { validateRequest } from '../../middlewares'

const router = Router()

router.route('/register').post(validateRequest({ body: AuthSchema.registration }), AuthControllers.createUser)
router.route('/login').post(validateRequest({ body: AuthSchema.login }), AuthControllers.loginUser)

export default router