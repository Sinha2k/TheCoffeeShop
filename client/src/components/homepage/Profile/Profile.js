import React, { useContext,useState } from 'react';
import {GlobalState} from '../../../GlobalState'
import Notfound from '../utils/NotFound/NotFound'
import { Button,Modal } from 'react-bootstrap';
import { storage } from '../../../firebase';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../utils/Loading/Loading'
import Tooltip from '@mui/material/Tooltip';
import MegaMenu from '../../header/MegaMenu';
const Profile = () => {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [user] = state.userAPI.user
    const initialState = {
        name: '',
        email:''
    }
    const [callback,setCallback] = state.userAPI.callback
    const [token] = state.token
    const [show, setShow] = useState(false);
    const [change,setChange] = useState(false)
    const [password,setPassword] = useState({
        oldPassword :'',
        newPassword :'',
        confirmPassword:''
    })
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
        setChange(false)
        setProfile(user)
    }
    const [loading,setLoading] = useState(false)
    const [profile,setProfile] = useState(initialState)
    const handlerImage = (e)=>{
        e.preventDefault()
        const file = e.target.files[0]
        if(!file) {
            toast.error("File doesn't exist")
        };
        if(file.size> 1024*1024){
            toast.error("File too large")
        }
        if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg'){
            toast.error("File format is incorrect")
        }
        uploadFile(file)
    }
    const handlerChange = ()=>{
        const inputFile = document.getElementById('file')
        inputFile.click()
    }
    const uploadFile = (file)=>{
        const storageRef = ref(storage,`/files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef,file)
        setLoading(true)
        uploadTask.on("state_changed", (snapshot)=>{
        }, (err)=> console.log(err),
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then(async (url)=>{
                
                try {
                    await axios.put('/user/updateProfile',{avatar:url},{
                        headers:{Authorization:token}
                    })
                    setCallback(!callback)
                    toast.success("Update avatar success")
                    setLoading(false)
                } catch (err) {
                    toast.error(err.response.data.msg)
                }
            })

          } 
        ) 
    }
    const handleChangeInput = e =>{
        const {name, value} = e.target
        if(change){
            setPassword({...password,[name]:value})
        }else{
            setProfile({...profile, [name]:value})
        }
    }
    const editProfile = async ()=>{
        setShow(false)
        setLoading(true)
        try {
            if(change){
                await axios.put('/user/changePassword',{...password},{
                    headers:{Authorization:token}
                })
                setCallback(!callback)
                toast.success("Change password success")
                setLoading(false)
            }else{
                await axios.put('/user/updateProfile',{...profile},{
                    headers:{Authorization:token}
                })
                setCallback(!callback)
                toast.success("Update profile success")
                setLoading(false)
            }
        }catch (err) {
            setLoading(false)
            toast.error(err.response.data.msg)
        }
    }
    return (
        <>
            {
                isLogged ?
                <>
                    <MegaMenu />
                    <h1 className='header_profile'>Trang c?? nh??n</h1>
                    <div className='profile_page'>
                         <div className='part_1'>
                            <img src={user.avatar} alt={user.name}/>
                            <input hidden="hidden" onChange={handlerImage} accept='.jpg,.png' id='file' type="file" />
                            <Tooltip title="Thay ?????i ???nh ?????i di???n" placement='right'>
                                 <i onClick={handlerChange} className="fa fa-camera" aria-hidden="true"></i>
                            </Tooltip>
                            <Button variant="primary" onClick={handleShow}>Ch???nh s???a th??ng tin</Button>
                         </div>
                         <div className='part_2'>
                            <div className='user_infor'>
                               <i className="fa fa-user" aria-hidden="true"></i><h4>T??n ????ng nh???p</h4>
                            </div>
                            <span>{user.name}</span>
                            <div className='user_infor'>
                               <i className="fa fa-envelope" aria-hidden="true"></i><h4>Email</h4>
                            </div>
                            <span>{user.email}</span>
                            <div className='user_infor'>
                               <i className="fa fa-calendar" aria-hidden="true"></i><h4>Ng??y tham gia</h4>
                            </div>
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            <Button variant="primary" onClick={()=>{setShow(true);setChange(true)}}>Thay ?????i m???t kh???u</Button>
                         </div>
                    </div>

                    <Modal className='edit_profile' show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                           <Modal.Title>
                               {
                                   !change ?
                                   <h4>Ch???nh s???a th??ng tin</h4>
                                   : <h4>Thay ?????i m???t kh???u</h4>
                               }
                           </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           {
                               !change ? 
                               <>
                                <div className="inputs">
                                    <input name='name' value={profile.name} onChange={handleChangeInput} type="text" required/>
                                    <label>T??n ????ng nh???p</label>
                                </div>
                                <div className="inputs">
                                    <input name='email' value={profile.email} onChange={handleChangeInput} type="text" required/>
                                    <label>Email</label>
                                </div>
                               </>
                               : 
                               <>
                                <div className="inputs">
                                    <input name='oldPassword' value={password.oldPassword} onChange={handleChangeInput} type="text" required/>
                                    <label>M???t kh???u c??</label>
                                </div>
                                <div className="inputs">
                                    <input name='newPassword' value={password.newPassword} onChange={handleChangeInput} type="text" required/>
                                    <label>M???t kh???u m???i</label>
                                </div>
                                <div className="inputs">
                                    <input name='confirmPassword' value={password.confirmPassword} onChange={handleChangeInput} type="text" required/>
                                    <label>X??c nh???n m???t kh???u</label>
                                </div>
                               </>
                           }
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Tho??t
                        </Button>
                        <Button variant="primary" onClick={editProfile} >
                            L??u
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    {
                        loading ? <Loading /> :<></> 
                    }
                </>
                : <Notfound />
            }
        </>
    );
}

export default Profile;
