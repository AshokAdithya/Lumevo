import Messages from "../models/Messages.js";

export const getMessages = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const messages = await Messages.find({ roomId: roomId }).sort({
      createdAt: 1,
    });

    if (!messages.length) {
      return res.status(404).json({ error: "No messages found for this room" });
    }
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
