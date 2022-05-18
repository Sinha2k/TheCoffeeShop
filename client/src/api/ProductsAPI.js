import {useState,useEffect} from 'react';
import axios from 'axios'

function ProductsAPI (){
    const [products,setProducts] = useState([])
    const [allProducts,setAllProducts] = useState([])
    const [sort,setSort] = useState('')
    const [result,setResult] = useState([])
    const [callback,setCallback] = useState(false)
   
    useEffect(()=>{
        const getAllProducts = async ()=>{
            const res = await axios.get(`/products/allProducts`)
            res.data.products.forEach((product)=>{
                const current = new Date().getTime()
                const start = new Date(product.startSale).getTime()
                const end = new Date(product.endSale).getTime()
                if(current >= start && current <= end){
                    product.sale = 1
                }
                else{
                    product.sale = 0
                }
            })
            setAllProducts(res.data.products)
        }
        getAllProducts()
    },[callback])

    useEffect(()=>{
        const getProducts = async ()=>{
            const res = await axios.get(`/products?${sort}`)
            res.data.products.forEach((product)=>{
                const current = new Date().getTime()
                const start = new Date(product.startSale).getTime()
                const end = new Date(product.endSale).getTime()
                if(current >= start && current <= end){
                    product.sale = 1
                }
                else{
                    product.sale = 0
                }
            })
            setProducts(res.data.products)
            setResult(res.data.result)
        }
        getProducts()
    },[sort,callback])

    return {
        allProducts: [allProducts,setAllProducts],
        products: [products,setProducts],
        sort:[sort,setSort],
        result:[result,setResult],
        callback:[callback,setCallback]
    }
}

export default ProductsAPI;
