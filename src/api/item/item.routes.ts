import { Router } from 'express'
import { validateRequest } from '../../middlewares'
import * as ItemController from './item.controller'
import * as ItemSchema from './item.schema'

const router = Router()

router.route('/').get(ItemController.getAll)
router.route('/').post(validateRequest({ body: ItemSchema.create }), ItemController.createItem)

export default router