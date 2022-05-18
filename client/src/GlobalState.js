import React,{createContext,useState,useEffect} from "react";
import ProductsAPI from "./api/ProductsAPI";
import StoriesAPI from "./api/StoriesAPI";
import UserAPI from "./api/UserAPI";
import axios from 'axios'
import ChatAPI from "./api/ChatAPI";
export const GlobalState = createContext()

export const DataProvider = ({children})=>{
    const [token,setToken] = useState(false)
    useEffect(()=>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            const refreshToken = async ()=>{
                const res = await axios.get('/user/refresh_token')
                setToken(res.data.accesstoken)
                setTimeout(()=>{
                    refreshToken()
                },10 * 60 * 1000)
            }
            refreshToken()
        }
    },[])
    const state = {
        token : [token,setToken],
        productsAPI : ProductsAPI(),
        storiesAPI : StoriesAPI(),
        userAPI : UserAPI(token),
        chatAPI : ChatAPI(token)
    }
    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}