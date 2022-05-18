import { useEffect,useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:8000")
toast.configure()
const UserAPI = (token) => {
    const [isLogged,setIsLogged] = useState(false)
    const [isAdmin,setIsAdmin] = useState(false)
    const [cart,setCart] = useState([])
    const [showDialog,setShowDialog] = useState(false)
    const [id,setId] = useState("")
    const [sizePrice,setSizePrice] = useState(0)
    const [size,setSize] = useState('Nhỏ')
    const [history,setHistory] = useState([])
    const [callback,setCallback] = useState(false)
    const [user,setUser] = useState([])
    const [allUser,setAllUser] = useState([])
    useEffect(()=>{
        if(token){
            const getUser = async ()=>{
                const res = await axios.get('/user/info',{
                    headers: {Authorization:token}
                })
                setUser(res.data.user)
                setIsLogged(true)
                res.data.user.role === 1 ? setIsAdmin(true) : setIsAdmin(false)
                setCart(res.data.user.cart)
            }
            getUser()
        }
    },[token,callback])
    useEffect(()=>{
        if(token && isAdmin){
            const getAllUsers = async()=>{
                const res = await axios.get('/user/getAllUser',{
                    headers: {Authorization:token}
                })
                const users = res.data.users.filter(user => user._id !== '62304b3e5e92797844ecb568')
                setAllUser(users)
            }
            getAllUsers()
        }
    },[token,callback,isAdmin])
    useEffect(()=>{
        if(token){
            const getHistory = async ()=>{
                if(isAdmin){
                    const res = await axios.get('/user/allHistory',{
                        headers: {Authorization:token}
                    })
                    setHistory(res.data.history)
                }else{
                    const res = await axios.get('/user/history',{
                        headers: {Authorization:token}
                    })
                    setHistory(res.data.history)
                } 
            }
            getHistory()
        }
    },[token,callback,isAdmin])
    
    const addCart = async (product)=>{
        if(!isLogged) {
            setShowDialog(true)
        }else{
            const check = cart.every(item =>{
                return item._id !== product._id
            })
            if(check){
                setCart([...cart,{...product,quantity:1,size:size,sizePrice:sizePrice}])
                await axios.patch('/user/addCart', {cart : [...cart,{...product,quantity:1,size:size, sizePrice: sizePrice}]},{
                    headers: {Authorization:token}
                })
                toast.success("Thêm vào giỏ hàng thành công")
            }else{
                toast.warn("Sản phẩm này đã được thêm vào giỏ hàng")
            }
        }
    }
    return {
        isLogged:[isLogged,setIsLogged],
        isAdmin:[isAdmin,setIsAdmin],
        addCart : addCart,
        showDialog : [showDialog,setShowDialog],
        id : [id,setId],
        cart : [cart,setCart],
        size : [size,setSize],
        sizePrice : [sizePrice,setSizePrice],
        history: [history,setHistory],
        callback: [callback,setCallback],
        user:[user,setUser],
        allUser:[allUser,setAllUser] 
    }
}

export default UserAPI;
