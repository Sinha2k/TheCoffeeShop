import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Loading from '../utils/Loading/Loading';
import Notfound from '../utils/NotFound/NotFound';
toast.configure()
const Login = () => {
    const state = useContext(GlobalState)
    const [loading,setLoading] = useState(false)
    const [isLogged] = state.userAPI.isLogged
    const [id] = state.userAPI.id
    const [user,setUser] = useState({
        email:'',password:''
    })
    const loginSubmit = async e =>{
        e.preventDefault()
        setLoading(true)
        try {
            await axios.post('/user/login',{...user})
            setLoading(false)
            localStorage.setItem('firstLogin',true)
            toast.success("Đăng nhập thành công")
            if(id !== ""){
                window.location.href = `/detail/${id}`
            }else{
                window.location.href = '/'
            }
        } catch (err) {
            toast.error(err.response.data.msg)
            setLoading(false)
        }
    }
    return (
        <>
        {isLogged ? <Notfound/> :
        <>
            {loading ? <Loading/> : <></>}
            <div className="login_register">
                <div className="form-structor">
                    <div id="signup_form" className="signup slide-up">
                        <Link to="/register"><h2 className="form-title" id="signup"><span>or</span>Sign up</h2></Link>
                        <div className="form-holder">
                            <input type="text" className="input" placeholder="Name" />
                            <input type="email" className="input" placeholder="Email" />
                            <input type="password" className="input" placeholder="Password" />
                        </div>
                        <button className="submit-btn">Sign up</button>
                    </div>
                    <form onSubmit={loginSubmit} id="login_form" className="login">
                        <div className="center">
                            <h2 className="form-title" id="login"><span>or</span>Log in</h2>
                            <div className="form-holder">
                                <input onChange={(e)=>setUser({...user,email:e.target.value})} value={user.email} type="email" className="input" placeholder="Email" required autoComplete='on' />
                                <input onChange={(e)=>setUser({...user,password:e.target.value})} value={user.password} type="password" className="input" placeholder="Password" />
                            </div>
                            <button className="submit-btn">Log in</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
        
        }
        </>
    );
}

export default Login;
