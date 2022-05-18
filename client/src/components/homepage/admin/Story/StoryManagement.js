import React, { useContext, useEffect, useState } from 'react';
import {GlobalState} from '../../../../GlobalState'
import Notfound from '../../utils/NotFound/NotFound'
import { Editor } from "react-draft-wysiwyg";
import {convertToRaw, EditorState} from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Modal,Button } from 'react-bootstrap';
import { storage } from '../../../../firebase';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import { toast } from 'react-toastify';
import axios from 'axios';
import MegaMenu from '../../../header/MegaMenu';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

const StoryManagement = () => {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [allStories] = state.storiesAPI.allStories
    const [callback,setCallback] = state.storiesAPI.callback
    const [lgShow, setLgShow] = useState(false);
    const [edit,setEdit] = useState(false)
    const [progress,setProgress] = useState(0)
    const [editorState,setEditorState] = useState(EditorState.createEmpty())
    const onEditorStateChange = (editorState)=>{
        setEditorState(editorState)
    }
    const initialState ={
        story_id:'',
        title:'',
        content:'',
        description:'',
        category:'',
        image:''
    }
    const deleteStory = async (id)=>{
        try {
            if(window.confirm('Bạn thực sự muốn xóa bài viết này ???')){
                await axios.delete('/stories/'+id,{
                    headers:{Authorization:token}
                })
                toast.success("Xóa bài viết thành công")
                setCallback(!callback)
            } 
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }
    const columns = [
        {field: 'id',headerName: 'Story Id',width:100},
        {field: 'title',headerName: 'Title',width:300},
        {field: 'description',headerName: 'Mô tả',width:450},
        {field: 'category',headerName: 'Thể loại',width:150},
        {field: 'edit',headerName: '',width:60,renderCell:(story)=><Tooltip title="Chỉnh sửa" placement='left'><EditIcon onClick={()=>{setLgShow(true);setEdit(true)}} className='icon' style={{color:"rgb(109, 196, 28)"}} /></Tooltip>},
        {field: 'delete',headerName: '',width:60, renderCell:(story)=><Tooltip title="Xóa" placement='right'><DeleteIcon onClick={()=>{deleteStory(story.row._id)}} className='icon' style={{color:"red"}} /></Tooltip>}
    ]
    const rows = allStories.map((story)=>{
        return {
            id: story.story_id,
            title: story.title.slice(0,60) + "...",
            description : story.description.slice(0,60) + "...",
            category : story.category,
            _id:story._id,  
        }
    })
    const [story, setStory] = useState(initialState)
    const [content,setContent] = useState('')
    const handleChangeInput = (e)=>{
        const {name, value} = e.target
        setStory({...story, [name]:value})
    }
    const formHandler = (e)=>{
        e.preventDefault()
        const file = e.target[0].files[0]
        uploadFile(file)
    }
    const uploadFile = (file)=>{
        if(!file) {
            toast.error("File doesn't exist")
        };
        if(file.size> 1024*1024){
            toast.error("File too large")
        }
        if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg'){
            toast.error("File format is incorrect")
        }
        const storageRef = ref(storage,`/files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef,file)

        uploadTask.on("state_changed", (snapshot)=>{
            const prog = Math.round((snapshot.bytesTransferred/ snapshot.totalBytes)*100)
            setProgress(prog)
        }, (err)=> console.log(err),
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((url)=>setStory({...story,image:url}))
          } 
        ) 
    }
    const handlerSubmit = async ()=>{
        setLgShow(false)
        story.content = content
        try {
            const res = await axios.post('/stories',{...story},{
                headers:{Authorization:token}
            })
            console.log(res.data.newStory)
            toast.success("Thêm mới story thành công")
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }
    useEffect(()=>{
        setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        // if(id){
        //     stories.forEach(item=>{
        //         if(item._id === id){
        //             setStory(item)
        //             setEdit(true)
        //         }
        //     })
        // }else{
        //     setStory(initialState)
        //     setEdit(false)
        // }
    },[editorState])
    return (
        <>
            {
                isAdmin ? 
                <>
                    <MegaMenu />
                    <div className='order_history'>
                        <h1>Quản lý bài viết</h1>
                        <h4>Bạn có {allStories.length} bài viết</h4>
                        <Button className='button_modal' onClick={() => {setLgShow(true)}}>Thêm</Button>
                        <Modal
                            size="lg"
                            show={lgShow}
                            onHide={() => setLgShow(false)}
                            aria-labelledby="example-modal-sizes-title-lg"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-lg">
                                    {
                                        edit ? <h2>Chỉnh sửa bài viết</h2> : <h2>Thêm mới bài viết</h2>
                                    }
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='modal_product'>
                                <div className='row_item'>
                                    <div className='item_row'>
                                        <h6>Story_Id</h6>
                                        {
                                            edit ? <input readOnly name='story_id' required value={story.story_id} onChange={handleChangeInput} style={{width:"80px"}}/> : <input name='story_id' required value={story.story_id} onChange={handleChangeInput} style={{width:"80px"}} placeholder='sto**'/>
                                        }
                                        
                                    </div>
                                    <div className='item_row'>
                                        <h6>Title</h6>
                                        <input name='title' required value={story.title} onChange={handleChangeInput} style={{width:"300px"}} placeholder='CÁCH NHẬN BIẾT ...'/>
                                    </div>
                                    
                                </div>
                                <div className='row_category'>
                                    <h6>Thể loại</h6>
                                    <select name='category' value={story.category} onChange={handleChangeInput}>
                                        <option>Coffeeholic</option>
                                        <option>Teaholic</option>
                                        <option>Blog</option>
                                    </select>
                                </div>
                                <form onSubmit={formHandler}>
                                    <input accept='.jpg,.png' id='file' type="file" />
                                    <label htmlFor='file'>
                                        <i className="fa fa-file-image-o" aria-hidden="true"></i>
                                        Chọn ảnh
                                    </label>
                                    <button type='submit' >Tải lên</button><span>Uploaded {progress} %</span>
                                </form>
                                <h6>Mô tả</h6>
                                <textarea required value={story.description} type='text' name='description' onChange={handleChangeInput} placeholder='Description...'  rows="8" cols="116"></textarea>
                                <h6>Nội dung</h6>
                                <Editor
                                    editorState={editorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={onEditorStateChange}
                                />;
                            </Modal.Body>
                            <Modal.Footer className='modal_footer'>
                                <Button className='button_modal' onClick={() => setLgShow(false)}>Thoát</Button>
                                <Button type='submit' className='button_modal' onClick={handlerSubmit}>Lưu</Button>
                            </Modal.Footer>
                        </Modal>
                        <div className='data_table' style={{ height: 350, width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                            />
                        </div>
                    </div>
                </>
                : <Notfound />
            }
        </>
    );
}

export default StoryManagement;
