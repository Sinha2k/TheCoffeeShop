import React from 'react';

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer_part'>
                <div className='footer_item'>
                    <h5>Giới thiệu</h5>
                    <h5>Về Chúng tôi</h5>
                    <h5>Sản phẩm</h5>
                    <h5>Khuyến mãi</h5>
                    <h5>Chuyện cà phê</h5>
                    <h5>Cửa hàng</h5>
                    <h5>Tuyển dụng</h5>
                </div>
                <div className='footer_item'>
                    <h5>Điều khoản</h5>
                    <h5>Điều khoản sử dụng</h5>
                    <h5>Quy tắc bảo mật</h5>
                </div>
            </div>
            <div style={{paddingBottom:'4rem'}} className='footer_part different'>
                <div className='footer_item'>
                    <div className="item_footer">
                        <i style={{marginTop:'0.5rem'}} className="fa fa-phone" aria-hidden="true"></i>
                        <h5 style={{fontSize:'16px',fontWeight:'500'}}>Đặt hàng: 1800 6936</h5>
                    </div>
                    <div className="item_footer">
                        <i style={{marginTop:'0.5rem'}} className="fa fa-map-marker" aria-hidden="true"></i> 
                        <h5 style={{fontSize:'16px',fontWeight:'500'}}>Liên hệ</h5>
                    </div>
                    <h5>Tầng 5, tòa nhà Landmark, ngách 35/18, đường Thanh Bình, Mộ Lao, Hà Đông, Hà Nội, Việt Nam</h5>
                </div>
                <div style={{marginTop:'1rem'}} className='footer_item'>
                    <i className="fa fa-facebook-official" aria-hidden="true"></i>
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    );
}

export default Footer;
