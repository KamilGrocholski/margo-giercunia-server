import { Router }  from 'express'
import { validateRequest } from '../../middlewares'
import * as MonsterController from './monster.controller'
import * as MonsterSchema from './monster.schema'

const router = Router()

router.route('/').get(MonsterController.getAll)
router.route('/').post(validateRequest({ body: MonsterSchema.create }), MonsterController.createMonster)

export default router