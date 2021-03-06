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
        if(window.confirm("B???n c?? th???c s??? mu???n x??a s???n ph???m n??y ???")){
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
        toast.success("Thanh to??n th??nh c??ng!!! ????n h??ng s??? ???????c x??? l?? sau v??i ng??y ^^")
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
            toast.success("Thanh to??n th??nh c??ng!!! ????n h??ng s??? ???????c x??? l?? sau v??i ng??y ^^")
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
                <div className='card_header'><h1>Gi??? h??ng</h1></div>
                <div className=" cart_body">
                    <div className='cart_list'>
                        {
                            cart.map(product=>{
                                return (
                                    <div className='product_cart_card' key={product._id}>
                                        <img src={product.images} alt={product.title}/>
                                        <div className='product_cart_content'>
                                            <h4>S???n ph???m: <span>{product.title}</span></h4>
                                            <h4>Id: <span>{product.product_id}</span></h4>
                                            <h4>???? b??n: <span>{product.sold}</span></h4>
                                            <h4>Size: <span>{product.size}</span></h4>
                                        </div>
                                        <div className='price_quantity'>
                                            <div className='control'>
                                                <button onClick={()=> increment(product._id)}>+</button>
                                                <h4>{product.quantity}</h4>
                                                <button onClick={()=> decrement(product._id)}>-</button>
                                            </div>
                                            <p>{ product.sale ===1 ? product.priceSale * product.quantity : product.price * product.quantity}??</p>
                                        </div>
                                        <button className='remove' onClick={()=> removeProduct(product._id)}>x</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={fix ? 'cart_total fixed' : 'cart_total'}>
                        <h2>Ho?? ????n</h2>
                        <div className='row_items'>
                            <p>T???ng</p>
                            <p>{total}??</p>
                        </div>
                        <div className='row_items'>
                            <p>Ti???n ship</p>
                            <p>0??</p>
                        </div>
                        <div className='row_items'>
                            <p>Gi???m gi??</p>
                            <p>-0??</p>
                        </div>
                        <div className='row_items'>
                            <h3>Th??nh ti???n</h3>
                            <h3>{total}??</h3>
                        </div>
                        {
                            checkout ? 
                            <>
                                <button onClick={()=>setOpen(true)} style={{background:'#Fbf03c',color:'black'}}>Thanh to??n sau khi nh???n h??ng</button>
                                <span style={{fontStyle:'italic',color:'gray',marginBottom:'-10px',marginTop:'-15px'}}>ho???c</span>
                                <PaypalButton 
                                    total={total}
                                    tranSuccess = {tranSuccess}
                                    currency={currency}
                                />
                            </>
                            : <button onClick={()=>setCheckout(true)}>Thanh to??n</button>
                        }
                    </div>
                    <div className='cart_total_responsive'>
                        <h4>T???ng s??? ti???n: <span>{total}??</span></h4>
                        <button onClick={()=>setOpenDialog(true)}>Mua h??ng</button>
                    </div>
                </div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle style={{fontSize:'30px'}}>B???n s??? tr??? {total}?? sau khi nh???n h??ng</DialogTitle>
                    <DialogContent>
                        <TextField required onChange={handlerChangeInput} name='fullName' value={order.fullName} style={{marginTop:'1rem',width:'100%'}} id="outlined-basic" label="H??? v?? t??n" variant="outlined" />
                        <TextField required onChange={handlerChangeInput} name='phoneNumber' value={order.phoneNumber} style={{marginTop:'2rem',width:'100%'}} id="outlined-basic" label="S??? ??i???n tho???i" variant="outlined" />
                        <TextField required onChange={handlerChangeInput} name='address' value={order.address} style={{marginTop:'2rem',width:'100%'}} id="outlined-basic" label="?????a ch???" variant="outlined" />
                    </DialogContent>
                    <DialogActions style={{display:'flex',justifyContent:'center',marginBottom:'1rem'}}>
                        <Button onClick={cashOnDelivery} variant="contained">X??c nh???n</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={closeDialog}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle style={{fontSize:'16px'}}>L???a ch???n h??nh th???c thanh to??n</DialogTitle>
                    <DialogContent style={{display:'flex',flexDirection:'column'}}>
                        <button onClick={()=>{setOpenDialog(false);setOpen(true)}} style={{background:'#Fbf03c',color:'black',outline:'none',border:'none',paddingTop:'7px',paddingBottom:'7px',borderRadius:'3px'}}>Thanh to??n sau khi nh???n h??ng</button>
                        <span style={{fontStyle:'italic',color:'gray',marginBottom:'15px',marginTop:'15px',width:'100%',textAlign:'center'}}>ho???c</span>
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
