import React,{useContext,useState,useEffect} from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductsItem from '../utils/ProductsItem/productsItem'
import Filter from '../utils/ProductsItem/Filter';
import Loading from '../utils/Loading/Loading';
import CoffeeMakerIcon from '@mui/icons-material/CoffeeMaker';
import img_1 from '../../header/image/poster1.jpg'
import img_2 from '../../header/image/poster2.jpg'
import banner_1 from '../../header/image/tra_long_nhan.png'
import banner_2 from '../../header/image/ca_phe_den_da.png'
import { Carousel } from 'react-bootstrap';
import coffee_sale from '../../header/image/coffee_sale.jpg'
const Products = () => {
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const [option,setOption] = useState('Đang sale')
    const [searchTerm,setSearchTerm] = useState('')
    const [sort,setSort] = state.productsAPI.sort
    var count = 0
    useEffect(()=>{
        if(option === 'Đang sale'){
            setSort('')
        }else if(option === 'Đắt nhất'){
            setSort('sort=-price')
        }else if(option === 'Rẻ nhất'){
            setSort('sort=price')
        }else if(option === 'Mua nhiều nhất'){
            setSort('sort=-sold')
        }else if(option === 'Mới nhất'){
            setSort('sort=-createdAt')
        }else if(option === 'Xếp hạng'){
            setSort('sort=-ratings')
        }
    },[sort,option,setSort]);
    return (
        <>
            <Carousel className="w-100 carousel">
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={img_1}
                    alt=""
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={img_2}
                    alt=""
                    />
                </Carousel.Item>
            </Carousel>
            <div>
                {products.length === 0 && <Loading/>}
                <div className='product_header'>
                    <CoffeeMakerIcon className='coffee_icon'/>
                    <h1>Đồ uống</h1>
                </div>
                <div className='filter_search'>
                    <div className='search_bar'>
                        <input type="checkbox" id='check'/>
                        <div className='box'>
                            <input onChange={(event)=>setSearchTerm(event.target.value)} type="text" className='search_input' placeholder='Bạn muốn uống gì ?...' />
                            <label htmlFor="check"><i className="fa fa-search" aria-hidden="true"></i></label>
                        </div>
                    </div>
                    <Filter option={option} setOption={setOption} />
                </div>
            <div className='products'>    
                        <img className='discount' alt='' src={coffee_sale} />      
                        <div></div>        
                        {
                            products.filter((product)=>{
                                if(searchTerm === ""){
                                    return product
                                }else if(product.title.toLowerCase().includes(searchTerm.toLowerCase())){
                                    return product
                                }
                            }).map(product =>{
                                if(product.category !== 'Trà tại nhà' && product.category !== 'Cà phê tại nhà'){
                                    count ++
                                    if(count < 11){
                                        return  <ProductsItem key={product._id} product={product}/>
                                    }
                                }
                                return null
                        })
                        } 
                </div>
            </div>
            <div className='banner'>
               <div className='banner_content'>
                   <h3>Trà long nhãn hạt chia</h3>
                   <p>Quả Phúc Bồn Tử hoàn toàn tự nhiên, được các barista Nhà kết hợp một cách đầy tinh tế cùng trà Oolong và cam vàng tạo ra một dư vị hoàn toàn tươi mới. Mát lạnh ngay từ ngụm đầu tiên, đọng lại cuối cùng là hương vị trà thơm lừng và vị ngọt thanh, chua dịu khó quên của trái phúc bồn tử.</p>
                   <button onClick={()=>window.location.href = `/detail/62207b511cc810065fcd48b1`}>Tìm hiểu thêm</button>
               </div>
               <div className='banner_img'><img src={banner_1} alt='' /></div>
            </div>
            <div style={{background:'white'}} className='banner2'>
               <div className='banner_img'><img src={banner_2} alt='' /></div>
               <div className='banner_content'>
                   <h3>Cà phê đen đá</h3>
                   <p>Không ngọt ngào như Bạc sỉu hay Cà phê sữa, Cà phê đen mang trong mình phong vị trầm lắng, thi vị hơn. Người ta thường phải ngồi rất lâu mới cảm nhận được hết hương thơm ngào ngạt, phảng phất mùi cacao và cái đắng mượt mà trôi tuột xuống vòm họng.</p>
                   <button onClick={()=>window.location.href = `/detail/62207a7f1cc810065fcd48a1`}>Tìm hiểu thêm</button>
               </div>
            </div>
        </>
    );
}

export default Products;
