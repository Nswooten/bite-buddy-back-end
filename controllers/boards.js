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

export{
  create,
  deleteBoard as delete
}