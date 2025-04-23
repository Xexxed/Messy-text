import Mongoose from "mongoose";

const messageSchema = new Mongoose.Schema({
  sender: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
  fileName: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isAi: {
    type: Boolean,
    default: false, // Default to false if not provided
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = Mongoose.model("Messages", messageSchema);
export default Message;
