import React, { useContext} from 'react';
import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/Loading/Loading';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Row,Col } from 'react-bootstrap';
import StoriesItem from '../utils/StoriesItem/storiesItem'
const Stories = () => {
    const state = useContext(GlobalState)
    const [stories] = state.storiesAPI.allStories
    var coffee = 0 ;
    var tea = 0;
    var blog = 0;
    return (
        <>
            {stories.length === 0 ? <Loading /> : ""}
            <div className='stories_page'>
                <div className='stories_header'>
                    <AutoStoriesIcon className='stories_icon'/>
                    <h1>Chuyện nhà</h1>
                </div>
                <div className='stories_body'>
                    <div className='story_category'> 
                        <div className='rectangle'></div>
                        <h3>Coffeeholic</h3>
                    </div>
                    <Row>
                        {
                            stories.map(story=>{
                                if(story.category === 'Coffeeholic'){
                                    coffee ++
                                    if(coffee < 4){
                                        return <Col lg={4} md={6} sm={12} key={story._id} ><StoriesItem story={story} /></Col>
                                    }
                                }
                                return null
                            })
                        }
                    </Row>
                    <div className='story_category'> 
                        <div className='rectangle'></div>
                        <h3>Teaholic</h3>
                    </div>
                    <Row>
                        {
                            stories.map(story=>{
                                if(story.category === 'Teaholic'){
                                    tea ++
                                    if(tea < 4){
                                        return <Col lg={4} md={6} sm={12} key={story._id} ><StoriesItem story={story} /></Col>
                                    }
                                }
                                return null
                            })
                        }
                    </Row>
                    <div className='story_category'> 
                        <div className='rectangle'></div>
                        <h3>Blog</h3>
                    </div>
                    <Row>
                        {
                            stories.map(story=>{
                                if(story.category === 'Blog'){
                                    blog ++
                                    if(blog < 4){
                                        return <Col lg={4} md={6} sm={12} key={story._id} ><StoriesItem story={story} /></Col>
                                    }
                                }
                                return null
                            })
                        }
                    </Row>
                </div>
            </div>
        </>
    );
}

export default Stories;
