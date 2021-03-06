import React,{useContext,useState,useEffect} from 'react';
import { useParams} from 'react-router-dom';
import {GlobalState} from '../../../GlobalState'
import Dialog from '../utils/Dialog/Dialog';
import ProductsItem from '../utils/ProductsItem/productsItem';
import { useNavigate } from 'react-router-dom';
import Rating from './Rating';
import {Modal,Button} from 'react-bootstrap'
import Reviewitem from './ReviewItem';
import { toast } from 'react-toastify';
import axios from 'axios';
const Detailproduct = () => {
    const navigate = useNavigate()
    const params = useParams()
    const state = useContext(GlobalState)
    const [allProducts] = state.productsAPI.allProducts
    const [sizePrice,setSizePrice] = state.userAPI.sizePrice
    const [size,setSize] = state.userAPI.size
    const [user] = state.userAPI.user
    const [detailProduct,setDetailProduct] = useState([])
    const addCart = state.userAPI.addCart
    const [showDialog,setShowDialog] = state.userAPI.showDialog
    const [id,setId] = state.userAPI.id
    const [token] = state.token
    const [callback,setCallback] = state.productsAPI.callback
    const [rating,setRating] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [review,setReview] = useState({
        name:'',
        avatar:'',
        rating:0,
        comment :''
    })
    const stars = Array(5).fill(0)
    const handleShow = () => setShowModal(true);
    const toLogin = ()=>{
        navigate("/login")
        setId(params.id)
        console.log(id)
    }
    const cancel = ()=>{
        setShowDialog(false)
    }
    const handlerOnchange = (e)=>{
        setReview({...review,comment:e.target.value})
    }
    const createReview = async () => {
        setShowModal(false)
        review.name = user.name
        review.avatar = user.avatar
        review.rating = rating
        try {
            await axios.post('/products/'+params.id+'/createReview',{...review},{
                headers:{Authorization:token}
            })
            setCallback(!callback)
            toast.success("????nh gi?? th??nh c??ng")
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }
    useEffect(()=>{
        if(params){
            allProducts.forEach(product=>{
                if(product._id===params.id){
                    setDetailProduct(product);
                } 
            })
        }
        if(size === "Nh???") setSizePrice(0)
        else if(size === "V???a") setSizePrice(1)
        else if(size === "L???n") setSizePrice(2)
    },[params,allProducts,size,setSizePrice])
    if(detailProduct.length===0) return null;
    return (
        <>
        <div className='detail_product'>
            <h4>Menu  /  {detailProduct.category} / {detailProduct.title}</h4>
            <div className='detail_body'>
                <img src={detailProduct.images} alt="" />
                <div className='detail_content'>
                    <h3>{detailProduct.title}</h3>
                        {
                            detailProduct.sale === 1 ? 
                            <div className='price_sale'>
                              <h2>{detailProduct.price}??</h2> 
                              <h2>{detailProduct.priceSale + (sizePrice * 10000)}??</h2> 
                            </div>
                            : <h2>{detailProduct.price + (sizePrice * 10000)}??</h2>
                        }
                    <h5>K??ch th?????c</h5>
                    <div className='size'>
                    {
                        detailProduct.size.map(sizeProduct=>{
                            return <button className={`${size === sizeProduct ?'active':''}`} onClick={()=>{
                               setSize(sizeProduct)
                            }} key={detailProduct.size.indexOf(sizeProduct)}><span>{sizeProduct}</span></button>
                        })
                    }
                    </div>
                    <h5>???? b??n : {detailProduct.sold}</h5>
                    <h5>X???p h???ng</h5>
                    <div className='rating_row'>
                        <Rating value={detailProduct.ratings} text={`${detailProduct.numOfReviews} ????nh gi??`}/>
                        {
                            user.productsList && user.productsList.includes(detailProduct._id) ? <button onClick={handleShow}>????nh gi??</button> : ""
                        }
                    </div>  
                    <h5>Th??ng tin</h5>
                    <span className='infor_products'>{detailProduct.description}</span>
                    <button onClick={()=>addCart(detailProduct)} className='order'><i className="fa fa-cart-plus" aria-hidden="true"></i><span>Th??m v??o gi??? h??ng</span></button>
                    <Modal show={showModal} onHide={()=>setShowModal(false)}>
                        <Modal.Header closeButton>
                           <Modal.Title>B???n th???y s???n ph???m n??y th??? n??o?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='review_body'>
                            <div className='star_bar'>
                            {
                                stars.map((star,i)=>{
                                    const ratingValue = i+1
                                    return (
                                        <label className='star' key={i}>
                                            <input value={ratingValue} onClick={()=>setRating(ratingValue)} hidden="hidden" type="radio" name='rating' />
                                            <i className={`fa fa-star ${ratingValue <= rating ? 'orange' : 'gray'}`}></i>
                                        </label>
                                    );
                                })
                            }
                            </div>
                            <textarea name="comment" onChange={handlerOnchange} placeholder='H??y vi???t c???m nh???n c???a b???n t???i ????y...' rows={10} cols={56}></textarea>
                        </Modal.Body>
                        <Modal.Footer className='review_button'>
                            <Button variant="primary" onClick={createReview}>
                                G???i
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <h3 className='lien_quan'>????nh gi?? s???n ph???m</h3>
            <div className='review_list'>
                {
                    detailProduct.reviews.length === 0 ? <h5 className='no_review'>{`(Kh??ng c?? ????nh gi?? n??o)`}</h5> :
                    detailProduct.reviews.map((rev)=>{
                        return <div key={rev._id}>
                            <Reviewitem review={rev} /><hr className='solid width'/>
                        </div>
                    })
                }
            </div>
            <h3 className='lien_quan'>S???n ph???m li??n quan</h3>
            <div className='products_list'>
                {
                    allProducts.map(product=>{
                        return product.category === detailProduct.category
                        ? <ProductsItem key={product._id} product={product} related /> : null
                    })
                }
            </div>
        </div>
        <Dialog content={"L??u ?? !!!"} description={"B???n ph???i c???n ????ng nh???p ????? c?? th??? mua h??ng. B???n c?? mu???n ti???p t???c ?"} show={showDialog} cancel={cancel} confirm={toLogin} />
        </>
    );
}

export default Detailproduct;
