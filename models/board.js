import mongoose from 'mongoose'

const Schema = mongoose.Schema

const boardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: { type: Schema.Types.ObjectId, ref: 'Profile' },
  bgColor: {
    type: String,
    required: true,
    enum: ['blue', 'gray', 'green', 'pink', 'purple']
  },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
}, {
  timestamps: true,
})

const Board = mongoose.model('Board', boardSchema)

export { Board }