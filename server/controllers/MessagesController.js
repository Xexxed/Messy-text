import Message from "../models/MessagesModel.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
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
    console.log("Messages from body:", req.body); // Log the messages for debugging

    // Validate the input
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    // Initialize Groq SDK with the API key
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Prepare the messages for the Groq API
    const formattedMessages = messages.map((msg) => ({
      sender: msg.sender, // Convert sender to string if needed
      receiver: msg.receiver, // Convert receiver to string if needed
      content: msg.content,
      timestamp: msg.timestamp,
    }));
    console.log("Formatted messages:", formattedMessages); // Log the formatted messages for debugging

    // Call the Groq API to generate chat completions
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system", // Convert sender to string if needed
          content:
            'You are an expert at generating casual, friendly conversation suggestions. I’ll give you up to 10 recent messages exchanged between a user and someone they\'re chatting with. Based on the flow and context of the conversation, suggest 3 natural and engaging messages the user could send next. If there are fewer than 10 messages, use whatever context is available to keep the vibe light, friendly, and easygoing. The input will be an object containing the following keys: sender, receiver, content, and timestamp. The output should be a string with the following keys: suggestion1, suggestion2, suggestion3. Each suggestion should sound like something someone would naturally say in a casual chat. Keep it friendly, fun, and human. For example, if the messages show they were talking about weekend plans, your output might look like: suggestion1: "That sounds like a chill weekend. Got any must-watch shows lately?", suggestion2: "Nice! I’ve been meaning to do something low-key too. Might hit a cafe or something.", suggestion3: "Love that. Honestly, lazy weekends are the best kind."',
        },
        {
          role: "user",
          content: `Here are the last 10 messages between the user and the receiver: ${JSON.stringify(
            formattedMessages
          )}. Please provide 3 suggestions based on the messages context.`,
        },
      ],
      model: "llama-3.3-70b-versatile", // Replace with the appropriate model
    });

    // Extract suggestions from the Groq API response
    const suggestions = chatCompletion.choices
      .map((choice) => choice.message.content)
      .toString(); // Convert to string if needed
    const suggestionsArray = Array.from(
      suggestions.matchAll(/suggestion\d+:\s*"([^"]+)"/g),
      (match) => match[1]
    );
    // Return the suggestions to the client
    console.log("AI Suggestions:", suggestionsArray); // Log the suggestions for debugging
    return res.status(200).send(suggestionsArray);
  } catch (error) {
    console.error("Error fetching AI suggestions from Groq:", error);
    return res.status(500).json({ error: "Failed to fetch AI suggestions" });
  }
};
