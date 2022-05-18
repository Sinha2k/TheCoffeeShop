import React from 'react';
import moment from 'moment';

const StoriesItem = ({story,storiesPage}) => {
    return (
            <div onClick={()=> {window.location.href = '/detail/story/' + story._id}} className={`${storiesPage ? 'stories_card': 'story_card'}`}>
                <div className='story_image'><img alt='' src={story.image} /></div>
                <div className='storyItem_content'>
                    {
                        storiesPage ? 
                        <>
                            <h4>{story.title.length < 60 ? story.title : story.title.slice(0,60) + '...'}</h4>
                            <p style={{opacity:'0.7'}}>{moment(story.createdAt).subtract(10, 'days').calendar()}</p>
                            <p>{story.description.slice(0,170)}...</p>
                        </>
                        :
                        <>
                            <p>{moment(story.createdAt).subtract(10, 'days').calendar()}</p>
                            <h4>{story.title.slice(0,30)}...</h4>
                            <p>{story.description.slice(0,170)}...</p>
                        </>
                    }
                </div>
            </div>
    );
}

export default StoriesItem;
