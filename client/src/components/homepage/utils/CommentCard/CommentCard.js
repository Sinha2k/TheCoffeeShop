import { Avatar } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { GlobalState } from '../../../../GlobalState';
import vip from '../../../header/image/vip.png'
import axios from 'axios';
const CommentCard = ({comment,focusInput,edit,setEdit,parentCommentId,onReply,setOnReply,tag,commentList}) => {
    const state = useContext(GlobalState)
    const [user] = state.userAPI.user
    const [isLogged] = state.userAPI.isLogged
    const [token] = state.token
    const [callback,setCallback] = state.storiesAPI.callback
    const [commentId,setCommentId] = state.storiesAPI.commentId
    const [showMore,setShowMore] = useState(false)
    const [isLike,setIsLike] = useState(false)
    useEffect(()=>{
        setIsLike(false)
        if(comment.likes && comment.likes.find(like => like._id === user._id)){
            setIsLike(true)
        }
    },[comment.likes,user._id])
    const likeComment = async(id)=>{
        setIsLike(true)
        comment.likes.length = comment.likes.length + 1
        try {
            await axios.get('/comment/' + id + '/like',{
                headers:{Authorization:token}
            })
        } catch (err) {
            console.log(err);
        }
    }
    const unlikeComment = async (id)=>{
        setIsLike(false)
        comment.likes.length = comment.likes.length - 1
        try {
            await axios.get('/comment/' + id + '/unlike',{
                headers:{Authorization:token}
            })
        } catch (err) {
            console.log(err);
        }
    }
    const deleteComment = async(id)=>{
        if(window.confirm("Bạn có thực sự muốn xóa bình luận này ???")){
            try {
                commentList && commentList.filter(cm => cm._id !== id) 
                const comments = commentList && commentList.filter(cm => cm.reply === id)
                comments && comments.forEach( async(item)=>{
                    await axios.delete('/comment/' + item._id,{
                        headers:{Authorization:token}
                    })
                })
                await axios.delete('/comment/' + id,{
                    headers:{Authorization:token}
                })
                setCallback(!callback)
            } catch (err) {
                console.log(err);
            }
        }
    }
    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? 'inherit' : 'none'
    }
    return (
        <div className='commentCard' style={styleCard}>
            <Avatar src={comment.writer.avatar}/>
            <div className='comment_body'>
                <div className='body_item'>
                    <h6>{comment.writer.name}</h6>
                    {
                        comment.writer._id === "62304b3e5e92797844ecb568" ? <img src={vip} alt=""/> : ""
                    }
                    {
                        tag ? <h6>@{tag}</h6> : ''
                    }
                    <p>{comment.content}</p>
                </div>
                <div className='body_item'>
                    <span>{moment(comment.createdAt).fromNow()}</span>
                    <span>{comment.likes.length} lượt thích</span>
                    {
                        isLogged ? onReply && onReply.parentCommentId === comment._id ? <span onClick={()=>{setOnReply(false)}}>Thoát</span> : <span onClick={()=>{setOnReply({...comment,parentCommentId});focusInput()}}>Trả lời</span>
                        : ''
                    }
                    {
                        comment.writer._id === user._id && !edit ? <MoreHorizIcon onClick={()=>setShowMore(!showMore)} fontSize='10px' className='more_icon'/> : " "
                    }
                    {
                        showMore ? <div className='more_select'>
                                        <p onClick={()=> {setShowMore(false);deleteComment(comment._id)}}>Xóa</p>
                                        <p onClick={()=> {focusInput();setShowMore(false);setEdit(true);setCommentId(comment._id)}}>Chỉnh sửa</p>
                                    </div> 
                                : ""
                    }
                    {
                        edit && commentId === comment._id ? <span style={{marginLeft:"0px"}} onClick={()=>{setEdit(false);setCommentId('')}}>Thoát</span> : " "
                    }
                </div>
            </div>
            {
                isLogged ? 
                <>
                    {
                        !isLike ? <i onClick={()=>likeComment(comment._id)} className={`fa fa-heart-o`}></i>
                        : <i onClick={()=>unlikeComment(comment._id)}  style={{color:"red"}} className={`fa fa-heart`}></i>
                    }
                </>
                : ""
            }
        </div>
    );
}

export default CommentCard;
