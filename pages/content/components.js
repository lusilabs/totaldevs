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