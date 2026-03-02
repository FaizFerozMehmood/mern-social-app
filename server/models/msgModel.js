import mongoose from "mongoose";

const msgSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Msg = mongoose.model("Message", msgSchema);

export default Msg;