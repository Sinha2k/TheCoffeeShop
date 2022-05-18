import React,{useContext,useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import { GlobalState } from '../../../../GlobalState';
import ScrollToBottom from 'react-scroll-to-bottom';
import io from 'socket.io-client'
import ReactEmoji from 'react-emoji'

const socket = io.connect("http://localhost:8000")
const ScrollableChat = () => {
    const state = useContext(GlobalState)
    const [user]= state.userAPI.user
    const [message,setMessage] = state.chatAPI.message
    const isSameSender = state.chatAPI.sameSender
    const isLatestMessage = state.chatAPI.latestMessage
    useEffect(()=>{
        socket.on("recieve_message",(data)=>{
            setMessage([...message,data])
        })
    })
    return (
        <ScrollToBottom className='scrollable'>
           {
               message.map((m,index)=>{
                   if(m){
                      return (
                          <div key={m._id} className='message' id={m.sender._id === user._id ? 'you' :'other'}>
                                {
                                    isSameSender(message,m,index,user._id) 
                                    || isLatestMessage(message,index,user._id)
                                    ?   <div className='message_content'>
                                            <Avatar src={m.sender.avatar} />
                                            <span>{ReactEmoji.emojify(m.content)}</span>
                                        </div>
                                    :   <div className='message_content margin_left'>
                                            <span>{ReactEmoji.emojify(m.content)}</span>
                                        </div>
                                }
                          </div>
                      )
                   }else{
                       return <span>Hai bạn đã được kết nối trên messenger</span>
                   }
               })
           }
        </ScrollToBottom>
    );
}

export default ScrollableChat;
