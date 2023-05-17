import { Profile } from "../models/profile.js"
import { Recipe } from "../models/recipe.js"

const BASE_URL= "https://api.edamam.com/api/recipes/v2"


async function getRecipesData(req, res){
  const apiResponse = await fetch(`${BASE_URL}?type=public&q=${req.query.q}&app_id=${process.env.EDAMAM_APP_ID8}&app_key=${process.env.EDAMAM_API_KEY8}`)
  const recipesData = await apiResponse.json()
  res.json(recipesData)
}

async function getRecipe (req, res) {
  const recipeId = req.params.recipeId
  const apiResponse = await fetch(`${BASE_URL}/${recipeId}?type=public&app_id=${process.env.EDAMAM_APP_ID9}&app_key=${process.env.EDAMAM_API_KEY9}`)
  const recipe = await apiResponse.json()
  res.json(recipe)
}



async function createComment(req, res) {
  try {
    req.body.author = req.user.profile
    const recipe = await Recipe.findOne({foodId: req.params.recipeId})
    if(recipe){
      recipe.comments.push(req.body)
      await recipe.save()
      const newComment = recipe.comments[recipe.comments.length -1]
      const profile = await Profile.findById(req.user.profile)
      newComment.author = profile
      res.status(201).json(recipe)
    }else{
      const newRecipe = await Recipe.create(req.body)
      newRecipe.comments.push(req.body)
      await newRecipe.save()
      const newComment = newRecipe.comments[newRecipe.comments.length -1]
      const profile = await Profile.findById(req.user.profile)
      newComment.author = profile
      res.status(201).json(newRecipe)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteComment(req, res){
  try{
    const recipe = await Recipe.findOne({foodId: req.params.recipeId})
    const comment = recipe.comments.id(req.params.commentId)
    if (comment.author.equals(req.user.profile)) {
      recipe.comments.remove(req.params.commentId)
      await recipe.save()
      res.status(200).json(recipe)
    }else{
      res.status(401).json({msg: "Not Authorized"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function editComment(req, res){
  try{
    const recipe = await Recipe.findOne({foodId: req.params.recipeId})
    const comment = recipe.comments.id(req.params.commentId)
    if (comment.author.equals(req.user.profile)) {
      Object.assign(comment, req.body)
      await recipe.save()
      res.status(200).json(recipe)
    }else{
      res.status(401).json({msg: "Not Authorized"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function getMongoDBRecipe(req, res){
  try{
    const recipe = await Recipe.findOne({foodId: req.params.recipeId})
    if (recipe) {
      res.status(200).json(recipe)
    }else{
      res.status(304).end()
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
  deleteComment,
  editComment,
  getMongoDBRecipe
}