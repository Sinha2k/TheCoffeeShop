import React, { useContext,useEffect,useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { GlobalState } from '../../../../GlobalState';
import axios from 'axios'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Picker from "emoji-picker-react";
import animationData from '../Animation/typingAnimate.json'
import Lottie from 'react-lottie'

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
const socket = io.connect("http://localhost:8000")
const ChatBox = ({setInbox}) => {
    const state = useContext(GlobalState)
    const [message,setMessage] = state.chatAPI.message
    const [user] = state.userAPI.user
    const [token] = state.token
    const [chat] = state.chatAPI.chat
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [currentMessage,setCurrrentMessage] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    const handleEmojiPickerhideShow = () => {
      setShowEmojiPicker(!showEmojiPicker);
    }
    useEffect(()=>{
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    })
    const handleEmojiClick = (event, emojiObject) => {
      setShowEmojiPicker(false)
      let msg= currentMessage;
      msg += emojiObject.emoji;
      setCurrrentMessage(msg)
    }
    const getUser = (user,users)=>{
      return users[0]._id === user._id ? users[1] : users[0]
    }
    const typingMessage = (e)=>{
        setCurrrentMessage(e.target.value)
        if (!typing) {
          setTyping(true);
          socket.emit("typing", chat[0]._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", chat[0]._id);
            setTyping(false);
          }
        }, timerLength);
    }
    const sendMessage = async (e)=>{
      if(currentMessage){
        setCurrrentMessage("")
        socket.emit("stop typing", chat[0]._id);
        try {
          const res = await axios.post('/message',{content:currentMessage,chatId:chat[0]._id},{
              headers: {Authorization:token}
          })
          setMessage([...message,res.data])
          socket.emit("send_message", res.data);
        } catch (err) {
          console.log(err)
        }
      }
    }
    return (
        <div className='chat-box'>
            <div className='box_header'>
                <div className='box_avatar'>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar src={chat[0] && getUser(user,chat[0].users).avatar} alt='Admin' />
                    </StyledBadge>
                </div>
                <div className='header_content'>
                    <h4>Admin</h4>
                    <span>Đang hoạt động</span>
                </div>
                <div className='header_icon'>
                    <PhoneIcon className='icon' />
                    <VideocamIcon className='icon'/>
                    <CloseIcon onClick={()=>setInbox(false)} className='icon'/>
                </div>
            </div>
            <div className='box_body'>
               <ScrollableChat/>
               {istyping ? (
                    <div>
                      <Lottie
                        options={defaultOptions}
                        width={50}
                        style={{ marginBottom: 10, marginLeft: 10 }}
                      />
                    </div>
                ) : (
                  <></>
                )}
            </div>
            <div className='box_footer'>
                <input onKeyPress={(event) => {event.key === "Enter" && sendMessage();}} value={currentMessage} onChange={typingMessage} type="text" placeholder='Aa' />
                <SendIcon onClick={sendMessage} className='icon send'/>
            </div>
            <div className='emoji'>
              <i onClick={handleEmojiPickerhideShow} className="fa fa-smile-o" aria-hidden="true"></i>
              {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} className="picker_emoji" />}
            </div>
        </div>
    );
}

export default ChatBox;
