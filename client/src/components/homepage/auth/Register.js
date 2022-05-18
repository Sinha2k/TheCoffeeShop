import React from 'react';
import { Link } from 'react-router-dom';
import { useState,useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Notfound from '../utils/NotFound/NotFound';
toast.configure()
const Register = () => {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [user,setUser] = useState({
        name:'',email:'',password:''
    })
    const registerSubmit = async e =>{
        e.preventDefault()
        try {
            await axios.post('/user/register',{...user})
            localStorage.setItem('firstLogin',true)
            toast.success("Đăng ký tài khoản thành công")
            window.location.href = "/"
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }
    return (
        <>
        {isLogged ? <Notfound /> :
        <div className="login_register">
            <div className="form-structor">
                <form onSubmit={registerSubmit} id="signup_form" className="signup">
                    <h2 className="form-title" id="signup"><span>or</span>Sign up</h2>
                    <div className="form-holder">
                        <input onChange={(e)=>setUser({...user,name:e.target.value})}  type="text" className="input" placeholder="Name" required autoComplete='on' />
                        <input onChange={(e)=>setUser({...user,email:e.target.value})}  type="email" className="input" placeholder="Email" required autoComplete='on' />
                        <input onChange={(e)=>setUser({...user,password:e.target.value})}  type="password" className="input" placeholder="Password" required autoComplete='on' />
                    </div>
                    <button className="submit-btn">Sign up</button>
                </form>
                <div id="login_form" className="login slide-up">
                    <div className="center">
                        <Link to="/login"><h2 className="form-title" id="login"><span>or</span>Log in</h2></Link>
                        <div className="form-holder">
                            <input type="email" className="input" placeholder="Email" />
                            <input type="password" className="input" placeholder="Password" />
                        </div>
                        <button className="submit-btn">Log in</button>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    );
}

export default Register;
