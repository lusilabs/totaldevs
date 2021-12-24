import { useEffect, useState } from 'react'

import { StoryCard } from '@/components/content'
import { fetchStories } from '@/utils/content'

const ContentMain = ({}) => {
    const [stories, setStories] = useState([])

    useEffect(async () => {
        const response = await fetchStories({});
        setStories(response.stories)
    }, [])

    return <div className='flex flex-col items-start'>
        {
            stories?.map((story) => <StoryCard key={story.id} {...story} />)
        }
        </div>;
}

export default ContentMain;