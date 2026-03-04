import Msg from "../models/msgModel.js";

export const sendMsg = async (req, res) => {
  console.log("Id", req.user.id);
  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({
        message: "all fileds are required!",
      });
    }

    const newMsg = await Msg.create({
      sender: req.user.id,
      receiver,
      content,
    });
    res.status(201).json(newMsg);
  } catch (error) {
    console.log("error==>", error.message);
    res.status(500).json({ message: error.messag });
  }
};

export const getMsg = async (req, res) => {
  const { userId } = req.params;
  console.log("req.user._id =>", req.user.id);
  console.log("userId (param) =>", userId);

  try {
    const messages = await Msg.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender receiver", "userName profileImage");

    res.json(messages);
    console.log("message", messages);
  } catch (error) {
    console.log("error getting res==>", error.message);
    return res.status(500).json({ message: error.messages });
  }
};