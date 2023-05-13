async function getRecipeData(req, res){
  const apiResponse = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${req.query.q}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
  const recipeData = await apiResponse.json()
  res.json(recipeData)
}

export {
  getRecipeData,

}


