import { Router } from 'express'
import * as recipesCtrl from '../controllers/recipes.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'


const router = Router()

// ========== Public Routes ===========
router.get('/', recipesCtrl.getRecipesData)
router.get('/:recipeId', recipesCtrl.getRecipe)


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.post('/:recipeId/comments', checkAuth, recipesCtrl.createComment)


export { router }