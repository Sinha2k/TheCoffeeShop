import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { 
        type: mongoose.Schema.ObjectId, 
        ref: "Users" 
    },
    content: { 
        type: String, 
        trim: true 
    },
    chat: { 
        type: mongoose.Schema.ObjectId, 
        ref: "Chat" 
    },
    readBy: [
        { 
            type: mongoose.Schema.ObjectId, 
            ref: "Users" 
        }
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message