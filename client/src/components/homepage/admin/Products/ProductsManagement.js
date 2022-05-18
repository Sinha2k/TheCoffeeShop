import React, { useContext,useEffect,useState } from 'react';
import {GlobalState} from '../../../../GlobalState'
import NotFound from '../../utils/NotFound/NotFound'
import { Table } from 'react-bootstrap';
import { Modal,Button } from 'react-bootstrap';
import { storage } from '../../../../firebase';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import { toast } from 'react-toastify';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import MegaMenu from '../../../header/MegaMenu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DiscountIcon from '@mui/icons-material/Discount';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const ProductsManagement = ({props}) => {
    const [size,setSize] = useState([])
    const initialState ={
        product_id:'',
        title:'',
        price:0,
        description:'',
        content:'',
        category:'',
        size:size,
        images:''
    }
    const [productSale,setProductSale] = useState({
        startSale:"",
        endSale :"",
        priceSale:0
    })
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const [allProducts] = state.productsAPI.allProducts
    const [lgShow, setLgShow] = useState(false);
    const [edit,setEdit] = useState(false)
    const [id,setId] = useState('')
    const [progress,setProgress] = useState(0)
    const [callback, setCallback] = state.productsAPI.callback
    const [product, setProduct] = useState(initialState)
    const [token] = state.token
    const [open, setOpen] = useState(false);
    const handlerInput = (e)=>{
        const {name, value} = e.target
        setProductSale({...productSale, [name]:value})
    }
    const sale = async (id) => {
        setOpen(false)
        const start = moment(productSale.startSale).format('lll')
        const end = moment(productSale.endSale).format('lll')
        productSale.startSale = start
        productSale.endSale = end
        try {
            await axios.put('/products/'+id+'/sale',{...productSale},{
                headers:{Authorization:token}
            })
            setCallback(!callback)
            toast.success("Tạo sale sản phẩm thành công")
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCheckbox = (event)=>{
        const {value,checked} = event.target
        setSize([])
        if(checked){
            setSize([...size,value])
        }else{
            setSize(size.filter((e)=> e !== value))
        }
    }
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setProduct({...product, [name]:value})
    }
    const formHandler = (e)=>{
        e.preventDefault()
        const file = e.target[0].files[0]
        console.log(file)
        uploadFile(file)
    }
    const uploadFile = (file)=>{
        if(!file) {
            toast.error("File doesn't exist")
        };
        if(file.size> 1024*1024){
            toast.error("File too large")
        }
        if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg'){
            toast.error("File format is incorrect")
        }
        const storageRef = ref(storage,`/files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef,file)

        uploadTask.on("state_changed", (snapshot)=>{
            const prog = Math.round((snapshot.bytesTransferred/ snapshot.totalBytes)*100)
            setProgress(prog)
        }, (err)=> console.log(err),
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((url)=>{setProduct({...product,images:url});console.log(url);})
          } 
        ) 
    }
    const handlerSubmit = async e =>{
        e.preventDefault()
        product.size = size
        if(!product.images){
            toast.error("No images upload")
        }
        try {
            if(edit){
                await axios.put('/products/'+id,{...product},{
                    headers:{Authorization:token}
                })
                toast.success("Cập nhật sản phẩm thành công")
            }else{
                await axios.post('/products',{...product},{
                    headers:{Authorization:token}
                })
                toast.success("Thêm mới sản phẩm thành công")
            }
            setCallback(!callback)
            setLgShow(false)
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }
    const deleteProduct = async (id)=>{
        try {
            if(window.confirm('Bạn thực sự muốn xóa sản phẩm này ???')){
                await axios.delete('/products/'+id,{
                    headers:{Authorization:token}
                })
                toast.success("Xóa sản phẩm thành công")
                setCallback(!callback)
            } 
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }
    useEffect(()=>{
        if(id){
            allProducts.forEach(item=>{
                if(item._id === id){
                    product.size = item.size
                    setSize(item.size)
                    setProduct(item)
                    setEdit(true)
                }
            })
        }else{
            setSize([])
            setProduct(initialState)
            setEdit(false)
        }
    },[id,allProducts])
    return (
        <>
            {
                isAdmin ?
                <>
                    <MegaMenu />
                    <div className='order_history'>
                        <h1>Quản lý sản phẩm</h1>
                        <h4>Bạn có {allProducts.length} sản phẩm</h4>
                        <Button className='button_modal' onClick={() => {setLgShow(true);setId('')}}>Thêm</Button>
                        <Modal
                            size="lg"
                            show={lgShow}
                            onHide={() => setLgShow(false)}
                            aria-labelledby="example-modal-sizes-title-lg"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-lg">
                                    {
                                        edit ? <h2>Cập nhật sản phẩm</h2> : <h2>Thêm mới sản phẩm</h2>
                                    }
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='modal_product'>
                                <div className='row_item'>
                                    <div className='item_row'>
                                        <h6>Product_Id</h6>
                                        {
                                            edit ? <input readOnly name='product_id' required value={product.product_id} onChange={handleChangeInput} style={{width:"80px"}}/> : <input name='product_id' required value={product.product_id} onChange={handleChangeInput} style={{width:"80px"}} placeholder='pro**'/>
                                        }
                                        
                                    </div>
                                    <div className='item_row'>
                                        <h6>Title</h6>
                                        <input className='title' name='title' required value={product.title} onChange={handleChangeInput} placeholder='Americano Nóng'/>
                                    </div>
                                    
                                </div>
                                <div className='row_item'>
                                    <div className='item_row'>
                                        <h6>Kích cỡ</h6>
                                        <div className='size_field'>
                                            <input checked={size.includes("Nhỏ")} onChange={handleCheckbox}  value="Nhỏ" type="checkbox" id='Nhỏ'/><label htmlFor='Nhỏ'>Nhỏ</label>
                                            <input checked={size.includes("Vừa")} onChange={handleCheckbox}  value="Vừa" type="checkbox" id='Vừa'/><label htmlFor='Vừa'>Vừa</label>
                                            <input checked={size.includes("Lớn")} onChange={handleCheckbox}  value="Lớn" type="checkbox" id='Lớn'/><label htmlFor='Lớn'>Lớn</label>
                                        </div>
                                        
                                    </div>
                                    <div className='item_row'>
                                        <h6>Giá</h6>
                                        <input name='price' required value={product.price} onChange={handleChangeInput} placeholder='100000'/>
                                    </div>
                                </div>
                                <div className='row_category'>
                                    <h6>Thể loại</h6>
                                    <select name='category' value={product.category} onChange={handleChangeInput}>
                                        <option>Cà phê Việt Nam</option>
                                        <option>Cà phê máy</option>
                                        <option>Cold Brew</option>
                                        <option>Trà sữa Macchiato</option>
                                        <option>Trà trái cây</option>
                                        <option>Cà phê tại nhà</option>
                                        <option>Trà tại nhà</option>
                                    </select>
                                </div>
                                <form onSubmit={formHandler}>
                                    <input accept='.jpg,.png' id='file' type="file" />
                                    <label htmlFor='file'>
                                        <i className="fa fa-file-image-o" aria-hidden="true"></i>
                                        Chọn ảnh
                                    </label>
                                    <button type='submit' >Tải lên</button><span>Uploaded {progress} %</span>
                                </form>
                                <h6>Mô tả</h6>
                                <textarea className='description' required value={product.description} type='text' name='description' onChange={handleChangeInput} placeholder='Description...'  rows="8" cols="116"></textarea>
                            </Modal.Body>
                            <Modal.Footer className='modal_footer'>
                                <Button className='button_modal' onClick={() => setLgShow(false)}>Thoát</Button>
                                <Button type='submit' className='button_modal' onClick={handlerSubmit}>Lưu</Button>
                            </Modal.Footer>
                        </Modal>
                        <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                        >
                            <DialogTitle>{"Create sale for this product?"}</DialogTitle>
                            <DialogContent className='dialog_body'>
                                <h5>Giá sale</h5>
                                <TextField required name='priceSale'  onChange = {handlerInput} value={productSale.priceSale} placeholder='20000' className='text_field' />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        required
                                        label="Ngày bắt đầu sale"
                                        value={productSale.startSale}
                                        onChange = {(value)=> setProductSale({...productSale,startSale:value})}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    <div className='distance'></div>
                                    <DatePicker 
                                        required                                     
                                        label="Ngày kết thúc sale"
                                        value={productSale.endSale}
                                        onChange = {(value)=> setProductSale({...productSale,endSale:value})}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                
                            </DialogContent>
                            <DialogActions className='button_dialog'>
                                <Button onClick={handleClose}>Thoát</Button>
                                <Button onClick={()=>sale(id)}>Bắt đầu</Button>
                            </DialogActions>
                        </Dialog>
                        <div style={{height:"450px"}} className='order_products'>
                            <Table striped bordered hover className='table_history'>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Title</th>
                                        <th>Image</th>
                                        <th>Size</th>
                                        <th>Price</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allProducts.map(item =>(
                                            <tr key={item._id}>
                                                <td>{item.product_id}</td>
                                                <td>{item.title}</td>
                                                <td><img src={item.images} alt='' /></td>
                                                <td>{item.size}</td>
                                                <td>{item.price}đ</td>
                                                <td>{item.description.slice(0,5)}...</td>
                                                <td>{item.category}</td>
                                                <td><Tooltip title="Chỉnh sửa" placement='left'><EditIcon className='icon' onClick={()=> {setId(item._id);setLgShow(true)}} style={{color:"rgb(109, 196, 28)",cursor:'pointer'}}></EditIcon></Tooltip></td>
                                                <td><Tooltip title="Xóa" placement='top'><DeleteIcon className='icon' onClick={()=> deleteProduct(item._id)} style={{color:"red",cursor:'pointer'}}></DeleteIcon></Tooltip></td>
                                                <td>
                                                    <Tooltip title="Sale" placement='right'>
                                                        <DiscountIcon onClick={()=> {setOpen(true);setId(item._id)}} style={{color:"#FBFF31",cursor:'pointer'}}></DiscountIcon>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>  
                    </div>
                </>
                : <NotFound />
            }
        </>
       
    );
}

export default ProductsManagement;
