import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    // console.log("User ID from token:", user1); // Log the user ID from the token
    // console.log("User ID from body:", user2); // Log the user ID from the token
    //console.log(req.body.id, req.userId);
    //Log the search term for debugging
    if (!user1 || !user2) {
      return res.status(400).send({ error: "Both User Ids are required" });
    }
    // Replacing all the special character from the search term

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
    //return res.status(200).send("fn working");
  } catch (error) {
    console.error(error);
    //   return res.status(500).json({ error: error.message });
  }
};
