import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'Profile' },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5]
    }
  },
  { timestamps: true }
)

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    foodId: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
)

const Recipe = mongoose.model('Recipe', recipeSchema)

export { Recipe }