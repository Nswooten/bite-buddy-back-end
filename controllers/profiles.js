import { Profile } from "../models/profile.js"
import { v2 as cloudinary } from "cloudinary"

const BASE_URL = "https://api.edamam.com/api/recipes/v2"

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


async function index(req, res) {
  try {
    const profiles = await Profile.find({})
      .populate({
        path: "boards",
        populate: {
          path: "recipes",
          model: "Recipe"
        }
      })
    res.json(profiles)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function show(req, res) {
  try {
    const profile = await Profile.findById(req.params.profileId)
      .populate({
        path: "boards",
        populate: {
          path: "recipes",
          model: "Recipe"
        }
      })
    const boardsWithCovers = await Promise.all(profile.boards.map(async(board, idx)=>{
      if(board.recipes.length){
        const recipeData = await findRecipeByFoodId(board.recipes[0].foodId, idx)
        return {...board._doc, thumbnail: recipeData.recipe.images.THUMBNAIL.url}
      }else{
        return board
      }
    }))
    res.status(200).json({boardsWithCovers, profile})
      } catch (err) {
        console.log(err)
        res.status(500).json(err)
      }
  }

async function addPhoto(req, res) {
    try {
      const imageFile = req.files.photo.path
      const profile = await Profile.findById(req.params.id)

      const image = await cloudinary.uploader.upload(
        imageFile,
        { tags: `${req.user.email}` }
      )
      profile.photo = image.url

      await profile.save()
      res.status(201).json(profile.photo)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  export {
    index,
    show,
    addPhoto
  }
