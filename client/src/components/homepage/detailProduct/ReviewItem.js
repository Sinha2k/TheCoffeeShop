import React from 'react';
import Rating from './Rating';
import vip from '../../header/image/vip.png'
import moment from 'moment'
const Reviewitem = ({review}) => {
    return (
        <div className='review_card'>
            <img src={review.avatar} alt=''/>
            <div className='review_card_content'>
                <div className='review_title'>
                   <h5>{review.name}</h5>
                   {
                       review.user === "62304b3e5e92797844ecb568" ? <img src={vip} alt=""/> : ""
                   }
                </div>
                <Rating className="rating_card" value={review.rating} text="" />
                <span>{moment(review.createdAt).calendar()}</span>
                <h6>{review.comment.charAt(0).toUpperCase()+review.comment.slice(1)}</h6>
            </div>
        </div>
    );
}

export default Reviewitem;
