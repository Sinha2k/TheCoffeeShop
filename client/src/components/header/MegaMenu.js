import React,{useState,useContext,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';
import axios from 'axios';
import Dialog from '../homepage/utils/Dialog/Dialog';
import CartItem from '../homepage/cart/Cart_Item';
import { toast } from 'react-toastify';
import menu from './image/menu.jpg'
import stories from './image/stories.jpg'
import ChatBox from '../homepage/utils/ChatBox/ChatBox';
import io from 'socket.io-client'
import Tooltip from '@mui/material/Tooltip';
toast.configure()
const socket = io.connect("http://localhost:8000")
const MegaMenu = () => {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [chat] = state.chatAPI.chat
    const [cart] = state.userAPI.cart
    const [user] = state.userAPI.user
    const [total,setTotal] = useState(0)
    const [open,setOpen] = useState(false)
    const [show,setShow] = useState(false)
    const [active,setActive] = useState(false)
    const [active_1,setActive_1] = useState(false)
    const [title,setTitle] = useState('')
    const [appear,setAppear] = useState(false)
    const [inbox,setInbox] = useState(false)
    const [isLogged,setIsLogged] = state.userAPI.isLogged
    const [isAdmin,setIsAdmin] = state.userAPI.isAdmin
    const logoutUser = async ()=>{
        await axios.get('/user/logout')
        setShow(false)
        localStorage.clear()
        setIsLogged(false)
        setIsAdmin(false)
        toast.success("Đăng xuất thành công")
        window.location.href='/'
    }
    const logout = ()=>{
        setAppear(true)
    }
    const cancel = ()=>{
        setAppear(false)
    }
    const inboxAdmin = async ()=>{
        socket.emit("setup",user)
        setInbox(true)
        try {
            await axios.post('/chat',{userId:"62304b3e5e92797844ecb568"},{
                headers: {Authorization:token}
            })
            socket.emit("join room",chat[0]._id)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(()=>{
        const getTotal = ()=>{
           const total = cart.reduce((prev,item)=>{
               return prev + (item.price * item.quantity)
           },0)
           setTotal(total)
        }
        getTotal()
    },[cart])
    return (
        <>
            <div className="header_top">
                <div className="map_market">
                    <i className="fa fa-map-marker" aria-hidden="true"></i> 
                    <span>146 Cửa hàng khắp cả nước</span>
                </div>
                <div className="map_market">
                    <i className="fa fa-phone" aria-hidden="true"></i>
                    <span>Đặt hàng: 1800.6936</span>
                </div>
                <div className="map_market">
                    <i className="fa fa-truck" aria-hidden="true"></i>
                    <span>Freeship từ 50.000VNĐ</span>
                </div>
            </div>
            <header className="mega_menu">
              <div className="container_megamenu">
                <div className="row_megamenu v-center">
                    <div className="header-item item-left">
                        <div className="logo">
                            <a href="/">The Coffee Shop</a>
                        </div>
                    </div>
                    <div className="header-item item-center">
                        <div className={`menu-overlay ${show ? "active" : ''}`}>
                        </div>
                        <nav className={`menu_mega ${show ? "active" : ''}`}>
                            <div className="mobile-menu-head">
                                <div onClick={()=>{setActive(false);setActive_1(false);setTitle('')}} className="go-back"><i className="fa fa-angle-left"></i></div>
                                <div className="current-menu-title">{title}</div>
                                <div onClick={()=>setShow(false)} className="mobile-menu-close">&times;</div>
                            </div>
                            <ul className="menu-main">
                                <li>
                                    <a href="/ca-phe-tai-nha">Cà phê</a>
                                </li>
                                <li className="menu-item-has-children">
                                    <a href="/tra-tai-nha">Trà</a>
                                </li>
                                <li className="menu-item-has-children">
                                    <div className='item_list'>
                                            <a href="/products">Thực đơn</a>
                                            <i onClick={()=>{setActive(true);setTitle("Menu")}} className="fa fa-angle-down"></i>
                                    </div>
                                    <div className={`sub-menu mega-menu mega-menu-column-4 ${active ? "active" : ""}`}>
                                        <div className="list-item">
                                            <h4 className="title">Tất cả</h4>
                                        </div>
                                        <div className="list-item">
                                            <h4 className="title">Cà phê</h4>
                                            <ul>
                                                <li><a href="/products">Cà phê Việt Nam</a></li>
                                                <li><a href="/products">Cà phê máy</a></li>
                                                <li><a href="/products">Cold Brew</a></li>
                                            </ul>
                                        
                                        </div>
                                        <div className="list-item">
                                            <h4 className="title">Trà</h4>
                                            <ul>
                                                <li><a href="/products">Trà trái cây</a></li>
                                                <li><a href="/products">Trà sữa Macchiato</a></li>
                                            </ul>
                                        </div>
                                        
                                        <div className="list-item">
                                            <img src={menu} alt="shop"/>
                                        </div>
                                    </div>
                                </li>
                                <li className="menu-item-has-children">
                                    <div className='item_list'>
                                        <a href="/stories">Chuyện nhà</a>
                                        <i onClick={()=>{setActive_1(true);setTitle("Story")}} className="fa fa-angle-down"></i>
                                    </div>
                                    <div className={`sub-menu mega-menu mega-menu-column-4 ${active_1 ? "active" : ""}`}>
                                        <div className="list-item">
                                            <h4 className="title">Coffeeholic</h4>
                                            <ul>
                                                <li><a href="/stories">#chuyencaphe</a></li>
                                                <li><a href="/stories">#phacaphe</a></li>
                                            </ul>
                                        
                                        </div>
                                        <div className="list-item">
                                            <h4 className="title">Teaholic</h4>
                                            <ul>
                                                <li><a href="/stories">#cauchuyenvetra</a></li>
                                                <li><a href="/stories">#phatra</a></li>
                                            </ul>
                                        </div>
                                        <div className="list-item">
                                            <h4 className="title">Blog</h4>
                                            <ul>
                                                <li><a href="/stories">#inthemood</a></li>
                                                <li><a href="/stories">#review</a></li>
                                            </ul>
                                        </div>
                                        <div className="list-item">
                                            <img src={stories} alt="shop"/>
                                        </div>
                                    </div>
                                </li>
                               
                                <li>
                                    <a href="/">Liên hệ</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="header-item item-right">
                        {
                            isAdmin ? <a href="/chat"><i className="fa fa-comment" aria-hidden="true"></i></a> : ""
                        }
                        {
                            isLogged ? 
                            <>
                            <div className='cart'>
                                <Link to='/cart'>
                                    <i className="fa fa-shopping-cart"  aria-hidden="true"></i>
                                    <span className='cart_length'>{cart.length}</span>
                                </Link>   
                                <div className="cart_modal">
                                    {
                                        cart.length === 0 ? <h5>Cart Empty</h5> : 
                                        <>
                                        <h5>Your Cart</h5>
                                        <div className='cart_modal_body'>
                                        {
                                            cart.map(product=>{
                                                return <CartItem key={product._id} product={product} />
                                            })
                                        }
                                        </div>
                                        <h6>Total : {total}đ</h6>
                                        </>
                                    }
                                </div>
                            </div>
                            <img onClick={()=>setOpen(!open)} src={user.avatar} alt=""/>
                            </>
                            : <Tooltip title='Đăng nhập' placement='left'><Link to='/login'><i className="fa fa-user-circle-o" aria-hidden="true"></i></Link></Tooltip>
                        }
                        <div onClick={()=> setShow(!show)} className="mobile-menu-trigger">
                            <span></span>
                        </div>
                    </div>
                    <div onClick={()=> setOpen(false)} className={`dropdown_modal ${open ? 'open' : ''}`}>
                        <div className='dropdown_item'><Link to='/profile'>Trang cá nhân</Link></div>
                        <div className='dropdown_item'><Link to='/history'>Lịch sử mua hàng</Link></div>
                        {isAdmin ?
                            <>
                                <div className='dropdown_item'><Link to="/user_management">Quản lý người dùng</Link></div>
                                <div className='dropdown_item'><Link to="/products_management">Quản lý sản phẩm</Link></div>
                                <div className='dropdown_item'><Link to="/story_management">Quản lý bài viết</Link></div>
                                <div className='dropdown_item'><Link to="/order_management">Quản lý đơn hàng</Link></div>
                            </>
                            : <> </>
                        }
                        <div onClick={logout}  className='dropdown_item'>Đăng xuất</div>
                    </div>
                    <Dialog content={"Từ từ đã !!!"} description={"Bạn thực sự muốn đăng xuất ?"} show={appear} cancel={cancel} confirm={logoutUser} />
                </div>
            </div>
        </header>
       {
            isLogged && !isAdmin ? <>
                {inbox ? <ChatBox setInbox={setInbox} /> : ""}
                <div onClick={inboxAdmin} className='messenger'><i className="fa fa-comments" aria-hidden="true"></i></div>
           </>
           : ""
       }
    </>
    );
}

export default MegaMenu;
