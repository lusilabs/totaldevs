import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchStory } from '../utils'
import { Title, Body } from './components'

const PostEntry = () => {
  const router = useRouter()
  const [story, setStory] = useState(null)

  useEffect(async () => {
    const {story} = await fetchStory(router.query.id)
    setStory(story)
  }, [])

  if (!story){
    return null;
  }

  return (
    <div className="container w-full md:max-w-3xl mx-auto pt-20">
      <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal font-sans">
        <Title {...story}/>
        <Body {...story}/>
      </div>
    </div>
  )
}
  
export default PostEntry;