import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  pronouns: String,
  photo: String,
  boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }]
}, {
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
