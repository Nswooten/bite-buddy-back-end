import { Router } from 'express'
import * as boardsCtrl from '../controllers/boards.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.post('/', checkAuth, boardsCtrl.create)

router.delete('/:boardId', checkAuth, boardsCtrl.delete)

export { router }