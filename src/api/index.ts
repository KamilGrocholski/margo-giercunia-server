import userRoutes from './user/user.routes'
import monsterRoutes from './monster/monster.routes'
import simulatorRoutes from './simulator/simulator.routes'
import itemRoutes from './item/item.routes'

import { Router } from 'express'
const router = Router()

router.use('/users', userRoutes)
router.use('/monsters', monsterRoutes)
router.use('/items', itemRoutes)
router.use('/simulator', simulatorRoutes)

export default router