import { Router }  from 'express'
import { validateAccessToken, validateRequest } from '../../middlewares'
import * as MonsterController from './monster.controller'
import * as MonsterSchema from './monster.schema'

const router = Router()

router.route('/').get(MonsterController.getAll)
router.route('/').post(validateAccessToken, validateRequest({ body: MonsterSchema.create }), MonsterController.createMonster)
router.route('/monster').get(validateAccessToken, MonsterController.getMonsterByName)
router.route('/monster').post(validateAccessToken, MonsterController.editMonster)

export default router