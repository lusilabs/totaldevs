import { fetchStory } from '../utils'

const PostEntry = ({story}) => {
  if (!story){
    return null;
  }
  const {name, content} = story;

  return <div>
      <div>Title: {name}</div>
      <ul className='list-disc p-6'>
        {content.body.map(
          (part) => <li key={part._uid}>
                <div>Part Type: {part.component}</div>
                <div>Part Content: {part.name || part.body}</div>
            </li>)
          }
      </ul>
    </div>
}

export const getStaticProps = async ({ params, preview = null }) => {
    const {story} = await fetchStory(params.id);
    return {
      props: {
        preview,
        params,
        story
        
    }
  }
}

export const getStaticPaths = async () => {
    return {
      paths: [],
      fallback: true,
    }
  }
  
export default PostEntry;