import { Recipe } from "../models/recipe.js";
import { Board } from "../models/board.js";

async function create(){
  try {
    req.body.author= req.user.profile
  } catch (error) {
    
  }
}

export{
  create,
}