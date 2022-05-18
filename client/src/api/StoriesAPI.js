import {useState,useEffect} from 'react';
import axios from 'axios'

function StoriesAPI (){
    const [allStories,setAllStories] = useState([])
    const [result,setResult] = useState([])
    const [callback,setCallback] = useState(false) 
    const [commentId,setCommentId] = useState('')


    useEffect(()=>{
        const getAllStories = async ()=>{
            const res = await axios.get(`/stories/all`)
            setAllStories(res.data.stories)
            setResult(res.data.result)
        }
        getAllStories()
    },[callback])
 
    return {
        allStories : [allStories,setAllStories],
        result:[result,setResult],
        callback:[callback,setCallback],
        commentId:[commentId,setCommentId],
    }
}

export default StoriesAPI;
