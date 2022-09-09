import { Router } from 'express'
import * as UserController from './user.controller'

const router = Router()

router.route('/register').post(UserController.register)
router.route('/login').post(UserController.login)
router.route('/refresh').get(UserController.refresh)
router.route('/logout').get(UserController.logout)
router.route('/byMonstersKills').get(UserController.getUsersByMonstersKills)

export default router