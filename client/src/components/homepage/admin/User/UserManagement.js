import React,{useContext} from 'react';
import {GlobalState} from '../../../../GlobalState'
import Notfound from '../../utils/NotFound/NotFound'
import MegaMenu from '../../../header/MegaMenu';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
const UserManagement = () => {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const [allUser] = state.userAPI.allUser
    const [token] = state.token
    const [callback,setCallback] = state.userAPI.callback
    const changeUser = async(id)=>{
        if(token){
            try {
                await axios.patch('/user/' + id + '/changeRole',{role : 0},{
                    headers:{Authorization:token}
                })
                setCallback(!callback)
            } catch (err) {
                console.log(err);
            }
        }
    }
    const changeAdmin = async(id)=>{
        if(token){
            try {
                await axios.patch('/user/' + id + '/changeRole',{role : 1},{
                    headers:{Authorization:token}
                })
                setCallback(!callback)
            } catch (err) {
                console.log(err);
            }
        }
    }
    const columns = [
        {field: 'id',headerName: 'Id',width:100},
        {field: 'name',headerName: 'Tên đăng nhập',width:300},
        {field: 'email',headerName: 'Email',width:300},
        {field: 'createAt',headerName: 'Ngày tạo',width:150},
        {field: 'isAdmin',headerName: 'isAdmin',width:100, renderCell:(user)=>{
            if(user.row.role === 1){
                return <i onClick={()=>changeUser(user.row._id)} style={{cursor:'pointer'}} className="fa fa-check"></i>
            }else{
                return <i onClick={()=>changeAdmin(user.row._id)} style={{cursor:'pointer'}} className="fa fa-times"></i>
            }
        }},
        {field: 'status',headerName: 'Status',width:130, renderCell:(user)=>{
            if(user.row.status){
                return <h1 style={{fontSize:"16px",color:"green"}}>Online</h1>
            }else{
                return <h1 style={{fontSize:"16px",color:"gray"}}>Offline {moment(user.row.lastLogin).fromNow()}</h1>
            }
        }}
    ]
    const rows = allUser.map((user,index)=>{
        return {
            id: index,
            name: user.name,
            email : user.email,
            createAt : new Date(user.createdAt).toLocaleDateString(),
            role:user.role,
            _id:user._id,
            lastLogin : user.lastLogin,
            status:user.status
        }
    })
    return (
        <>
            {
                isAdmin ?
                <>
                   <MegaMenu />
                   <div className='order_history'>
                        <h1>Quản lý người dùng</h1>
                        <h4>Bạn có {allUser.length} người dùng</h4>
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

export default UserManagement;
