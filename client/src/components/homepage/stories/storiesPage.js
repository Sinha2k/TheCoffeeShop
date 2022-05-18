import React,{useState,useContext, useEffect} from 'react';
import { GlobalState } from '../../../GlobalState';
import StoriesItem from '../utils/StoriesItem/storiesItem'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Row,Col } from 'react-bootstrap';
import coffeeholic from '../../header/image/coffeeholic.jpg'
import teaholic from '../../header/image/teaholic.jpg'
import blog from '../../header/image/blog.jpg'

const StoriesPage = () => {
    const [category,setCategory] = useState('Tất cả')
    const state = useContext(GlobalState)
    const [page,setPage] = useState(1)
    const [allStories] = state.storiesAPI.allStories
    const [storiesList,setStoriesList] = useState([])
    const [count,setCount] = useState(0)
    var coffee = 0 ;
    var tea = 0;
    var blogCount = 0;
    var all = 0;
    useEffect(()=>{
        allStories.forEach(story=>{
            if(story.category === category){
                all ++
            }
        })
        console.log(all)
        if(all % 5 === 0){
            setCount(all/5)
        }else{
            setCount((all - (all % 5))/5 + 1)
        }
    },[category,count,all,allStories])
    const makeStoriesList = (category)=>{
        setPage(1)
        storiesList.length = 0
        setStoriesList(storiesList)
        allStories.forEach(story=>{
            if(story.category === category){
                storiesList.push(story)
            }
        })
        setStoriesList(storiesList)
    }
    const handleChange = (event,value)=>{
        setPage(value)
    }
    return (
        <div className='storiesPage'>
            <h3>Chuyện nhà</h3>
            <div className='line_stories'></div>
            <p>The Coffee Shop sẽ là nơi mọi người xích lại gần nhau, đề cao giá trị kết nối con người và sẻ chia thân tình bên những tách cà phê, ly trà đượm hương, truyền cảm hứng về lối sống hiện đại.</p>
            <div className='control_category'>
                <div className='control_horizontal'>
                    <button onClick={()=>setCategory('Tất cả')} className={`${category === 'Tất cả' ? 'active' : ''}`}>Tất cả</button>
                    <button onClick={()=>{setCategory('Coffeeholic');makeStoriesList('Coffeeholic')}} className={`${category === 'Coffeeholic' ? 'active' : ''}`}>Coffeeholic</button>
                    <button onClick={()=>{setCategory('Teaholic');makeStoriesList('Teaholic')}} className={`${category === 'Teaholic' ? 'active' : ''}`}>Teaholic</button>
                    <button onClick={()=>{setCategory('Blog');makeStoriesList('Blog')}} className={`${category === 'Blog' ? 'active' : ''}`}>Blog</button>
                </div>
            </div>
            {
                category === 'Tất cả' ?
                <>
                <div className='stories_category'>
                    <img src={coffeeholic} alt='' />
                    <div className='category_list'>
                        <div className='story_category'> 
                            <div className='rectangle'></div>
                            <h4>Coffeeholic</h4>
                        </div>
                        <Row>
                            {
                                allStories.map(story=>{
                                    if(story.category === 'Coffeeholic'){
                                        coffee ++
                                        if(coffee < 4){
                                            return <Col lg={12} key={story._id} ><StoriesItem story={story} storiesPage /></Col>
                                        }
                                    }   
                                })
                            }
                        </Row>
                    </div>
                </div>
                <div style={{background:'white'}} className='stories_category2'>
                    <div className='category_list'>
                        <div style={{}} className='story_category'> 
                            <div className='rectangle'></div>
                            <h4>Teaholic</h4>
                        </div>
                        <Row>
                            {
                                allStories.map(story=>{
                                    if(story.category === 'Teaholic'){
                                        tea ++
                                        if(tea < 4){
                                            return <Col lg={12} key={story._id} ><StoriesItem story={story} storiesPage/></Col>
                                        }
                                    }   
                                })
                            }
                        </Row>
                    </div>
                    <img style={{marginLeft:'20px'}} src={teaholic} alt='' />
                </div>
                <div className='stories_category'>
                    <img src={blog} alt='' />
                    <div className='category_list'>
                        <div style={{}} className='story_category'> 
                            <div className='rectangle'></div>
                            <h4>Blog</h4>
                        </div>
                        <Row>
                            {
                                allStories.map(story=>{
                                    if(story.category === 'Blog'){
                                        blogCount ++
                                        if(blogCount < 4){
                                            return <Col lg={12}  key={story._id} ><StoriesItem story={story} storiesPage/></Col>
                                        }
                                    }   
                                })
                            }
                        </Row>
                    </div>
                </div>
                </>
                : 
                <>
                    <Row className='categoryList'>
                        {
                            storiesList && storiesList.slice((page-1)*5,page*5).map((story)=>{
                                return <Col lg={12} key={story._id} ><StoriesItem story={story} storiesPage /></Col> 
                            })
                        }
                    </Row>
                    <Stack style={{marginTop:'2rem'}} spacing={2}>
                        <Pagination count={count} variant="outlined" shape="rounded" color='primary' page={page} onChange={handleChange} />
                    </Stack>
                </>
            }
        </div>
    );
}

export default StoriesPage;
