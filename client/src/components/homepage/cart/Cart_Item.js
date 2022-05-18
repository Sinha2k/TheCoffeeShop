import React from 'react';

const CartItem = ({product}) => {
    return (
        <div className='cart_item'>
            <img src={product.images} alt=''/>
            <div className='cart_item_content'>
                <h3>{product.title}</h3>
                <span>{product.price}</span>
            </div>
            <h4>x{product.quantity}</h4>
        </div>
    );
}

export default CartItem;
