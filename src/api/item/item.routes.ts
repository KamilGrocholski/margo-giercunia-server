import { Router } from 'express'
import { validateAccessToken, validateRequest } from '../../middlewares'
import * as ItemController from './item.controller'
import * as ItemSchema from './item.schema'

const router = Router()

router.route('/').get(ItemController.getAll)
router.route('/').post(validateRequest({ body: ItemSchema.create }), ItemController.createItem)
router.route('/item').post(validateAccessToken, ItemController.editItem)

export default router