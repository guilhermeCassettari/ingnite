
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [havePostPagination, setHavePostPagination] = useState(postsPagination.next_page)
  return (
    <>
      {postsPagination.results.map(post => (
        <Link key={post.uid} href={`/post/${post.uid}`}>
          <a>
            <h1>{post.uid}</h1>
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
            <div>
              <h1>{post.data.author}</h1>
              <time>{post.first_publication_date}</time>
            </div>
          </a>
        </Link>
      ))}
      {havePostPagination && <h1>Carregar mais posts</h1>}
    </>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({})
  const postsResponse = await prismic.getByType('blog')

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(post => {
      return {
        uid: post.id,
        first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }
      }
    })
  }

  return {
    props: {
      postsPagination
    }
  }
};
