import { Router } from 'express'
import * as recipesCtrl from '../controllers/recipes.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'


const router = Router()

// ========== Public Routes ===========
router.get('/', recipesCtrl.getRecipesData)
router.get('/:recipeId', recipesCtrl.getRecipe)
router.get('/:recipeId/comments', recipesCtrl.getMongoDBRecipe)

// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.post('/:recipeId/comments', checkAuth, recipesCtrl.createComment)
router.delete('/:recipeId/comments/:commentId', checkAuth, recipesCtrl.deleteComment)
router.put('/:recipeId/comments/:commentId', checkAuth, recipesCtrl.editComment)

export { router }