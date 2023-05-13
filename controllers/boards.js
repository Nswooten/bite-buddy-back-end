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
    res.status(500).json(board)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export{
  create,
}