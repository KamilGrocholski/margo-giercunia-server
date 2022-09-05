import authRoutes from './auth/auth.routes'
import userRoutes from './user/user.routes'
import monsterRoutes from './monster/monster.routes'
import itemRoutes from './item/item.routes'

import { Router } from 'express'
const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/monsters', monsterRoutes)
router.use('/items', itemRoutes)

export default router