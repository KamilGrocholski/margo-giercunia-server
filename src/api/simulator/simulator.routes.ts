import { Router } from 'express'
import { validateRequest, validateAccessToken } from '../../middlewares'
import * as SimulatorController from './simulator.controller'
// import * as SimulatorSchema from './simulator.schema'

const router = Router()

router.route('/randomItems').get(validateAccessToken, SimulatorController.getRandomItems)

export default router