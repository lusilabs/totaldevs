import Link from 'next/link'

export const StoryCard = ({ name, created_at, id}) => {
    return <div className={'w-1/4 p-6 m-6 bg-white rounded-xl shadow-lg flex font-sans'}>
        <div className={'flex flex-col'}>
            <div className={'font-medium'}>{name}</div>
            <span className={'text-gray-500'}>Published on {new Date(created_at).toLocaleDateString()}</span>
            <Link href={`/content/posts/${id}`}>
                <a>Read post...</a>
            </Link>
        </div>
    </div>;
}


const Feature = ({ name }) => {
    return <p className={"py-6"}>{name}</p>
}

const Content = ({ body }) => {
    return <p className={"py-6"}>{body}</p>
}

// todo: define all content types from storyblok
const COMPONENT_MAP = {
    'feature': Feature,
    'content': Content,
}

export const Title = ({name, created_at}) => {
    return <div>
        <p className="text-base md:text-sm text-green-500 font-bold"> 
            <Link href={'/content'}>
                <a href="#" className="text-base md:text-sm font-bold no-underline hover:underline">BACK TO POSTS</a>
            </Link>
        </p>
        <h1 className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">{name}</h1>
        <p className="text-sm md:text-base font-normal text-gray-600">Published on {new Date(created_at).toLocaleDateString()}</p>
    </div>
}

export const Body = ({content}) => {
    return <>
        {content.body.map((part) => {
            const Component = COMPONENT_MAP[part.component]
            if (!Component) {
                return null
            }
            return <Component key={part._uid} {...part} />
        })}
    </>    
}