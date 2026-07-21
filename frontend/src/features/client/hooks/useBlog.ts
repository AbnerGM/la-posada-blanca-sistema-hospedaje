import { useState, useEffect } from 'react';
import { getPostsPublicos } from '../services/blogService';
import type { BlogPost } from '../types/blog';

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getPostsPublicos().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return { posts, loading };
};