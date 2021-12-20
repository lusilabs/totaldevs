import { fetchStories } from './utils'
import { StoryCard } from './components'

const CMSMain = ({stories}) => {
    return <div className='flex flex-col items-start'>
        {
            stories?.map((story) => <StoryCard key={story.id} {...story} />)
        }
        </div>;
}

export const getStaticProps = async ( {params, preview = null}) => {
    const { stories } = await fetchStories({});
    return {
        props: {
            stories
        }
    };
}
export default CMSMain;