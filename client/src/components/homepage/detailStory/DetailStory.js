import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { GlobalState } from '../../../GlobalState';
import { Row,Col } from 'react-bootstrap';
import StoriesItem from '../utils/StoriesItem/storiesItem';
import Loading from '../utils/Loading/Loading'
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Avatar } from '@mui/material';
import CommentCard from '../utils/CommentCard/CommentCard';
import Picker from "emoji-picker-react";
import ReplyComment from '../utils/CommentCard/ReplyComment'
import io from 'socket.io-client'

const socket = io.connect("http://localhost:8000")
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const DetailStory = () => {
    const state = useContext(GlobalState)
    const [user] = state.userAPI.user
    const [stories] = state.storiesAPI.allStories
    const [commentId,setCommentId] = state.storiesAPI.commentId
    const [token] = state.token
    const [isLogged] = state.userAPI.isLogged
    const [callback,setCallback] = state.storiesAPI.callback
    const [detailStory,setDetailStory] = useState([])
    const [likeList,setLikeList] = useState([])
    const [id,setId] = useState('')
    const [prevId,setPrevId] = useState('')
    const [prev,setPrev] = useState(false)
    const [next,setNext] = useState(true)
    const [open, setOpen] = React.useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [content,setContent] = useState('')
    const [edit,setEdit] = useState(false)
    const [onReply,setOnReply] = useState(false)
    const [showComment,setShowComment] = useState([])
    const [openComment,setOpenComment] = useState(false)
    const input = useRef(null)
    const params = useParams()
    var count = 0
    const getLikeList= async()=>{
        try {
            const res = await axios.get('/stories/' + params.id + "/getLikeList")
            setLikeList(res.data.story.like)
        } catch (err) {
            console.log(err)
        }
    }
    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }
    const handleEmojiClick = (event, emojiObject) => {
        setShowEmojiPicker(false)
        let cont= content;
        cont += emojiObject.emoji;
        setContent(cont)
    }
    const focusInput = ()=>{
        input.current.focus()
    }
    useEffect(()=>{
        if(params){
            stories.forEach(story=>{
                if(story._id===params.id){
                    setDetailStory(story);
                    const index = stories.indexOf(story)
                    if(index < stories.length-1 && index > 0){
                        const item = stories[index+1]
                        const itemPrev = stories[index-1]
                        setPrev(true)
                        setId(item._id)
                        setPrevId(itemPrev._id)
                    }else if(index === 0){
                        setPrev(false)
                        const item = stories[index+1]
                        setId(item._id)
                    }else if(index === stories.length - 1){
                        setNext(false)
                        setPrev(true)
                        const itemPrev = stories[index-1]
                        setPrevId(itemPrev._id)
                    }
                } 
            })
        }
        getLikeList()
    },[params,stories])
    useEffect(()=>{
        socket.emit("setup",user)
        socket.emit("join story",detailStory)
    })
    useEffect(()=>{
        if(detailStory.comments){
            const comment = detailStory.comments
            setShowComment(comment)
        }
        socket.on("recieve_comment",(data)=>{
            showComment.push(data.comment)
        })
    },[detailStory.comments,showComment])
    const prevStory = ()=>{
        window.location.href = '/detail/story/' + prevId
    }
    const nextStory = ()=>{
        window.location.href = '/detail/story/' + id
    }
    const handlerLike = async ()=>{
        try {
            if(detailStory.like.includes(user._id) && isLogged){
                detailStory.likeCount = detailStory.likeCount - 1
                detailStory.like.splice(detailStory.like.indexOf(user._id),1)
                await axios.get('/stories/'+params.id+'/disLike',{
                    headers:{Authorization:token}
                })
                setCallback(!callback)
            }else if(!detailStory.like.includes(user._id) && isLogged){
                detailStory.likeCount = detailStory.likeCount + 1
                detailStory.like.push(user._id)
                await axios.get('/stories/'+params.id+'/like',{
                    headers:{Authorization:token}
                })
                setCallback(!callback)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const markStory = async()=>{
        try {
            const storiesList = user.storiesList
            if(storiesList.includes(detailStory._id)){
                storiesList.splice(storiesList.indexOf(detailStory._id))
                await axios.patch('/user/updateStoriesList',{storiesList},{
                    headers:{Authorization:token}
                })
            }else if(!storiesList.includes(detailStory._id)){
                storiesList.push(detailStory._id)
                await axios.patch('/user/updateStoriesList',{storiesList},{
                    headers:{Authorization:token}
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
    const handleInput = (e)=>{
        if(onReply){
            setContent(e.target.value.slice(onReply.writer.name.length + 4))
        }else{
            setContent(e.target.value)
        }
    }
    const createComment = async()=>{
       if(content){
          try {
                setContent('')
                if(commentId){
                    await axios.patch('/comment/'+commentId,{content:content},{
                        headers:{Authorization:token}
                    })
                    setEdit(false)
                    setCommentId('')
                }else if(commentId === ''){
                    const comment = {
                        content:content,
                        storyId:params.id,
                        writer : user,
                        likes : [],
                        createdAt:new Date().toISOString(),
                        reply:  onReply ? onReply.parentCommentId : undefined, 
                        tag: onReply && onReply.writer
                    }
                    detailStory.comments.push(comment)
                    const res = await axios.post('/comment',{content:content,storyId:params.id,createdAt:new Date().toISOString(),reply:  onReply ? onReply.parentCommentId : undefined, tag: onReply && onReply.writer},{
                        headers:{Authorization:token}
                    })   
                    socket.emit("create_comment",res.data)
                }
                setOnReply(false)
                setCallback(!callback)
          } catch (err) {
                console.log(err)
          }
       }
    }
    return (
        <>
        <div className='detail_story'>
            <div className='detail_story_header'>
                <img alt='' src={detailStory.image} />
            </div>
            <div className='detail_story_body'>
                <p>Blog | {detailStory.category}</p>
                <h3>{detailStory.title}</h3>
                <h5>{detailStory.description}</h5>
                <div className='detail_story_content'>
                    <div className='story_content' dangerouslySetInnerHTML={{ __html: detailStory.content }} /> 
                </div>
            </div>
            <div className='next_story'>
                {prev ? <button onClick={prevStory}>Bài trước đó</button> : ""}
                {next ? <button className='next_button' onClick={nextStory}>Bài kế tiếp</button> : ""}
            </div>
            <hr className='solid'/>
            <div className='icons_story'>
                <i onClick={handlerLike} className={`fa ${detailStory.like && detailStory.like.includes(user._id) ? "fa-heart" : "fa-heart-o"}`} ></i>
                <i onClick={focusInput} className="fa fa-comment-o" ></i>
                <i onClick={markStory} className={`fa ${user.storiesList && user.storiesList.includes(detailStory._id) ? "fa-bookmark" : "fa-bookmark-o"}`}></i>
            </div>
            <div style={{marginBottom:"7px"}} className='user_like'>
                <h6 onClick={()=>setOpen(true)}>
                    {
                        detailStory.like && detailStory.like.includes(user._id)
                        ? "Bạn và " + (detailStory.likeCount-1) + " người khác thích"
                        : detailStory.likeCount + " người thích"
                    }
                </h6>
            </div>
            <div className='comment_display'>
                {
                    openComment && showComment && showComment.filter(cm=>!cm.reply).map((comment,index)=>{
                        const replyCommentLists = detailStory.comments.filter(cm => cm.reply)
                        return <React.Fragment key={index}>
                                <CommentCard commentList={detailStory.comments} onReply={onReply} setOnReply={setOnReply} comment={comment} parentCommentId={comment._id} focusInput={focusInput} edit={edit} setEdit={setEdit}/>
                                <ReplyComment key={index + 'id'} index={'id' + index} replyCommentLists={replyCommentLists} parentCommentId={comment._id} onReply={onReply} setOnReply={setOnReply} focusInput={focusInput} edit={edit} setEdit={setEdit}/>
                            </React.Fragment>
                    })
                }
            </div>
            {
                openComment ? <span className='show_comment' style={{cursor:"pointer",fontStyle:'italic',fontSize:"0.8rem",marginTop:"7px"}} onClick={()=>setOpenComment(false)}>Ẩn bình luận</span> : detailStory.comments && <span className='show_comment' style={{cursor:"pointer",fontStyle:'italic',fontSize:"0.8rem"}} onClick={()=>setOpenComment(true)}>Xem thêm {detailStory.comments.length} bình luận</span>
            }
            {
                isLogged ? <>
                        <div className='comment_input'>
                            <input ref={input} onKeyPress={(event) => {event.key === "Enter" && createComment();}} onChange={handleInput} value={onReply ? '@'+ onReply.writer.name + ' : ' + content : content} placeholder='Viết bình luận của bạn ...' />
                            <h5 onClick={createComment}>Đăng</h5>
                        </div>
                        <div className='emoji_cmt'>
                            <i onClick={handleEmojiPickerhideShow} className="fa fa-meh-o"></i>
                            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
                        </div>
                </>
                : ''
            }
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={()=>setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Lượt thích"}</DialogTitle>
                <DialogContent>
                    {
                        likeList.map((user)=>{
                            return <div key={user._id} className='user_item'>
                                <Avatar src={user.avatar} />
                                <div className='user_info'>
                                    <h6>{user.name}</h6>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        })
                    }
                </DialogContent>
            </Dialog>
            <h4>Bài viết mới nhất</h4>
            <div className='recently'>
                <Row>
                    {
                        stories.map((story)=>{
                            if(story.category === detailStory.category){
                                count ++
                                if(count < 7){
                                    return <Col lg={4} md={6} sm={12} key={story._id} ><StoriesItem story={story} /></Col>
                                }
                            }
                            return null
                        })
                    }
                </Row>
            </div>
        </div>
        {
            detailStory.length === 0 ? <Loading /> : ""
        }
        </>
    );
}

export default DetailStory;
