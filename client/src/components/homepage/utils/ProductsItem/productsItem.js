import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../../detailProduct/Rating';
function ProductsItem({product,related}) {
    return (
        <div
         className={`${related ? 'related_card' : 'product_card'}`}>
           <Link to={`/detail/${product._id}`} >
            <div className='card_header'>
                {
                    product.sale === 1 && new Date().getTime()  - new Date(product.createdAt).getTime() > 1000*60*60*24*7 ? 
                    <div className='sale_area'><h6>Sale</h6></div>
                    : ""
                }
                {
                    new Date().getTime()  - new Date(product.createdAt).getTime() <= 1000*60*60*24*7
                    ? <div className='new_area'><h6>New</h6></div>
                    : ''
                }
                <img src={product.images} alt=""/>
            </div>
           </Link>
           <div className='card_body'>
               <Link to={`/detail/${product._id}`}><h3 title={product.title}>{product.title}</h3></Link>
               <Link to={`/detail/${product._id}`}><span>{product.price}đ</span></Link>
               <span className='review_product_item'><Rating value={product.ratings} text={`${product.numOfReviews} đánh giá`} /></span>
           </div>
        </div>
    )
}

export default ProductsItem;
