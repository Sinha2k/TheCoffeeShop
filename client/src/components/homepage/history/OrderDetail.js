import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import { useParams } from 'react-router';
import Notfound from '../utils/NotFound/NotFound';
import { Table } from 'react-bootstrap';
import paid from '../../header/image/paid.png'
import bake from '../../header/image/bake.png'
import bike from '../../header/image/bike.png'
import delivered from '../../header/image/delivered.png'
import styles from './order.module.css'
import MegaMenu from '../../header/MegaMenu';

const Orderdetail = () => {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [isLogged] = state.userAPI.isLogged
    const [orderDetail,setOrderDetail] = useState([])
    const params = useParams()
    useEffect(()=>{
        if(params.id){
            history.forEach(item=>{
                if(item._id === params.id) setOrderDetail(item)
            })
        }
    },[params.id,history])
    if(orderDetail.length === 0) return null;
    const statusClass = (index) => {
        if (index - orderDetail.status < 1) return styles.done;
        if (index - orderDetail.status === 1) return styles.inProgress;
        if (index - orderDetail.status > 1) return styles.unDone;
    };
    return (
        <>
        {
            isLogged ?
            <>
                <MegaMenu />
                <div className='order_history'>
                    <h1 style={{margin:"0px 0px 20px"}}>Chi tiết đơn hàng</h1>
                    {
                            orderDetail.method === 1 ?
                            <div className='order_delivery'>
                                <div className={statusClass(1)}>
                                    <img alt='' src={bake} />
                                    <span>Đang chuẩn bị</span>
                                </div>
                                <div className={statusClass(2)}>
                                    <img alt='' src={bike} />
                                    <span>Đang vận chuyển</span>
                                </div>
                                <div className={statusClass(3)}>
                                    <img alt='' src={delivered} />
                                    <span>Đã giao</span>
                                </div>
                                <div className={statusClass(4)} >
                                    <img alt='' src={paid} />
                                    <span>Đã thanh toán</span>
                                </div>
                            </div>
                            :
                            <div className='order_delivery'>
                                <div className={statusClass(0)} >
                                    <img alt='' src={paid} />
                                    <span>Đã thanh toán</span>
                                </div>
                                <div className={statusClass(1)}>
                                    <img alt='' src={bake} />
                                    <span>Đang chuẩn bị</span>
                                </div>
                                <div className={statusClass(2)}>
                                    <img alt='' src={bike} />
                                    <span>Đang vận chuyển</span>
                                </div>
                                <div className={statusClass(3)}>
                                    <img alt='' src={delivered} />
                                    <span>Đã giao</span>
                                </div>
                            </div>
                    }
                    <Table striped bordered hover className='table_history'>
                        <thead>
                            {
                                orderDetail.method === 1 ? 
                                <tr>
                                    <th>Tên</th>
                                    <th>Địa chỉ</th>  
                                    <th>Số điện thoại</th>
                                </tr>
                                : 
                                <tr>
                                    <th>Tên</th>
                                    <th>Địa chỉ</th>
                                    <th>Postal Code</th>
                                    <th>Country Code</th>
                                </tr>
                            }
                        </thead>
                        <tbody>
                            {
                                orderDetail.method === 1 ?
                                <tr>
                                    <td>{orderDetail.fullName}</td>
                                    <td>{orderDetail.address}</td>
                                    <td>{orderDetail.phoneNumber}</td>
                                </tr>
                                :
                                <tr>
                                    <td>{orderDetail.address.recipient_name}</td>
                                    <td>{orderDetail.address.line1} - {orderDetail.address.city}</td>
                                    <td>{orderDetail.address.postal_code}</td>
                                    <td>{orderDetail.address.country_code}</td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                    <h4>Đơn hàng</h4>
                    <div className='order_products'>
                        <Table striped bordered hover className='table_history'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Sản phẩm</th>
                                    <th>Kích cỡ</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                orderDetail.cart.map(item=>(
                                    <tr key={item._id}>
                                        <td><img src={item.images} alt='' /></td>
                                        <td className='row_order'>{item.title}</td>
                                        <td>{item.size}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}đ</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </>
            : <Notfound />
        }
        </>
    );
}

export default Orderdetail;
