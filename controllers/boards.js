import { Recipe } from "../models/recipe.js";
import { Board } from "../models/board.js";
import { Profile } from "../models/profile.js";

async function create(req, res){
  try {
    req.body.author= req.user.profile
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

async function deleteBoard(req, res){
  try{
    const board = await Board.findById(req.params.boardId)
    if (board.author.equals(req.user.profile)) {
      const deleteBoard = await Board.findOneAndDelete({ _id: req.params.boardId })
      const profile = await Profile.findById(req.user.profile)
      profile.boards.remove({_id: board._id})
      res.status(200).json(deleteBoard)
    }else{
      res.status(401).json({msg: "Not Authorized"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function update(req, res){
  try{
    const board = await Board.findById(req.params.boardId)
    if (board.author.equals(req.user.profile)) {
      const updatedBoard = await Board.findByIdAndUpdate(req.params.boardId,
        req.body, 
        { new: true })
      res.status(200).json(updatedBoard)
    }else{
      res.status(401).json({msg: "Not Authorized"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function addRecipeToBoard(req, res){
  try {
    const board = await Board.findById(req.params.boardId)
    const recipe = await Recipe.findOne({foodId: req.body.foodId})
    if(recipe){
      board.recipes.unshift(recipe._id)
      await board.save()
      res.status(201).json(board)
    }else{
      const newRecipe = await Recipe.create(req.body)
      board.recipes.unshift(newRecipe._id)
      res.status(201).json(board)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export{
  create,
  deleteBoard as delete,
  update,
  addRecipeToBoard
}