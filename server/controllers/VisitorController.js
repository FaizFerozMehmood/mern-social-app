import Visitors from "../models/visitorModel.js"



export const PostVistors = async (req, res) => {
    try {
        const { profileOwner, visitorsId } = req.body;


        console.log("Incoming Visit Data:", { profileOwner, visitorsId });

        if (!profileOwner || !visitorsId) {
            return res.status(400).json({ message: "Missing IDs" });
        }

        if (profileOwner.toString() === visitorsId.toString()) {
            return res.status(400).json({ message: "Cannot visit own profile" });
        }

        const updatedVisit = await Visitors.findOneAndUpdate(
            { profileOwner, visitorsId },
            { visitedAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json(updatedVisit);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getVistors = async (req, res) => {
    try {
        const { profileId } = req.params;
        const visitors = await Visitors.find({ profileOwner: profileId })
            .sort({ visitedAt: -1 })
            .limit(10)
            .populate("visitorsId", "userName profileImage");
        res.status(200).json(visitors)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}