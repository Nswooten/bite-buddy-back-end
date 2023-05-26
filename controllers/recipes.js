import { Profile } from '../models/profile.js'
import { Recipe } from '../models/recipe.js'

const BASE_URL = 'https://api.edamam.com/api/recipes/v2'

let keyNum = 0

const keyLookUp = {
  0: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID0, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY0 },
  1: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID1, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY1 },
  2: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID2, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY2 },
  3: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID3, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY3 },
  4: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID4, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY4 },
  5: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID5, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY5 },
  6: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID6, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY6 },
  7: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID7, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY7 },
  8: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID8, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY8 },
  9: { EDAMAM_APP_ID: process.env.EDAMAM_APP_ID9, EDAMAM_API_KEY: process.env.EDAMAM_API_KEY9 },
}

async function getRecipesData(req, res) {
  const apiResponse = await fetch(`${BASE_URL}?type=public&q=${req.query.q}&app_id=${keyLookUp[keyNum].EDAMAM_APP_ID}&app_key=${keyLookUp[keyNum].EDAMAM_API_KEY}`)
  keyNum += 1
  if (keyNum > 9) {
    keyNum = 0
  }
  const recipesData = await apiResponse.json()
  res.json(recipesData)
}

async function getRecipe(req, res) {
  console.log('test')
  const recipeId = req.params.recipeId
  const apiResponse = await fetch(`${BASE_URL}/${recipeId}?type=public&app_id=$${keyLookUp[keyNum].EDAMAM_APP_ID}&app_key=${keyLookUp[keyNum].EDAMAM_API_KEY}`)
  keyNum += 1
  if (keyNum > 9) {
    keyNum = 0
  }
  const recipe = await apiResponse.json()
  res.json(recipe)
}

async function createComment(req, res) {
  try {
    req.body.author = req.user.profile
    const recipe = await Recipe.findOne({ foodId: req.params.recipeId })
    if (recipe) {
      recipe.comments.push(req.body)
      await recipe.save()
      const newComment = recipe.comments[recipe.comments.length - 1]
      const profile = await Profile.findById(req.user.profile)
      newComment.author = profile
      res.status(201).json(newComment)
    } else {
      const newRecipe = await Recipe.create(req.body)
      newRecipe.comments.push(req.body)
      await newRecipe.save()
      const newComment = newRecipe.comments[newRecipe.comments.length - 1]
      const profile = await Profile.findById(req.user.profile)
      newComment.author = profile
      res.status(201).json(newComment)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteComment(req, res) {
  try {
    const recipe = await Recipe.findOne({ foodId: req.params.recipeId })
    const comment = recipe.comments.id(req.params.commentId)
    if (comment.author.equals(req.user.profile)) {
      recipe.comments.remove(req.params.commentId)
      await recipe.save()
      res.status(200).json(comment)
    } else {
      res.status(401).json({ msg: 'Not Authorized' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function editComment(req, res) {
  try {
    const recipe = await Recipe.findOne({ foodId: req.params.recipeId })
    const comment = recipe.comments.id(req.params.commentId)
    if (comment.author.equals(req.user.profile)) {
      Object.assign(comment, req.body)
      await recipe.save()
      res.status(200).json(recipe)
    } else {
      res.status(401).json({ msg: 'Not Authorized' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function getMongoDBRecipe(req, res) {
  try {
    const recipe = await Recipe.findOne({ foodId: req.params.recipeId })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'Profile'
        }
      })
    res.status(200).json(recipe)
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