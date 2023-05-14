import { Profile } from "../models/profile.js"
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

async function createComment(req, res) {
  try {
    req.body.author = req.user.profile
    const recipes = await Recipe.find({foodId: `${req.params.recipeId}`}).exec()
    const recipe = recipes[0]
    console.log(recipes)
    console.log(recipe)
    
    
    if(Object.keys(recipes).length > 0){
      recipe.comments.push(req.body)
      await recipe.save()
      const newComment = recipe.comments[recipe.comments.length -1]
      const profile = await Profile.findById(req.user.profile)
      newComment.author = profile
      res.status(201).json(newComment)
    }else{
      const newRecipe = await Recipe.create(req.body)
      const createdRecipe = await Recipe.findById(newRecipe._id)
      createdRecipe.comments.push(req.body)
      await createdRecipe.save()
      const newComment = createdRecipe.comments[createdRecipe.comments.length -1]
      const profile = await Profile.findById(req.user.profile)
      newComment.author = profile
      res.status(201).json(newComment)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}



export {
  getRecipesData,
  getRecipe,
  createComment,
}


