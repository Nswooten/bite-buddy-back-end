import { Recipe } from '../models/recipe.js'
import { Board } from '../models/board.js'
import { Profile } from '../models/profile.js'

const BASE_URL = 'https://api.edamam.com/api/recipes/v2'

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

async function findRecipeByFoodId(recipeId, idx) {
  const apiResponse = await fetch(`${BASE_URL}/${recipeId}?type=public&app_id=${keyLookUp[idx].EDAMAM_APP_ID}&app_key=${keyLookUp[idx].EDAMAM_API_KEY}`)
  return await apiResponse.json()
}

async function create(req, res) {
  try {
    req.body.author = req.user.profile
    const board = await Board.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { boards: board } },
      { new: true }
    )
    board.author = profile
    res.status(200).json(board)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function index(req, res) {
  try {
    const boards = await Board.find(req.query.title ? req.query : {})
      .populate('author')
      .populate('recipes')
      .limit(10)
    const boardsWithCover = await Promise.all(boards.map(async (board, idx) => {
      if (board.recipes.length) {
        const recipeData = await findRecipeByFoodId(board.recipes[0].foodId, idx)
        return { ...board._doc, thumbnail: recipeData.recipe.images.THUMBNAIL.url }
      } else {
        return board
      }
    }))
    res.status(200).json(boardsWithCover)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const board = await Board.findById(req.params.boardId).populate('author').populate('recipes')
    const recipesWithPhotos = board.recipes.length
      ? await Promise.all(board.recipes.map(async (recipe, idx) => {
        const recipeData = await findRecipeByFoodId(board.recipes[idx].foodId, idx)
        return { ...recipeData.recipe, thumbnail: recipeData.recipe.images.THUMBNAIL.url }
      }))
      : []
    res.status(200).json({ ...board._doc, recipes: recipesWithPhotos })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteBoard(req, res) {
  try {
    const board = await Board.findById(req.params.boardId)
    if (board.author.equals(req.user.profile)) {
      const deleteBoard = await Board.findOneAndDelete({ _id: req.params.boardId })
      const profile = await Profile.findById(req.user.profile)
      profile.boards.remove({ _id: board._id })
      res.status(200).json(deleteBoard)
    } else {
      res.status(401).json({ msg: 'Not Authorized' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function update(req, res) {
  try {
    const board = await Board.findById(req.params.boardId)
    if (board.author.equals(req.user.profile)) {
      const updatedBoard = await Board.findByIdAndUpdate(req.params.boardId,
        req.body,
        { new: true })
      res.status(200).json(updatedBoard)
    } else {
      res.status(401).json({ msg: 'Not Authorized' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function addRecipeToBoard(req, res) {
  try {
    const board = await Board.findById(req.params.boardId)
    const recipe = await Recipe.findOne({ foodId: req.body.foodId })
    if (recipe && board.recipes.includes(recipe._id)) {
      res.status(304).end()
    } else if (recipe) {
      board.recipes.unshift(recipe._id)
      await board.save()
      const savedBoard = await Board.findById(req.params.boardId).populate('recipes')
      res.status(201).json(savedBoard)
    } else {
      const newRecipe = await Recipe.create(req.body)
      board.recipes.unshift(newRecipe._id)
      await board.save()
      const savedBoard = await Board.findById(req.params.boardId).populate('recipes')
      res.status(201).json(savedBoard)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function removeRecipeFromBoard(req, res) {
  try {
    const board = await Board.findById(req.params.boardId)
    const recipe = await Recipe.findOne({ foodId: req.params.recipeId })
    board.recipes.remove({ _id: recipe._id })
    await board.save()
    const savedBoard = await Board.findById(req.params.boardId).populate('recipes')
    res.status(201).json(savedBoard)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}


export {
  create,
  index,
  show,
  deleteBoard as delete,
  update,
  addRecipeToBoard,
  removeRecipeFromBoard
}