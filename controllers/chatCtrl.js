import Chat from "../models/chatModel.js";
import User from '../models/userModel.js'

const chatCtrl = {
    accessChat : async (req,res)=>{
        const {userId} = req.body
        if(!userId) return res.status(400).json("UserId param not sent with request")
        var isChat = await Chat.find({
            isGroupChat: false,
            $and : [
                {users:req.user.id},
                {users:userId}
            ],
        })
            .populate("users","-password")
            .populate("latestMessage")
        isChat = await User.populate(isChat,{
            path: "latestMessage.sender",
            select:"name avatar email"
        })
        if(isChat.length > 0){
            res.send(isChat[0])
        }else{
            const chatData = {
                chatName:"sender",
                users:[req.user.id,userId]
            };
            try {
                const createChat = await Chat.create(chatData)
                const fullChat = await Chat.findOne({_id:createChat._id}).populate("users","-password")
                res.status(200).json({fullChat})
            } catch (err) {
                res.status(500).json({msg:err.message})
            }
        }
    },
    fetchChats: async(req,res)=>{
        try {
            Chat.find({users:req.user.id})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("latestMessage")
            .sort({updatedAt:-1})
            .then(async (result)=>{
                result = await User.populate(result,{
                    path:"latestMessage.sender",
                    select:"name avatar email"
                })
                res.status(200).send(result)
            })
        } catch (err) {
            res.status(500).json({msg:err.message})
        }
    },
    createGroupChat : async(req,res)=>{
        if(!req.body.users || !req.body.name){
            return res.status(400).json("Please all the fields")
        }
        const users = JSON.stringify(req.body.users)
        if(users.length < 2){
            res.status(400).json("More than 2 users are required to form a group chat")
        }
        users.push(req.user)
        try {
            const groupChat = await Chat.create({
                chatName : req.body.name,
                users:users,
                isGroupChat:true,
                groupAdmin:req.user
            })
            const fullGroupChat = await Chat.findOne({_id:groupChat._id})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            res.status(200).json({fullGroupChat})
        } catch (err) {
            res.status(500).json({msg:err.message})
        }
    }
}
export default chatCtrl