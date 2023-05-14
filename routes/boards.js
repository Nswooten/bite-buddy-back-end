import { Router } from 'express'
import * as boardsCtrl from '../controllers/boards.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.post('/', checkAuth, boardsCtrl.create)

router.delete('/:boardId', checkAuth, boardsCtrl.delete)
router.put('/:boardId', checkAuth, boardsCtrl.update)
router.post('/:boardId/recipes', checkAuth, boardsCtrl.addRecipeToBoard)

export { router }