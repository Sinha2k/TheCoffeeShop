import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import Notfound from '../utils/NotFound/NotFound';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MegaMenu from '../../header/MegaMenu';
const Orderhistory = () => {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [history] = state.userAPI.history
    return (
        <>
        {
            isLogged ? 
            <>
                <MegaMenu />
                <div className='order_history'>
                    <h1>Lịch sử mua hàng</h1>
                    <h4>Bạn có {history.length} đơn hàng</h4>
                    <Table striped bordered hover className='table_history'>
                        <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Ngày thanh toán</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                history.map(item =>{
                                    if(item.method !== 1){
                                        return <tr key={item._id}>
                                                <td>{item.paymentID}</td>
                                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                <td><Link to={`/history/${item._id}`}>Xem</Link></td>
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
                                    <th>Họ và tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
                                    <th>Ngày mua hàng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    history.map(item =>{
                                        if(item.method === 1){
                                            return <tr key={item._id}>
                                                        <td>{item.fullName}</td>
                                                        <td>{item.phoneNumber}</td>
                                                        <td>{item.address}</td>
                                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                        <td><Link to={`/history/${item._id}`}>Xem</Link></td>
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
        : <Notfound />
        }
        </>
    );
}

export default Orderhistory;
