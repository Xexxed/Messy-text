import Message from "../models/MessagesModel.js";
import axios from "axios";

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

export const getAISuggestions = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    // Prepare the Gemini API request
    const response = await axios.post(
      "https://api.gemini.com/v1/chat/completions", // Replace with Gemini's actual endpoint
      {
        model: "gemini-2.0-flash", // Replace with the appropriate Gemini model
        messages: messages.map((msg) => ({
          role: msg.sender === "AI" ? "assistant" : "user",
          content: msg.content,
        })),
        max_tokens: 100,
        n: 3, // Get 3 suggestions
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`, // Use Gemini's API key
          "Content-Type": "application/json",
        },
      }
    );

    // Extract suggestions from the Gemini API response
    const suggestions = response.data.choices.map(
      (choice) => choice.message.content
    );

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error fetching AI suggestions from Gemini:", error);
    return res.status(500).json({ error: "Failed to fetch AI suggestions" });
  }
};
