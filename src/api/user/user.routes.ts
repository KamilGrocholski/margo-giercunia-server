import { Router } from 'express'
import { validateRequest } from '../../middlewares'
import * as UserController from './user.controller'
import * as UserSchema from './user.schema'

const router = Router()

router.get('/', UserController.getAll)
router.get('/:username', validateRequest({ params: UserSchema.getOneByName }), UserController.getOneByName)

export default router