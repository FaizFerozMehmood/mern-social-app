import mongoose from "mongoose";

const Vistorschema = new mongoose.Schema({
    visitorsId: {
        type:
            mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    profileOwner: {
        type:
            mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    visitedAt: {
        type: Date,
        default: Date.now
    }
})

const Visitors = mongoose.model("visitors", Vistorschema)

export default Visitors



