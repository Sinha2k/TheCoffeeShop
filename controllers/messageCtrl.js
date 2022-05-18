import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

const messageCtrl = {
    allMessages: async(req,res)=>{
        try {
            const messages = await Message.find({ chat: req.params.id })
              .populate("sender", "name avatar email")
              .populate("chat");
            res.json(messages);
          } catch (err) {
            res.status(400).json(err.message);
          }
    },
    sendMessage: async(req,res)=>{
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            return res.status(400).json("Invalid data passed into request");
        }

        const newMessage = {
            sender: req.user.id,
            content: content,
            chat: chatId,
        };

        try {
            var message = await Message.create(newMessage)

            message = await message.populate("sender", "name avatar")
            message = await message.populate("chat")
            message = await User.populate(message, {
            path: "chat.users",
            select: "name avatar email",
            });

            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

            res.json(message);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

export default messageCtrl