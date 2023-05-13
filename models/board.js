import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
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

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }