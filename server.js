import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from './routes/userRouter.js';
import categoryRouter from './routes/categoryRouter.js'
import productRouter from './routes/productRouter.js'
import storyRouter from './routes/storyRouter.js'
import paymentRouter from './routes/paymentRouter.js'
import chatRouter from './routes/chatRouter.js'
import messageRouter from './routes/messageRouter.js'
import commentRouter from './routes/commentRouter.js'
import { Server } from "socket.io";
import path from 'path'

const app = express()
let users = []
app.use(express.json())
app.use(cookieParser())
app.use(cors());

app.get('/',(req,res)=>{
    res.json({msg: "Welcome to my project"})
})
app.use('/user',userRouter);
app.use('/category',categoryRouter);
app.use('/products',productRouter);
app.use('/stories',storyRouter);
app.use('/payments',paymentRouter);
app.use('/chat',chatRouter);
app.use('/message',messageRouter);
app.use('/comment',commentRouter)

const PORT = process.env.PORT || 8000
const URI = process.env.MONGODB_URL
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
mongoose
.connect(URI, {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to Db");
    const server = app.listen(PORT,()=>{
        console.log('Server is running on port',PORT)
    });
    const io = new Server(server,{
        pingTimeout : 60000,
        cors:{
            origin: "http://localhost:3000",
        },
    })
    io.on("connection",(socket)=>{
        socket.on("setup", (userData) => {
            socket.join(userData._id);
            socket.emit("connected");
        });
        socket.on("join room",(data)=>{
            socket.join(data)
        })
        socket.on("send_message",(data)=>{
            socket.to(data.chat._id).emit("recieve_message",data)
        })
        socket.on("join story",(data)=>{
            socket.join(data)
        })
        socket.on("create_comment",(data)=>{
            socket.to(data.storyId).emit("recieve_comment",data)
        })
        socket.on("delete_comment",(data)=>{
            socket.to(data.storyId).emit("remove_comment",data)
        })
        socket.on("typing", (room) => {
            socket.in(room).emit("typing")
        })
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

        socket.on("disconnect",()=>{
            
        })
    })
})
.catch((err)=>{
    console.log('err',err);
});