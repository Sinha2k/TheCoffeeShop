import React,{useEffect,useState} from 'react';
import CommentCard from './CommentCard';

const ReplyComment = ({replyCommentLists,parentCommentId,onReply,setOnReply,focusInput,edit,setEdit,index}) => {
    const [childCommentNumber,setChildCommentNumber] = useState(0)
    const [showReply,setShowReply] = useState(false)
    useEffect(()=>{
        let number = 0
        replyCommentLists.map((comment)=>{
            if(comment.reply === parentCommentId){
                number ++
            }
        })
        setChildCommentNumber(number)
    },[parentCommentId,replyCommentLists])
    return (
            <React.Fragment key={index}>
                {
                    childCommentNumber ? <div style={{cursor:"pointer",marginLeft: '5%',marginTop:"-4px",display:"flex",alignItems:"center"}}>
                          <div style={{width:"18px",height:"1px",background:"gray",marginRight:"7px"}}></div>
                          {
                            !showReply ? <span onClick={()=>setShowReply(true)}>Xem câu trả lời ({childCommentNumber})</span> : <span onClick={()=>setShowReply(false)}>Ẩn câu trả lời</span>
                          }
                    </div>
                    : ""
                }
                {
                    showReply && replyCommentLists.map((comment)=>(
                        <>
                            {
                                comment.reply === parentCommentId &&
                                <div style={{ width: '95%', marginLeft: '5%' }} key={comment._id}>
                                    <CommentCard tag={comment.tag.name} onReply={onReply} setOnReply={setOnReply} comment={comment} parentCommentId={comment._id} focusInput={focusInput} edit={edit} setEdit={setEdit}/>
                                    <ReplyComment key={comment._id + 'id'} replyCommentLists={replyCommentLists} parentCommentId={comment._id} onReply={onReply} setOnReply={setOnReply} focusInput={focusInput} edit={edit} setEdit={setEdit}/>
                                </div>
                            }
                        </>
                    ))
                }
            </React.Fragment>
    );
}

export default ReplyComment;
