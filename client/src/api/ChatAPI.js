import axios from 'axios';
import  {  useEffect, useState } from 'react';
const ChatAPI = (token) => {
    const [chat,setChat] = useState([])
    const [message,setMessage] = useState([])
    useEffect(()=>{
        if(token){
            const fetchChat = async ()=>{
                const res = await axios.get('/chat',{
                    headers: {Authorization:token}
                })
                setChat(res.data)
            }
            fetchChat()
        }
    },[chat,token])
    useEffect(()=>{
        if(token){
            const getMessage = async()=>{
                if(chat[0]){
                  try {
                    const res = await axios.get('/message/'+chat[0]._id,{
                      headers: {Authorization:token}
                    })
                    setMessage(res.data)
                    
                  } catch (err) {
                    console.log(err)
                  }
                }
            }
            getMessage()
        }
    },[chat,token,message])
    const isSameSender = (messages,m,i,userId)=>{
        return (
            i< messages.length-1 && (messages[i+1].sender._id !== m.sender._id || messages[i+1].sender._id === undefined)  && messages[i].sender._id !== userId
        )
    }
    const isLatestMessage = (messages,i,userId)=>{
        return (
            i === messages.length -1 && messages[messages.length - 1].sender._id !== userId && messages[messages.length - 1].sender._id
        )
    }
    return {
        chat : [chat,setChat],
        message : [message,setMessage],
        sameSender : isSameSender,
        latestMessage : isLatestMessage
    }
}

export default ChatAPI;
