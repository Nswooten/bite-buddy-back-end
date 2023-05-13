import mongoose from 'mongoose'

const Schema = mongoose.Schema

const boardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
    enum: ['White', 'Gray', 'Cyan', 'Magenta']
  },
  recipes: {
    type: String
  }
},{
  timestamps: true,
})

const Board = mongoose.model('Board', boardSchema)

export { Board }