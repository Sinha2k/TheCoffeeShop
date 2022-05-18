import React from 'react';
import { useState,useContext } from 'react';
import { GlobalState } from '../../../../GlobalState';
function Filter({option,setOption}){
    const [toggle, setToggle] = useState(false);
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    return (
        <div className={`filter ${toggle ? 'show':''}`}>
           <ul className={`dropdown_filter ${toggle ? 'show':''} `} onClick={()=>setToggle(!toggle)} >
               <input type="text" value={option} readOnly id='in_put'/>
               <i className="fa fa-chevron-down" aria-hidden="true"></i>
               <ul className='options' id='op_tion'>
               {
                   products.every(product => product.sale === 0) ? "" : 
                   <li onClick={()=>setOption("Đang sale")}>Đang sale</li>
               }
                   <li onClick={()=>setOption("Mới nhất")}>Mới nhất</li>
                   <li onClick={()=>setOption("Mua nhiều nhất")}>Mua nhiều nhất</li>
                   <li onClick={()=>setOption("Xếp hạng")}>Xếp hạng</li>
                   <li onClick={()=>setOption("Đắt nhất")}>Đắt nhất</li>
                   <li onClick={()=>setOption("Rẻ nhất")}>Rẻ nhất</li>
               </ul>
           </ul>
        </div>
    );
}

export default Filter;
