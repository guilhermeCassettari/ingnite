import { GetStaticProps, NextApiRequest } from 'next';
import { getPrismicClient } from '../services/prismic';
import { createClient } from '../../prismicio'

type Page = {
    uid: string
    title: string
    subtitle: string
    author: string
    banner: {
        alt: string
        url: string
    }
}

interface PageProps {
    posts: Page[];
}

export default function Page({ posts }: PageProps) {
    const teste = posts.forEach(item => console.log(item))
    return (
        <>
            {posts.map(post => (
                <div key={post.uid}>
                    <p >{post.title}</p>
                    <p >{post.author}</p>
                    <img src={post.banner.url} alt={post.banner.alt} />
                </div>
            ))}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
    const client = createClient({ previewData });
    const response = await client.getAllByType("blog")
    const posts = response.map(post => {
        const postData = post.data
        return {
            uid: post.id,
            title: postData.title,
            subtitle: postData.subtitle,
            author: postData.author,
            banner: {
                alt: postData.banner.alt,
                url: postData.banner.url
            }
        }
    })
    console.log(response)

    return {
        props: {
            posts
        }
    }
}