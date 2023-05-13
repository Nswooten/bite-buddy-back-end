import { Recipe } from "../models/recipe.js"

const BASE_URL= "https://api.edamam.com/api/recipes/v2"

async function getRecipesData(req, res){
  const apiResponse = await fetch(`${BASE_URL}?type=public&q=${req.query.q}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
  const recipesData = await apiResponse.json()
  // console.log(recipesData)
  res.json(recipesData)
}

async function getRecipe (req, res) {
  const recipeId = req.body.recipeId
  const apiResponse = await fetch(`${BASE_URL}/${recipeId}?type=public&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
  const recipe = await apiResponse.json()
  res.json(recipe)
}

// async function create(req, res) {
//   try {
//     const recipe = await Recipe.create(req.body)
//   } catch (error) {
//   }

// }

// async function createComment(req, res) {

// }

export {
  getRecipesData,
  getRecipe,
}


