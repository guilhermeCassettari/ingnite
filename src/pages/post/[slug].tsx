import { GetStaticPaths, GetStaticProps } from 'next';
import router from 'next/router';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  return (
    <h1>Teste</h1>
  )
}

export const getStaticPaths = async () => {
  // console.log('params')
  // const prismic = getPrismicClient({});
  // const posts = await prismic.getByType('blog');
  return {
    paths: [],
    fallback: true
  }
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params
  try {
    const prismic = getPrismicClient({});
    const response = await prismic.getByID(String(slug));
    console.log(response)
    const post = {
      slug,
      teste: { ...response }
    }
    return {
      props: {
        post
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/'
      }
    }
  }
};
