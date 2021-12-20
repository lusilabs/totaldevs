
export const StoryCard = ({ name, created_at, id}) => {
    return <div className={'w-1/4 p-6 m-6 bg-white rounded-xl shadow-lg flex'}>
        <div className={'flex flex-col'}>
            <a href={`/cms/posts/${id}`}>{name}</a>
            <span>{created_at}</span>
        </div>
    </div>;
}
