
const mainStoryFetch = ({path = '', query_string = 'version=draft'}) => {
    return fetch(`https://api.storyblok.com/v2/cdn/stories${path}/?${query_string}` +
        `&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`).then(response => response.json())
}

export const fetchStories = ({}) => {
    return mainStoryFetch({})
}

export const fetchStory = (id) => {
    return mainStoryFetch({path: `/${id}`})
}