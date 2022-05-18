import React from 'react';
import { useContext } from 'react';
import img from '../../header/image/Poster.JPG'
import { GlobalState } from '../../../GlobalState';
import ProductsItem from '../utils/ProductsItem/productsItem';
import Loading from '../utils/Loading/Loading';
const MenuPage = () => {
    const state = useContext(GlobalState)
    const [allProducts] = state.productsAPI.allProducts
    return (
        <div>
            {allProducts.length === 0 && <Loading/>}
            <div className='menu_page'>
                <div className='page_content'>
                    <section id="tat_ca">
                        <img className='poster' src={img} alt="" />
                    </section>
                    <hr className="solid"></hr>
                    <section id="ca_phe">
                        <h2>Cà phê</h2>
                        <section id="ca_phe_viet_nam">
                            <h3>Cà phê Việt Nam</h3>
                            <div className='products_list'>
                                {
                                    allProducts.map(product=>{
                                        return product.category === "Cà phê Việt Nam"
                                        ? <ProductsItem key={product._id} product={product} related /> : null
                                    })
                                }
                            </div>
                        </section>
                        <section id="ca_phe_may">
                            <h3>Cà phê Máy</h3>
                            <div className='products_list'>
                                {
                                    allProducts.map(product=>{
                                        return product.category === "Cà phê máy"
                                        ? <ProductsItem key={product._id} product={product} related /> : null
                                    })
                                }
                            </div>
                        </section>
                        <section id="cold_brew">
                            <h3>Cold Brew</h3>
                            <div className='products_list'>
                                {
                                    allProducts.map(product=>{
                                        return product.category === "Cold Brew"
                                        ? <ProductsItem key={product._id} product={product} related /> : null
                                    })
                                }
                            </div>
                        </section>
                    </section>
                    <hr className="solid"></hr>
                    <section id="tra">
                        <h2>Trà</h2>
                        <section id="tra_trai_cay">
                            <h3>Trà trái cây</h3>
                            <div className='products_list'>
                                {
                                    allProducts.map(product=>{
                                        return product.category === "Trà trái cây"
                                        ? <ProductsItem key={product._id} product={product} related /> : null
                                    })
                                }
                            </div>
                        </section>
                        <section id="tra_sua_macchiato">
                            <h3>Trà sữa Macchiato</h3>
                            <div className='products_list'>
                                {
                                    allProducts.map(product=>{
                                        return product.category === "Trà sữa Macchiato"
                                        ? <ProductsItem key={product._id} product={product} related /> : null
                                    })
                                }
                            </div>
                        </section>
                    </section>
                </div>
                <div className="section-nav">
                    <ol>
                        <li><a href="#tat_ca">Tất cả</a></li>
                        <li><a href="#ca_phe">Cà phê</a>
                            <ul>
                                <li className=""><a href="#ca_phe_viet_nam">Cà phê Việt Nam</a></li>
                                <li className=""><a href="#ca_phe_may">Cà phê Máy</a></li>
                                <li className=""><a href="#cold_brew">Cold Brew</a></li>
                            </ul>
                        </li>
                        <li><a href="#tra">Trà</a>
                            <ul>
                                <li className=""><a href="#tra_trai_cay">Trà trái cây</a></li>
                                <li className=""><a href="#tra_sua_macchiato">Trà sữa Macchiato</a></li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default MenuPage;
