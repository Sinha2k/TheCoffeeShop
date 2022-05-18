import React, { useContext } from 'react';
import { GlobalState } from '../../../../GlobalState';
import Notfound from '../../utils/NotFound/NotFound';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import MegaMenu from '../../../header/MegaMenu';
const Ordermanage = () => {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [isAdmin] = state.userAPI.isAdmin
    const [history,setHistory] = state.userAPI.history
    const status = ["Đã thanh toán","Đang chuẩn bị","Đang vận chuyển","Đã giao"]
    const statusOrder = ["Đang chuẩn bị","Đang vận chuyển","Đã giao","Đang thanh toán","Đã thanh toán"]
    const changeStatus = async (id)=>{
        const item = history.filter((order)=> order._id === id)[0]
        const currentStatus = item.status
        try {
            if(item.method === 1){
                if(currentStatus+1 <5)
                {
                    const res = await axios.put('/user/history/'+id,{status: currentStatus+1},{
                        headers:{Authorization:token}
                    }) 
                    setHistory(res.data.payments)       
                }  
            }else{
                if(currentStatus+1 <4)
                {
                    const res = await axios.put('/user/history/'+id,{status: currentStatus+1},{
                        headers:{Authorization:token}
                    }) 
                    setHistory(res.data.payments)       
                }  
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
        {
            isAdmin ?
            <>
                    <MegaMenu />
                    <div className='order_history'>
                        <h1>Quản lý đơn hàng</h1>
                        <h4>Bạn có {history.length} đơn hàng</h4>
                        <Table striped bordered hover className='table_history'>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Tên</th>
                                    <th>Địa chỉ</th>
                                    <th>Ngày thanh toán</th>
                                    <th>Trạng thái</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    history.map(item =>{
                                        if(item.method !== 1){
                                            return <tr key={item._id}>
                                                        <td>{item.email}</td>
                                                        <td>{item.address.recipient_name}</td>
                                                        <td>{item.address.line1} - {item.address.city}</td>
                                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                        <td>{status[item.status]}</td>
                                                        <td><button onClick={()=> changeStatus(item._id)}>Cập nhật</button></td>
                                                    </tr>
                                        }
                                        return null
                                    })
                                }
                            </tbody>
                        </Table>
                        {
                            history.every(order => order.method !== 1) ? ''
                            :
                            <>
                                <h4>Đơn hàng chưa thanh toán</h4>
                                <Table striped bordered hover className='table_history'>
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Họ và tên</th>
                                            <th>Số điện thoại</th>
                                            <th>Địa chỉ</th>
                                            <th>Ngày mua hàng</th>
                                            <th>Trạng thái</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            history.map(item =>{
                                                if(item.method === 1){
                                                    return <tr key={item._id}>
                                                                <td>{item.email}</td>
                                                                <td>{item.fullName}</td>
                                                                <td>{item.phoneNumber}</td>
                                                                <td>{item.address}</td>
                                                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                                <td>{statusOrder[item.status]}</td>
                                                                <td><button onClick={()=> changeStatus(item._id)}>Cập nhật</button></td>
                                                            </tr>
                                                }
                                                return null
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </>
                        }
                    </div>
            </>
            : <Notfound/>
        }
        </>
    );
}

export default Ordermanage;
