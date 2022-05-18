import React,{useContext} from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductsItem from '../utils/ProductsItem/productsItem'
import Loading from '../utils/Loading/Loading';
const Tra = () => {
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    return (
        <div>
            <h1 style={{paddingTop:'2rem',paddingLeft:'5rem',marginBottom:'-1rem',fontSize:'26px'}}>Trà tại nhà</h1>
            {products.length === 0 && <Loading/>}
            <div className='products'>
                {
                    products.map(product=>{
                        return product.category === 'Trà tại nhà' ? <ProductsItem key={product._id} product={product}/> : null
                    })
                }
            </div>
        </div>
    );
}

export default Tra;
