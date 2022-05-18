import React, { useContext ,useState,useEffect} from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios'
import PaypalButton from './PaypalButton'
import Notfound from '../utils/NotFound/NotFound';
import { toast } from 'react-toastify';
import MegaMenu from '../../header/MegaMenu';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const initialState = {
    fullName:'',
    address:'',
    phoneNumber:'',
    cart:[],
    method:1
}
const Cart = () => {
    const [total,setTotal] = useState(0)
    const [checkout,setCheckout] = useState(false)
    const state = useContext(GlobalState)
    const [fix,setFix] = useState(false)
    const [open, setOpen] = useState(false);
    const [openDialog,setOpenDialog] = useState(false)
    const [cart,setCart] = state.userAPI.cart
    const [order,setOrder] = useState(initialState)
    const [token] = state.token
    const [isLogged] = state.userAPI.isLogged
    const [callback,setCallback] = state.userAPI.callback
    const currency = "USD"
    useEffect(()=>{
        const getTotal = ()=>{
           const total = cart.reduce((prev,item)=>{
               if(item.sale === 1){
                   return prev + ((item.priceSale + (item.sizePrice * 10000)) * item.quantity)
               }else{
                   return prev + ((item.price + (item.sizePrice * 10000)) * item.quantity)
               }
           },0)
           setTotal(total)
        }
        getTotal()
    },[cart])
    const addToCart = async (cart)=>{
        await axios.patch('/user/addCart',{cart},{
            headers:{Authorization:token}
        })
    }
    const increment = (id)=>{
        cart.forEach(item=>{
            if(item._id === id){
                item.quantity += 1
            }
            setCart([...cart])
            addToCart(cart)
        })
    }
    const decrement = (id)=>{
        cart.forEach(item=>{
            if(item._id === id){
                if(item.quantity > 1){
                    item.quantity -= 1
                }    
            }
            setCart([...cart])
            addToCart(cart)
        })
    }
    const removeProduct = (id)=>{
        if(window.confirm("Bạn có thực sự muốn xóa sản phẩm này ???")){
            cart.forEach((item,index)=>{
                if(item._id === id){
                    cart.splice(index,1)
                }
            })
            setCart([...cart])
            addToCart(cart)
        }
    }
    const tranSuccess = async (payment)=>{
        const {paymentID,address} = payment
        await axios.post('/payments',{cart,paymentID,address},{
            headers:{Authorization:token}
        })
        setCart([])
        addToCart([])
        setCallback(!callback)
        toast.success("Thanh toán thành công!!! Đơn hàng sẽ được xử lý sau vài ngày ^^")
    }
    if(cart.length === 0) return <>
        <MegaMenu />
        <div className='cart_empty'><h2>Cart Empty</h2></div> 
    </>
    const setFixed = ()=>{
        if(window.scrollY > 110){
            setFix(true)
        }else{
            setFix(false)
        }
    }
    window.addEventListener('scroll',setFixed)
    const handleClose = () => {
        setOpen(false);
    };
    const handlerChangeInput = (e)=>{
        const {name, value} = e.target
        setOrder({...order, [name]:value})
    }
    const cashOnDelivery = async ()=>{
        const {fullName,address,phoneNumber,method} = order
        if(fullName && address && phoneNumber && method){
            await axios.post('/payments',{cart,fullName,address,phoneNumber,method},{
                headers:{Authorization:token}
            })
            setOpen(false)
            setOrder(initialState)
            setCart([])
            addToCart([])
            setCallback(!callback)
            toast.success("Thanh toán thành công!!! Đơn hàng sẽ được xử lý sau vài ngày ^^")
        }
    }
    const closeDialog = ()=>{
        setOpenDialog(false)
    }
    return (
        <>
        { isLogged ? <>
           <MegaMenu />
           <div className='cart_page'>
                <div className='card_header'><h1>Giỏ hàng</h1></div>
                <div className=" cart_body">
                    <div className='cart_list'>
                        {
                            cart.map(product=>{
                                return (
                                    <div className='product_cart_card' key={product._id}>
                                        <img src={product.images} alt={product.title}/>
                                        <div className='product_cart_content'>
                                            <h4>Sản phẩm: <span>{product.title}</span></h4>
                                            <h4>Id: <span>{product.product_id}</span></h4>
                                            <h4>Đã bán: <span>{product.sold}</span></h4>
                                            <h4>Size: <span>{product.size}</span></h4>
                                        </div>
                                        <div className='price_quantity'>
                                            <div className='control'>
                                                <button onClick={()=> increment(product._id)}>+</button>
                                                <h4>{product.quantity}</h4>
                                                <button onClick={()=> decrement(product._id)}>-</button>
                                            </div>
                                            <p>{ product.sale ===1 ? product.priceSale * product.quantity : product.price * product.quantity}đ</p>
                                        </div>
                                        <button className='remove' onClick={()=> removeProduct(product._id)}>x</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={fix ? 'cart_total fixed' : 'cart_total'}>
                        <h2>Hoá đơn</h2>
                        <div className='row_items'>
                            <p>Tổng</p>
                            <p>{total}đ</p>
                        </div>
                        <div className='row_items'>
                            <p>Tiền ship</p>
                            <p>0đ</p>
                        </div>
                        <div className='row_items'>
                            <p>Giảm giá</p>
                            <p>-0đ</p>
                        </div>
                        <div className='row_items'>
                            <h3>Thành tiền</h3>
                            <h3>{total}đ</h3>
                        </div>
                        {
                            checkout ? 
                            <>
                                <button onClick={()=>setOpen(true)} style={{background:'#Fbf03c',color:'black'}}>Thanh toán sau khi nhận hàng</button>
                                <span style={{fontStyle:'italic',color:'gray',marginBottom:'-10px',marginTop:'-15px'}}>hoặc</span>
                                <PaypalButton 
                                    total={total}
                                    tranSuccess = {tranSuccess}
                                    currency={currency}
                                />
                            </>
                            : <button onClick={()=>setCheckout(true)}>Thanh toán</button>
                        }
                    </div>
                    <div className='cart_total_responsive'>
                        <h4>Tổng số tiền: <span>{total}đ</span></h4>
                        <button onClick={()=>setOpenDialog(true)}>Mua hàng</button>
                    </div>
                </div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle style={{fontSize:'30px'}}>Bạn sẽ trả {total}đ sau khi nhận hàng</DialogTitle>
                    <DialogContent>
                        <TextField required onChange={handlerChangeInput} name='fullName' value={order.fullName} style={{marginTop:'1rem',width:'100%'}} id="outlined-basic" label="Họ và tên" variant="outlined" />
                        <TextField required onChange={handlerChangeInput} name='phoneNumber' value={order.phoneNumber} style={{marginTop:'2rem',width:'100%'}} id="outlined-basic" label="Số điện thoại" variant="outlined" />
                        <TextField required onChange={handlerChangeInput} name='address' value={order.address} style={{marginTop:'2rem',width:'100%'}} id="outlined-basic" label="Địa chỉ" variant="outlined" />
                    </DialogContent>
                    <DialogActions style={{display:'flex',justifyContent:'center',marginBottom:'1rem'}}>
                        <Button onClick={cashOnDelivery} variant="contained">Xác nhận</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={closeDialog}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle style={{fontSize:'16px'}}>Lựa chọn hình thức thanh toán</DialogTitle>
                    <DialogContent style={{display:'flex',flexDirection:'column'}}>
                        <button onClick={()=>{setOpenDialog(false);setOpen(true)}} style={{background:'#Fbf03c',color:'black',outline:'none',border:'none',paddingTop:'7px',paddingBottom:'7px',borderRadius:'3px'}}>Thanh toán sau khi nhận hàng</button>
                        <span style={{fontStyle:'italic',color:'gray',marginBottom:'15px',marginTop:'15px',width:'100%',textAlign:'center'}}>hoặc</span>
                        <PaypalButton 
                            total={total}
                            tranSuccess = {tranSuccess}
                            currency={currency}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </>
        : <Notfound/> }
        </>
    );
}

export default Cart;
