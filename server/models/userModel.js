
import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users", default: [] },
    ],
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const User = mongoose.model('users', userSchema)
export default User