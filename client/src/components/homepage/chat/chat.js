import React,{useContext, useState,useEffect} from 'react';
import {GlobalState} from '../../../GlobalState'
import NotFound from '../utils/NotFound/NotFound'
import MegaMenu from '../../header/MegaMenu'
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import moment from 'moment';
import axios from 'axios';
import io from 'socket.io-client'
import ReactEmoji from 'react-emoji';
import CircularProgress from '@mui/material/CircularProgress';
import Picker from "emoji-picker-react";
import Lottie from 'react-lottie'
import animationData from '../utils/Animation/typingAnimate.json'
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
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
const Chat = () => {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const [user] = state.userAPI.user
    const [token] = state.token
    const [chat] = state.chatAPI.chat
    const isSameSender = state.chatAPI.sameSender
    const isLatestMessage = state.chatAPI.latestMessage
    const [selectedMessage,setSelectedMessage] = useState([])
    const [selectedChat,setSelectedChat] = useState([])
    const [currentMessage,setCurrrentMessage] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const getUser = (user,users)=>{
        return users[0]._id === user._id ? users[1] : users[0]
    }
    useEffect(()=>{
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    })
    const typingMessage = (e)=>{
        setCurrrentMessage(e.target.value)
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id, currentMessage);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
              socket.emit("stop typing", selectedChat._id);
              setTyping(false);
            }
        }, timerLength);
    }
    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }
    const handleEmojiClick = (event, emojiObject) => {
        let msg= currentMessage;
        msg += emojiObject.emoji;
        setCurrrentMessage(msg)
    }
    const sendMessage = async ()=>{
      if(currentMessage && selectedChat){
        setCurrrentMessage("")
        socket.emit("stop typing", selectedChat._id);
        try {
          const res = await axios.post('/message',{content:currentMessage,chatId:selectedChat._id},{
              headers: {Authorization:token}
          })
          socket.emit("send_message", res.data);
          setSelectedMessage([...selectedMessage,res.data])
        } catch (err) {
          console.log(err)
        }
      }
    }
    useEffect(()=>{
        const getSelectedChat = async ()=>{
            if(token){
                if(selectedChat._id){
                    try {
                         const res = await axios.get('/message/' + selectedChat._id,{
                             headers: {Authorization:token}
                         })
                         setSelectedMessage(res.data)
                    }catch (err) {
                         console.log(err.message)
                    }
                }
            }
        }
        getSelectedChat()
        socket.on("recieve_message",(data)=>{
            setSelectedMessage([...selectedMessage,data])
        })
    },[selectedMessage,selectedChat._id,])
    return (
        isAdmin ?
        <>
            <MegaMenu />
            <div className='chat_page'>
                <div className='chat_left'>
                    <div className='search_bar'>
                        <input type="checkbox" id='check'/>
                        <div className='box'>
                            <input type="text" className='search_input' placeholder='Tìm kiếm người dùng...' />
                            <label htmlFor="check"><i className="fa fa-search" aria-hidden="true"></i></label>
                        </div>
                    </div>
                    <hr className='solid' />
                    <div className='list_user'>
                        {
                            chat.map((chat,index)=>{
                                const customer = getUser(user,chat.users)
                                return (
                                    <div key={index} >
                                        <div onClick={()=>{setSelectedChat(chat);socket.emit("setup",user);socket.emit("join room",chat._id)}} className={`list_user_item ${selectedChat !== [] && chat._id === selectedChat._id ? "background" : ''}`}>
                                            <Avatar src={customer.avatar}/>
                                            <div className='list_item_content'>
                                                <h6>{customer.name}</h6>
                                                {
                                                    chat.latestMessage ?
                                                    <span>{chat.latestMessage.content.slice(0,30)}...{moment(chat.latestMessage.createdAt).startOf('hour').fromNow()}</span>
                                                    :""
                                                }
                                            </div>
                                        </div>
                                        <hr className='solid' />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='chat_right'>
                    <div className='chat_header'>
                        <div className='box_avatar'>
                            {
                                selectedChat !== [] && selectedChat.users ? 
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Avatar src={getUser(user,selectedChat.users).avatar} />
                                    </StyledBadge> 
                                : ""
                            }
                        </div>
                        <div className='header_content'>
                            {
                                selectedChat !== [] && selectedChat.users ? <>
                                    <h4>{getUser(user,selectedChat.users).name}</h4>
                                    <span>Đang hoạt động</span>
                                </>
                                :""
                            }
                        </div>
                        <div className='header_icon'>
                            <PhoneIcon className='icon' />
                            <VideocamIcon className='icon'/>
                            <CloseIcon className='icon'/>
                        </div>
                    </div>
                    <div className='chat_body'>
                        {
                            selectedMessage.length === 0 ? <CircularProgress/> 
                            :
                            <>
                            <ScrollToBottom className='scrollable'>
                            {
                                selectedMessage.map((message,index)=>{
                                if(message){
                                    return (
                                        <div key={message._id} className='message' id={message.sender._id === user._id ? 'you' :'other'}>
                                            {
                                                isSameSender(selectedMessage,message,index,user._id) 
                                                || isLatestMessage(selectedMessage,index,user._id)
                                                ?   <div className='message_content'>
                                                        {
                                                            <Avatar src={message.sender.avatar} />
                                                        }
                                                        <span>{ReactEmoji.emojify(message.content)}</span>
                                                    </div>
                                                :   <div className='message_content margin_left'>
                                                        <span>{ReactEmoji.emojify(message.content)}</span>
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
                            {istyping ? (
                                <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={30}
                                    style={{ marginBottom: 10, marginLeft: 20 }}
                                />
                                </div>
                            ) : (
                            <></>
                            )}
                            </>
                        }
                    </div>
                    <div className='chat_footer'>
                        <input onKeyPress={(event) => {event.key === "Enter" && sendMessage();}} value={currentMessage} onChange={typingMessage} type="text" placeholder='Aa' />
                        <SendIcon onClick={sendMessage} className='icon'/>
                    </div>
                    <div className='emoji'>
                        <i onClick={handleEmojiPickerhideShow} className="fa fa-smile-o"></i>
                        {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                    </div>
                </div>
            </div>
        </>
        : <NotFound />
    );
}

export default Chat;
